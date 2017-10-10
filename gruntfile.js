'use strict';
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			main: {
				files: [
					{ src: 'src/ngchat/ngchat.js', dest: 'build/js/ngchat.min.js' }
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
                files: { 'dist/ngchat/ngchat.min.css': 'src/less/ngchat.less' }
            }
        },
		copy: {
			main: {
				files: [
					// libs
					{ src: 'src/libs/angular.min.js', dest: 'dist/libs/angular.min.js'},
					{ src: 'src/libs/angular-sanitize.min.js', dest: 'dist/libs/angular-sanitize.min.js'},
					// ngchat
					// - backend
					{ src: 'src/ngchat/server/config.php', dest: 'dist/ngchat/server/config.php' },
					{ src: 'src/ngchat/server/admin.php', dest: 'dist/ngchat/server/admin.php' },
					{ src: 'src/ngchat/server/read.php', dest: 'dist/ngchat/server/read.php' },
					{ src: 'src/ngchat/server/send.php', dest: 'dist/ngchat/server/send.php' },
					{ src: 'src/ngchat/server/status.php', dest: 'dist/ngchat/server/status.php' },
					// - frontend
					{ src: 'src/ngchat/ngchat.html', dest: 'dist/ngchat/ngchat.html' },
					{ src: 'build/js/ngchat.min.js', dest: 'dist/ngchat/ngchat.min.js' },
					{ src: 'src/smilies/*', dest: 'dist/ngchat/smilies/', expand: true, flatten: true, filter: 'isFile' },
					// demo files
					{ src: 'src/demo/history.json', dest: 'dist/ngchat/server/history.json' },
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