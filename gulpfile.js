var gulp = require('gulp');
var buildTask = require('./gulp-tasks/build');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var clean = require('gulp-clean');

/* ###################
 * Clean Tasks
 * ###################*/
gulp.task('clean', () => {
	return gulp.src('./server/**/*.*', {read: false})
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

/* ###################
 * Build Tasks
 * ###################*/
gulp.task('build:client', () => {
	return buildTask({isVendor: false})();
});

gulp.task('build:vendor', () => {
	return buildTask({isVendor: true})();
});

gulp.task("build", () => {
	return runSequence('build:client', 'build:vendor');
});


gulp.task('dev', () => {
	return runSequence('clean', 'copy', 'build');
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
