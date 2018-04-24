Angular Chat v0.3.2 - AngularJS chat module
===================

This AngularJS chat module is based on refreshing. I wrote some server side scripts on PHP for testing and you can try it by yourself.

[Live demo](http://khasky.com/demo/ng-chat)

![NgChat](https://github.com/khasky/NgChat/blob/master/screenshot.png)

## Features

* Easy to install and use
* Low requirements
* Users online status
* Chat history
* Smiley icon set

## Dependencies

 * AngularJS 1.5.0+ with ngSanitize

## Build (optional)

If you want to modify and/or rebuild NgChat, you should install [NodeJS](https://nodejs.org) and run **grunt** in command line.  
I've used LESS preprocessor and [Lessophy mixins](https://github.com/khasky/Lessophy) for work on CSS styles.

#### Required NodeJS modules

 * grunt-contrib-clean
 * grunt-contrib-copy
 * grunt-contrib-less
 * grunt-contrib-uglify

#### Directories

**src** - ng-chat source files  
**dist/ngchat** - build of ng-chat module, minified and ready for production  

## Installation

 * Include AngularJS core:  
 ```<script type="text/javascript" src="libs/angular.min.js"></script>```
 * Include AngularJS sanitize:  
 ```<script type="text/javascript" src="libs/angular-sanitize.min.js"></script>```
 * Include ng-chat styles:  
 ```<link rel="stylesheet" href="ngchat/ngchat.min.css" />```
 * Include ng-chat module script:  
 ```<script type="text/javascript" src="ngchat/ngchat.min.js"></script>```
 * Add ngChatModule to your AngularJS application:  
 ```var app = angular.module('app', ['ngChatModule']);```
 * Include your AngularJS application:  
 ```<script type="text/javascript" src="app.js"></script>```
 * Add directive to your template:  
 ``` <ng-chat></ng-chat> ```  

If you feel some difficulties you can look at demo files as example: **dist/app.js**, **dist/index.html**

## Configuration

### config.php - Server side options

| Variable                     | Default value  | Description                                                  |
| ---------------------------- | -------------- | ------------------------------------------------------------ |
| $CFG_CHAT_FILE_PATH          | history.json   | [string] Chat history file name                              |
| $CFG_STATUS_FILE_PATH        | status.json    | [string] Online status file name                             |
| $CFG_MAX_HISTORY_MESSAGES    | 50             | [integer] Max. chat messages stored in history               |
| $CFG_MAX_ONLINE_TIME_MINUTES | 15             | [integer] Max. minutes for detecting if user is still online |

### ng-chat.js (ngChatConfig) - Client side options

| Variable                  | Default value          | Description                                                   |
| ------------------------- | ---------------------- | ------------------------------------------------------------- |
| maxNameLength             | 16                     | [integer] Max. characters in nickname                         |
| maxReplyLength            | 255                    | [integer] Max. length of chat message                         |
| minAutoRefreshTime        | 5                      | [integer] Min. auto refresh time in seconds                   |
| maxAutoRefreshTime        | 300                    | [integer] Max. auto refresh time in seconds                   |
| minManualRefreshTime      | 3                      | [integer] Min. manual refresh time (prevent floods)           |
| shortDateFormat           | HH:mm:ss               | [string] Display date format (short)                          |
| shortDateFormat           | dd.mm.yyyy HH:mm:ss    | [string] Display date format (full)                           |
| smiliesEnabled            | true                   | [boolean] Enable or disable smilies                           |
| smiliesDirectory          | ngchat/smilies/        | [string] Path to smilies folder                               |
| smiliesFormat             | .gif                   | [string] Smiley icons extension                               |
| smiliesList               | -                      | [array of objects] name and supported emotions for each smile |

## Data

List of data transferred between client and server. You can write your own server scripts following the listed format.

#### read.php - Read chat history and return JSON array of messages. [Example](https://github.com/khasky/NgChat/blob/master/src/demo/history.json).

| Field name | Description                                |
| ---------- | ------------------------------------------ |
| userId     | [string] Unique user identifier (aka GUID) |
| user       | [string] User nickname in chat             |
| messageId  | [integer] Unique message identifier        |
| message    | [string] Chat message text                 |
| date       | [string] Formatted date (atom)             |

#### send.php - Send chat message

| HTTP  | Field name | Description                                |
| ----- | ---------- | ------------------------------------------ |
| POST  | userId     | [string] Unique user identifier (aka GUID) |
| POST  | user       | [string] User nickname in chat             |
| POST  | message    | [string] Chat message text                 |

#### status.php - Get online users

| HTTP  | Field name | Description                                |
| ----- | ---------- | ------------------------------------------ |
| POST  | userId     | [string] Unique user identifier (aka GUID) |
