'use strict';
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			main: {
				files: [
					{ src: 'src/ngchat/ng-chat.js', dest: 'build/js/ng-chat.min.js' }
				]
			}
		},
		clean: {
			pre: {
				src: ['dist']
			},
			post: {
				src: ['build']
			}
		},
        less: {
            main: {
                options: {
					compress: true,
					paths: ['src/less/']
				},
                files: { 'dist/ngchat/ng-chat.min.css': 'src/less/ng-chat.less' }
            }
        },
		copy: {
			main: {
				files: [
					// libs
					{ src: 'src/libs/jquery.min.js', dest: 'dist/libs/jquery.min.js' },
					{ src: 'src/libs/lodash.min.js', dest: 'dist/libs/lodash.min.js' },
					{ src: 'src/libs/angular.min.js', dest: 'dist/libs/angular.min.js'},
					{ src: 'src/libs/angular-sanitize.min.js', dest: 'dist/libs/angular-sanitize.min.js'},
					// css
					{ src: 'src/css/grid100.min.css', dest: 'dist/css/grid100.min.css' },
					// ngchat
					// - backend
					{ src: 'src/ngchat/config.php', dest: 'dist/ngchat/config.php' },
					{ src: 'src/ngchat/admin.php', dest: 'dist/ngchat/admin.php' },
					{ src: 'src/ngchat/read.php', dest: 'dist/ngchat/read.php' },
					{ src: 'src/ngchat/send.php', dest: 'dist/ngchat/send.php' },
					{ src: 'src/ngchat/status.php', dest: 'dist/ngchat/status.php' },
					// - frontend
					{ src: 'src/ngchat/ng-chat.html', dest: 'dist/ngchat/ng-chat.html' },
					{ src: 'build/js/ng-chat.min.js', dest: 'dist/ngchat/ng-chat.min.js' },
					{ src: 'src/smilies/*', dest: 'dist/ngchat/smilies/', expand: true, flatten: true, filter: 'isFile' },
					// demo files
					{ src: 'src/index.html', dest: 'dist/index.html' },
					{ src: 'src/app.js', dest: 'dist/app.js' }
				]
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	
	grunt.registerTask('default', ['clean:pre', 'uglify', 'less', 'copy', 'clean:post']);
};