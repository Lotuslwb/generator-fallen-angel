var gulp = require('gulp');
/*
 * 抛出错误 不中断执行 比如watch的时候 */
var plumber = require('gulp-plumber');
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');
/*
* 处理webpack 输出的js文件名, 不然输出的文件名为乱码 */
var named = require('vinyl-named');
/*
* */
var babel = require('gulp-babel')

var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');


var less = require('gulp-less');
var compass = require('gulp-compass');
var autoprefixer = require('gulp-autoprefixer');


var htmlminify = require("gulp-html-minify");
var htmlInline = require('gulp-html-inline');


var browserSync = require('browser-sync');


/*
 * Webpack 主要用于es6 模块化
 * */
gulp.task('runWebpack', function () {
    var stream = gulp.src('src/es6/**/*.es6')
        .pipe(plumber())
        .pipe(named())
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('src/js/'));
    return stream;
});

/*
 * js 的校验和压缩
 * */
gulp.task('runJS', function () {
    var stream = gulp.src('src/js/*.js')
        .pipe(plumber())
        .pipe(eslint())
        .pipe(uglify())
        .pipe(gulp.dest('build/js/'));

    return stream;
});

/*
 *  less的编译，前缀，压缩
 * */
gulp.task('runCSS', function () {
    var stream = gulp.src('src/less/*.less')
        .pipe(plumber())
        .pipe(less({compress: true}))
        .pipe(autoprefixer({browsers: ['> 1%', 'IE >= 6', 'Firefox >= 20'], cascade: false}))
        .pipe(gulp.dest('src/css/'))
        .pipe(gulp.dest('build/css/'));
    return stream;
});


/*
 *  html 资源inline,压缩
 * */
gulp.task('runHtml', function () {
    var stream = gulp.src(['src/**/*.html', 'src/**/*.htm'])
        .pipe(plumber())
        .pipe(htmlInline({
            queryKey: '_toinline', //指定需要内联的url后面必须带的query key， 默认 _toinline
            ignore: 'ignore', //指定忽略内联的标签上必须添加的属性
            minifyCss: true, // 选择是否压缩css
            minifyJs: true  // 选择是否压缩js,
            //资源文件相对当前页面文件的上级路径取值
        }))
        .pipe(htmlminify())
        .pipe(gulp.dest('build/'))

    return stream;
});

/*
 * img以及其他资源
 * */
gulp.task('runImg', function () {
    gulp.src(['src/img/**']).pipe(gulp.dest('build/img/'));
    gulp.src(['src/others/**']).pipe(gulp.dest('build/others/'));
});


/*
 * 打个包，准备发布了！！！
 * */
gulp.task('build', function () {
    gulp.run(['runWebpack', 'runJS', 'runCSS', 'runHtml', 'runImg']);
});

/*
 *
 * */
gulp.task('debug', function () {

    browserSync({
        notify: false,
        port: 9000,
        open: 'external',
        server: {
            baseDir: ['./src'],
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    });

    gulp.watch(['src/**/*.es6', 'src/**/*.js'], function () {
        gulp.run('runWebpack');
        gulp.run('runJS');
        browserSync.reload;
    });

    gulp.watch(['src/**/*.less', 'src/**/*.css'], function () {
        gulp.run('runCSS');
        browserSync.reload;
    });

    gulp.watch(['src/img/**', 'src/others/**'], function () {
        gulp.run('runImg');
        browserSync.reload;
    });

    gulp.watch(['src/**/*.html', 'src/**/*.htm'], function () {
        gulp.run('runHtml');
        browserSync.reload;
    });

});



