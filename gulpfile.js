var gulp = require('gulp');
var buildTask = require('./gulp-tasks/build');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var clean = require('gulp-clean');
var processhtml = require('gulp-processhtml');
var uglifyJS = require('gulp-uglify');

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
		'./src/**/*.html'
	])
	.pipe(gulp.dest('./server'))
});
gulp.task('copy:dist', () => {
	return gulp.src([
		'./src/**/*.html'
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
	return runSequence('clean', 'copy', 'build');
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
	return gulp.src('./dist/bundle.min.js')
		.pipe(uglifyJS({
			compress: {
				drop_console: true
			}
		}))
		.pipe(gulp.dest('./dist'));
});
gulp.task('dist', () => {
	return runSequence('clean:dist', 'copy:dist', 'build:dist', 'process-html', 'compress');
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
			 runSequence('copy', 'build', 'reload');
	 });
});
