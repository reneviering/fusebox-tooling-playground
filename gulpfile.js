var gulp = require('gulp');
var buildTask = require('./gulp-tasks/build');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var clean = require('gulp-clean');
var processhtml = require('gulp-processhtml');
var uglifyJS = require('gulp-uglify');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var uglifycss = require('gulp-uglifycss');
var rename = require('gulp-rename');

/* ###################
 * Clean Tasks
 * ###################*/
gulp.task('clean', () => {
	return gulp.src('./server/**/*.*', {read: false})
        .pipe(clean());
});
gulp.task('clean:dist', () => {
	return gulp.src('./dist/**/*.*', {read: false})
        .pipe(clean());
});

/* ###################
 * Copy Tasks
 * ###################*/
gulp.task('copy', () => {
	return gulp.src([
		'./src/**/*.html',
		'./src/**/*.css'
	])
	.pipe(gulp.dest('./server'))
});
gulp.task('copy:dist', () => {
	return gulp.src([
		'./src/**/*.html',
		'./src/**/*.css'
	])
	.pipe(gulp.dest('./dist'))
});

/* ###################
 * Build Tasks
 * ###################*/
gulp.task('build:client', () => {
	return buildTask({isVendor: false})();
});

gulp.task('build:vendor', () => {
	return buildTask({isVendor: true})();
});

gulp.task('build:dist', () => {
	return buildTask({isDist: true})();
});

gulp.task("build", () => {
	return runSequence('build:client', 'build:vendor');
});


gulp.task('dev', () => {
	return runSequence('clean', 'copy', 'build', 'css');
});

/* ###################
 * CSS Task
 * ###################*/
 gulp.task('css', function () {
	return gulp.src('./src/assets/less/index.less')
		.pipe(less())
		.pipe(autoprefixer({
			browsers: [
				'> 1%',
				'last 3 version',
				'ie 8',
				'ie 9',
				'Firefox ESR',
				'Opera 12.1'
			]
		}))
		.pipe(gulp.dest('./src/assets/css'));
});

/* ###################
 * Dist Task
 * ###################*/
gulp.task('process-html', () => {
	return gulp.src('./dist/*.html')
   .pipe(processhtml())
   .pipe(gulp.dest('./dist'));
});
gulp.task('compress', () => {
	return gulp.src('./dist/app/bundle.min.js')
		.pipe(uglifyJS({
			compress: {
				drop_console: true
			}
		}))
		.pipe(gulp.dest('./dist'));
});
gulp.task('compress:css', () => {
	return gulp.src('./dist/assets/css/index.css')
		.pipe(uglifycss({
      "maxLineLen": 80,
      "uglyComments": true
    }))
		.pipe(rename('index.min.css'))
		.pipe(gulp.dest('./dist/assets/css'));
});
gulp.task('cleanup:dist', () => {
	return gulp.src('./dist/assets/css/index.css')
				 .pipe(clean());
});
gulp.task('dist', () => {
	return runSequence('clean:dist', 'copy:dist', 'build:dist', 'process-html', 'compress', 'compress:css', 'cleanup:dist');
});

/* ###################
 * Live Reload
 * ###################*/
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./server"
        }
    });
		gulp.watch("*.*").on("change", browserSync.reload);
});

gulp.task('reload', () => {
	browserSync.reload();
});

gulp.task('default', ['dev', 'browser-sync'], function() {
		gulp.watch('src/**/*.*', () => {
			 runSequence('copy', 'build', 'css', 'reload');
	 });
});
