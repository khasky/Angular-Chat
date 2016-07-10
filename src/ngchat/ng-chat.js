(function () {
    'use strict';
	angular.module('ngChatModule', ['ngSanitize'])
		.config(['$httpProvider', function ($httpProvider) {
			// Intercept POST requests, convert to standard form encoding
			$httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
			
			$httpProvider.defaults.transformRequest.unshift(function(data, headersGetter){
				var key, result = [];
				
				if(typeof data === "string")
					return data;

				for(key in data){
					if(data.hasOwnProperty(key))
						result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
				}
				return result.join("&");
			});
		}])
		.factory('ngChatService', ['$q', '$http', function ($q, $http){
			return {
				getHistory: function () {
					return $http.get('ngchat/read.php').then(function(resp){
						return resp.data ? resp.data : $q.reject(resp.data);
					}, function (resp){
						return $q.reject(resp.data);
					});
				},
				adminCommand: function (args) {
					return $http({
						method: 'POST',
						url: 'ngchat/admin.php',
						data: args,
						dataType: 'json',
						headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					}).then(function(resp){
						return resp.data ? resp.data : $q.reject(resp.data);
					}, function (resp){
						return $q.reject(resp.data);
					});
				},
				send: function (args) {
					return $http({
						method: 'POST',
						url: 'ngchat/send.php',
						data: args,
						dataType: 'json',
						headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					}).then(function(resp){
						return resp.data ? resp.data : $q.reject(resp.data);
					}, function (resp){
						return $q.reject(resp.data);
					});
				},
				status: function (args) {
					return $http({
						method: 'POST',
						url: 'ngchat/status.php',
						data: args,
						dataType: 'json',
						headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					}).then(function(resp){
						return resp.data ? resp.data : $q.reject(resp.data);
					}, function (resp){
						return $q.reject(resp.data);
					});
				}
			};
		}])
		.directive('ngChatInputFocus', function () {
			return {
				restrict: 'A',
				link: function (scope, element) {
					var focusedElement;
					element.on('click', function () {
						if (focusedElement != this) {
							this.select();
							focusedElement = this;
						}
					});
					element.on('blur', function () {
						focusedElement = null;
					});
				}
			};
		})
		.directive('ngChat', function () {
			return {
				restrict: 'E',
				templateUrl: 'ngchat/ng-chat.html',
				replace: true,
				controller: ['$scope', '$element', '$interval', '$timeout', '$sce', 'ngChatService', function ($scope, $element, $interval, $timeout, $sce, ngChatService) {
					/* 
					 * Utility functions
					 */
					String.prototype.replaceAll = function (s, r) {
						return this.split(s).join(r);
					};
					
					jQuery.fn.getSelectionStart = function () {
						var n, t, i;
						return this.lengh == 0 ? -1 : (n = this[0], t = n.value.length, n.createTextRange ? (i = document.selection.createRange().duplicate(), i.moveEnd("character", n.value.length), t = i.text == "" ? n.value.length : n.value.lastIndexOf(i.text)) : typeof n.selectionStart != "undefined" && (t = n.selectionStart), t)
					};
					jQuery.fn.getCursorPosition = function () {
						return this.lengh == 0 ? -1 : $(this).getSelectionStart()
					};
					
					function hashCode (s) {
						var hash = 0;
						for (var i = 0; i < s.length; i++) {
						   hash = s.charCodeAt(i) + ((hash << 5) - hash);
						}
						return hash;
					}
					
					function intToRGB (i) {
						var c = (i & 0x00FFFFFF).toString(16).toUpperCase();
						return "00000".substring(0, 6 - c.length) + c;
					}
					
					function invertHexColor (color) {
						color = color.substring(1); // remove #
						color = parseInt(color, 16); // convert to integer
						color = 0xFFFFFF ^ color; // invert three bytes
						color = color.toString(16); // convert to hex
						color = ("000000" + color).slice(-6); // pad with leading zeros
						color = "#" + color; // prepend #
						return color;
					}
					
					/*
					 * Data
					 */
					var MAX_NAME_LENGTH = 16;
					var MAX_REPLY_LENGTH = 255;
					var MIN_REFRESH_TIME = 5;
					var MAX_REFRESH_TIME = 300;
					
					$scope.dateFormat = 'dd.mm.yyyy HH:mm:ss';
					
					var SMILIES_SRC = 'ngchat/smilies/';
					var SMILIES_FORMAT = '.gif';
					
					var CLASSNAME_RESIZER = '.ng-chat-resizer';
					var CLASSNAME_HISTORY = '.ng-chat-history';
					
					$scope.smilies = [
						{ code: 'aa', emotions: ['O:-)','O=)'] },
						{ code: 'ab', emotions: [':-)',':)','=)'] },
						{ code: 'ac', emotions: [':-(',':(',';('] },
						{ code: 'ad', emotions: [';-)',';)'] },
						{ code: 'ae', emotions: [':-P'] },
						{ code: 'af', emotions: ['8-)'] },
						{ code: 'ag', emotions: [':-D'] },
						{ code: 'ah', emotions: [':-['] },
						{ code: 'ai', emotions: ['*shock*','=-O'] },
						{ code: 'aj', emotions: [':-*'] },
						{ code: 'ak', emotions: [':\'('] },
						{ code: 'al', emotions: [':-X',':-x'] },
						{ code: 'am', emotions: ['>:o'] },
						{ code: 'an', emotions: [':-|'] },
						{ code: 'ao', emotions: [':-\\',':-/'] },
						{ code: 'ap', emotions: ['*jokingly*'] },
						{ code: 'aq', emotions: [']:->', '*devil*'] },
						{ code: 'ar', emotions: ['[:-}'] },
						{ code: 'as', emotions: ['*kissed*'] },
						{ code: 'at', emotions: [':-!'] },
						{ code: 'au', emotions: ['*tired*'] },
						{ code: 'av', emotions: ['*stop*'] },
						{ code: 'aw', emotions: ['*kissing*'] },
						{ code: 'ax', emotions: ['@}->--'] },
						{ code: 'ay', emotions: ['*thumbsup*'] },
						{ code: 'az', emotions: ['*drink*'] },
						{ code: 'ba', emotions: ['*inlove*'] },
						{ code: 'bb', emotions: ['@='] },
						{ code: 'bc', emotions: ['*help*'] },
						{ code: 'bd', emotions: ['\\m/'] },
						{ code: 'be', emotions: ['%)'] },
						{ code: 'bf', emotions: ['*ok*'] },
						{ code: 'bg', emotions: ['*wassup*','*sup*'] },
						{ code: 'bh', emotions: ['*sorry*'] },
						{ code: 'bi', emotions: ['*clapping*'] },
						{ code: 'bj', emotions: ['*rofl*', '*lol*'] },
						{ code: 'bk', emotions: ['*pardon*'] },
						{ code: 'bl', emotions: ['*no*'] },
						{ code: 'bm', emotions: ['*crazy*'] },
						{ code: 'bn', emotions: ['*dontknow*'] },
						{ code: 'bo', emotions: ['*dance*'] },
						{ code: 'bp', emotions: ['*yahoo*'] },
						{ code: 'bq', emotions: ['*hi*', '*hello*'] },
						{ code: 'br', emotions: ['*bye*'] },
						{ code: 'bs', emotions: ['*yes*'] },
						{ code: 'bt', emotions: [';D','*acute*'] },
						{ code: 'bu', emotions: ['*wall*', '*dash*'] },
						{ code: 'bv', emotions: ['*write*', '*mail*'] },
						{ code: 'bw', emotions: ['*scratch*'] }
					];
					
					$scope.initialized = false;
					$scope.refreshing = false;
					
					$scope.name = '';
					$scope.reply = '';
					$scope.history = [];
					
					$scope.refreshTime = MIN_REFRESH_TIME * 2;
					
					var refreshInt;
					
					var users = [];
					var admins = [];
					
					/*
					 * Private functions
					 */
					function insertSmilies (text) {
						_.forEach($scope.smilies, function(sml) {
							_.forEach(sml.emotions, function(emo) {
								if(text.toLowerCase().indexOf(emo.toLowerCase()) != -1) {
									var rep = '<img src="' + $scope.getSmileUrl(sml.code) + '" alt="' + emo + '" />';
									text = text.replaceAll(emo, rep);
								}
							});
						});
						
						return text;
					}
					
					function updateHistorySmilies () {
						if(!$scope.history || !$scope.history.length)
							return;
						
						_.forEach($scope.history, function (obj) {
							obj.message = insertSmilies(obj.message);
						});
					}
					
					function resetScroll () {
						var elem = $(CLASSNAME_HISTORY);
						if (elem) {
							$timeout(function() {
								elem.scrollTop(elem[0].scrollHeight);
							}, 50);
						}
					}
					
					function adminInfo () {
						ngChatService.adminCommand({
							userId: $scope.guid(),
							action: 'GET',
							args: {}
						}).then(function (resp) {
							//console.log('ngChatService.adminCommand():');
							//console.log(resp);
							admins = resp;
						});
					}
					
					function userInfo () {
						ngChatService.status({
							userId: $scope.guid()
						}).then(function (resp) {
							if(resp && resp.length) {
								users = _.map(resp, function(r) {
									return r.userId
								});
							}
						}, function (){
							console.log('ngChatService.status() error');
						});
					}
					
					function refresh () {
						if($scope.refreshing)
							return;
						
						console.log('refresh() started');
						$scope.refreshing = true;
						
						userInfo();
						
						ngChatService.getHistory().then(function (resp) {
							console.log('ngChatService.getHistory(): ' + (resp ? resp.length : 0));
							//console.log(resp);
							
							if($scope.history.length) {
								var lastExistId = _.last($scope.history).messageId;
								var lastNewerId = _.last(resp).messageId;
								
								if(lastExistId == lastNewerId)
								{
									console.log('last message is the same... do nothing');
								}
								else if(lastExistId < lastNewerId)
								{
									var countNewer = lastNewerId - lastExistId;

									console.log('count of newer: ' + countNewer);
									
									_.forEach(_.takeRight(resp, countNewer), function (n) {
										n.message = insertSmilies(n.message);
										$scope.history.push(n);
									});
									
									resetScroll();
								}
								
								console.log('refresh() ended');
							}
							else {
								console.log('first load');
								
								$scope.history = resp;
								updateHistorySmilies();
								resetScroll();
								
								console.log('refresh() ended');
							}
						}, function (resp) {
							console.log('ngChatService.getHistory() error');
						})['finally'](function () {
							$scope.refreshing = false;
							$scope.initialized = true;
						});
					}
					
					/* 
					 * Public functions
					 */
					$scope.guid = function () {
						var nav = window.navigator;
						var screen = window.screen;
						var guid = nav.mimeTypes.length;
						guid += nav.userAgent.replace(/\D+/g, '');
						guid += nav.plugins.length;
						guid += screen.height || '';
						guid += screen.width || '';
						guid += screen.pixelDepth || '';

						return guid;
					};
					
					$scope.getUserBg = function (obj) {
						if(!obj.toggle)
							return '';
						return '#' + intToRGB(hashCode(obj.userId));
					};
					
					$scope.getUserColor = function (obj) {
						if(!obj.toggle)
							return '';
						return invertHexColor($scope.getUserBg(obj.userId));
					};
					
					$scope.isUserOnline = function (userId){
						if(!userId || !userId.length)
							return false;
						return _.some(users, function (u) {
							return u === userId;
						});
					};
					
					$scope.isUserAdmin = function () {
						if(!admins || !admins.length)
							return false;
						return _.some(admins, function (a) {
							return a === $scope.guid();
						});
					};
					
					$scope.getHtmContent = function (s) {
						if (!s) return '';
						return $sce.trustAsHtml(s);
					};
					
					$scope.getSmileUrl = function (code){
						return SMILIES_SRC + code + SMILIES_FORMAT;
					};
					
					$scope.refreshTimeChanged = function (){
						if($scope.refreshTime > MAX_REFRESH_TIME)
							$scope.refreshTime = MAX_REFRESH_TIME;
						if($scope.refreshTime < MIN_REFRESH_TIME)
							$scope.refreshTime = MIN_REFRESH_TIME;
					};
					
					$scope.insertText = function (text) {
						var cursorPosition = $('#idreply').getCursorPosition();
						
						if(!$scope.reply.trim().length)
							text = ' ' + text;
						
						$scope.reply = [$scope.reply.slice(0, cursorPosition), text, $scope.reply.slice(cursorPosition)].join('');
					};
					
					$scope.quote = function (userId, userName) {
						if(userId === $scope.guid() || $scope.reply.trim().length)
							return;
						$scope.reply = userName + ', ' + $scope.reply;
					};
					
					$scope.adminDelete = function (obj) {
						var accept = confirm("Are you sure would like to remove this message?");
						if (accept == true) {
							ngChatService.adminCommand({
								userId: $scope.guid(),
								action: 'DELETE',
								args: { historyObject: obj }
							}).then(function (resp) {
								console.log('ngChatService.adminCommand():');
								console.log(resp);
								
								_.remove($scope.history, function (his) {
									return his.messageId == obj.messageId;
								});
							}, function (e){
								console.log('ngChatService.adminCommand() error');
							});
						}
					};
					
					$scope.tempEditFocusOut = function (obj) {
						if (obj.edited === obj.message) {
							obj.isEditing = false;
						}
						else if (obj.isEditing && obj.edited.trim().length) {
							var accept = confirm("Would you like to edit this message?");
							if (accept == true) {
								// TODO
								obj.message = angular.copy(obj.edited);
							}
							
							obj.isEditing = false;
						}
					};
					
					$scope.adminEdit = function (obj) {
						//if (!obj.edited || !obj.edited.trim().length)
						obj.edited = angular.copy(obj.message);
						
						//var elem = angular.element($element[0].querySelector('#idedit'));
						//if (elem) {
						//	elem.focus();
						//}
						
						if(!obj.isEditing)
							obj.isEditing = true;
						else {
							$scope.tempEditFocusOut(obj);
						}
					};
					
					$scope.toggleDetails = function (obj) {
						obj.toggle = !obj.toggle;
					};
					
					$scope.directRefresh = function (){
						refresh();
					};
					
					refreshInt = $interval(function() {
						refresh();
					}, $scope.refreshTime * 1000);
					
					$scope.clear = function(){
						if(!$scope.reply || !$scope.reply.length)
							return;
						$scope.reply = '';
					};
					
					$scope.nameKeyPress = function (e) {
						if($scope.name.length == MAX_NAME_LENGTH)
							e.preventDefault();
					};
					
					$scope.replyKeyPress = function (e) {
						if($scope.reply.length == MAX_REPLY_LENGTH)
							e.preventDefault();
					};
					
					$scope.send = function () {
						userInfo();

						ngChatService.send({
							userId: $scope.guid(),
							user: $scope.name,
							message: $scope.reply
						}).then(function (resp) {
							console.log('ngChatService.send()');
							console.log(resp);
							
							if(typeof resp != 'undefined'){
								resp.message = insertSmilies(resp.message);
								$scope.history.push(resp);
								resetScroll();
							}
							
							$scope.reply = '';
						}, function (err){
							console.log('ngChatService.send() error');
							console.log(err);
						})['finally'](function (){
							
						});
					};
					
					/*
					 * Handlers
					 */
					angular.element(document).ready(function () {
						$(CLASSNAME_RESIZER).on('mousedown', function (e) {
							var elem = $(CLASSNAME_HISTORY);
							var startHeight = elem.height();
							var pY = e.pageY;
							
							$(document).on('mouseup', function (e2){
								$(document).off('mouseup').off('mousemove');
							});
							
							$(document).on('mousemove', function (me){
								var mY = (me.pageY - pY);
								var endHeight = startHeight + mY;
								elem.css({ height: endHeight });
							});	
						});
					});
					
					$scope.$watch('name', function (b, a) {
						if(a == b || !b)
							return;
						if($scope.name.length > MAX_NAME_LENGTH) {
							$scope.name = $scope.name.substr(0, MAX_NAME_LENGTH);
						}
					});
					
					$scope.$watch('reply', function (b, a) {
						if(a == b || !b)
							return;
						if($scope.reply.length > MAX_REPLY_LENGTH) {
							$scope.reply = $scope.reply.substr(0, MAX_REPLY_LENGTH);
						}
					});
					
					/* Init
					 */
					refresh();
					
					$timeout(function(){
						adminInfo();
					}, 100);
				}]
			};
		});
})();