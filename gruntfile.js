'use strict';
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			dist: {
				src: [
					'src/js/angular.min.js',
					'src/js/angular-animate.min.js',
					'src/js/angular-sanitize.min.js',
				],
				dest: 'build/js/angular.custom.js'
			}
		},
		uglify: {
			dist: {
				files: [
					{ src: 'build/js/angular.custom.js', dest: 'build/js/angular.custom.min.js' },
					{ src: 'src/ngchat/ng-chat.js', dest: 'build/js/ng-chat.min.js' }
				]
			}
		},
        less: {
            development: {
                options: {
                    paths: ['src/less/']
                },
                files: {
                    'build/css/ng-chat.css': 'src/less/ng-chat.less'
                }
            }
        },
		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			target: {
				files: {
					'build/css/ng-chat.min.css': 'build/css/ng-chat.css' //['src/css/grid100.min.css', 'build/css/ng-chat.css']
				}
			}
		},
		copy: {
			main: {
				files: [
					// libs
					{ src: 'src/js/jquery-2.2.3.min.js', dest: 'dist/js/jquery-2.2.3.min.js' },
					{ src: 'src/js/lodash.min.js', dest: 'dist/js/lodash.min.js' },
					{ src: 'build/js/angular.custom.min.js', dest: 'dist/js/angular.custom.min.js'},
					{ src: 'src/css/grid100.min.css', dest: 'dist/css/grid100.min.css' },
					// ngchat
					{ src: 'src/ngchat/config.php', dest: 'dist/ngchat/config.php' },
					{ src: 'src/ngchat/admin.php', dest: 'dist/ngchat/admin.php' },
					{ src: 'src/ngchat/read.php', dest: 'dist/ngchat/read.php' },
					{ src: 'src/ngchat/send.php', dest: 'dist/ngchat/send.php' },
					{ src: 'src/ngchat/status.php', dest: 'dist/ngchat/status.php' },
					{ src: 'build/css/ng-chat.min.css', dest: 'dist/ngchat/ng-chat.min.css' },
					{ src: 'src/ngchat/ng-chat.html', dest: 'dist/ngchat/ng-chat.html' },
					{ src: 'build/js/ng-chat.min.js', dest: 'dist/ngchat/ng-chat.min.js' },
					{ src: 'src/smilies/*', dest: 'dist/ngchat/smilies/', expand: true, flatten: true, filter: 'isFile' },
					// demo files
					{ src: 'src/index.html', dest: 'dist/index.html' },
					{ src: 'src/app.js', dest: 'dist/app.js' }
				]
			}
		},
		watch: {
            files: 'src/less/*.less',
            tasks: ['less', 'cssmin']
        }
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['concat', 'uglify', 'less', 'cssmin', 'copy']); //, 'watch'
};