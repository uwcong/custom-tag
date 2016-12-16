module.exports = function(grunt) {
  // 配置项
  var config = {
    devFolder: 'dev',
    destFolder: 'build'
  };
  // LiveReload的默认端口号，你也可以改成你想要的端口号
  var lrPort = 5201;
  // 使用connect-livereload模块，生成一个与LiveReload脚本
  var lrSnippet = require('connect-livereload')({ port: lrPort });
  // 使用 middleware(中间件)
  var serveStatic = require('serve-static'), serveIndex = require('serve-index');
  var lrMiddleware = function(connect, options) {
    return [
      // 把脚本，注入到静态文件中
      lrSnippet,
      // 静态文件服务器的路径
      serveStatic(options.base[0]),
      // 启用目录浏览(相当于IIS中的目录浏览)
      serveIndex(options.base[0])
    ];
  }
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      options: {
        hostname: '192.168.0.227',
        port: 9000,
        base: config.devFolder,
        livereload: lrPort,
      },
      livereload: {
        options: {
          middleWare: lrMiddleware
        }
      }
    },

    clean: {
      build: {
        src: [config.destFolder]
      },
    },

    copy: {
      build: {
        cwd: config.devFolder,
        src: [ '**' ],
        dest: config.destFolder,
        expand: true
      }
    },

    uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
			  // 动态文件映射，
			  // 当任务运行时会自动在 "src/bin/" 目录下查找 "**/*.js" 并构建文件映射，
			  // 添加或删除文件时不需要更新 Gruntfile。
			  files: [
          {
            expand: true,     // 启用动态扩展
            cwd: config.destFolder + '/js/',      // 源文件匹配都相对此目录
            src: ['**/*.js'], // 匹配模式
            dest: config.destFolder + '/js/',   // 目标路径前缀
            // ext: '.min.js',   // 目标文件路径中文件的扩展名
            // extDot: 'first'   // 扩展名始于文件名的第一个点号
          },
			  ],
			}
		},

    compass: {
      dev: {
        options: {
          config: 'config.rb',
        }
      }
    },

    watch: {
      options: {
        livereload: lrPort
      },
      files: [config.devFolder + '/{,**/}*'],
      tasks: ['compass']
    },

  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');

  grunt.registerTask('start', ['connect', 'watch']);
  grunt.registerTask('build', ['clean', 'copy', 'uglify']);
  // grunt.registerTask('default', 'log some stuff', function() {
  //   grunt.log.write('logging').ok();
  // });

};