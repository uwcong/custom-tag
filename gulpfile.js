var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var compass = require('gulp-compass');
var sass = require('gulp-sass');
var del = require('del');

// 配置
var config = {
    baseDir: 'app',
    devDir: 'app/src',
    buildDir: 'app/dest'
}

// 开启本地服务器并监听
gulp.task('server', function() {
    browserSync({
        server: {
            baseDir: config.baseDir
        },
        port: '9000',
        open: false
    });

    gulp.watch(config.devDir + '/sass/*.scss', ['compass']);
    gulp.watch(['tmpl/*.html', 'js/*.js'], { cwd: config.devDir }, reload); // NOTE: 这里cwd自带了 /，所以要去掉路径前面的 /
});

// compass
gulp.task('compass', function() {
    gulp.src(config.devDir + '/sass/*.scss')
        .pipe(compass({
            css: config.devDir + '/css',
            sass: config.devDir + '/sass',
            image: config.devDir + '/images',
            style: 'compressed',
        }))
        .pipe(reload({ stream: true }))
});

// clean
gulp.task('clean', function(cb) {
    del([config.buildDir]);
    cb();
});



// 默认任务
gulp.task('default', ['server', 'compass']);