var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    sass        = require('gulp-sass'),
    cssmin      = require('gulp-minify-css'),
    prefix      = require('gulp-autoprefixer'),
    coffee      = require('gulp-coffee'),
    jshint      = require('gulp-jshint'),
    stylish     = require('jshint-stylish'),
    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename'),
    livereload  = require('gulp-livereload'),
    pkg         = require('./package.json');

gulp.task('scripts', function(file) {
    return gulp.src('./js/src/*.coffee')
        .pipe(coffee({bare: true}).on('error', gutil.log))
        .pipe(gulp.dest('./js'))
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(rename(pkg.name + '.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./js'));
});

gulp.task('styles', function() {
    return gulp.src('./css/src/*.scss')
        .pipe(sass())
        .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(gulp.dest('./css'))
        .pipe(cssmin())
        .pipe(rename('style.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('./css'));
});

gulp.task('watch', ['staticsvr'], function() {
    gulp.watch('css/src/*.scss', ['styles']);
    gulp.watch('js/src/*.coffee', ['scripts']);
    var server = livereload();
    gulp.watch(['index.html', 'js/**/*', 'css/**/*']).on('change', function(file) {
        server.changed(file.path);
    });
});

gulp.task('staticsvr', function(next) {
    var staticS = require('node-static'),
        server = new staticS.Server('./'),
        port = 7000;
    require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            server.serve(request, response);
        }).resume();
    }).listen(port, function() {
        gutil.log('Server listening on port: ' + gutil.colors.magenta(port));
        next();
    });
});

gulp.task('default', ['scripts', 'styles', 'watch']);