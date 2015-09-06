// gulpfile.js
// Luis Matute
// July-15

"use strict";

// Dependencies =================================
	var gulp = require('gulp'),
		watch = require('gulp-watch'),
		notify = require('gulp-notify'),
		sass = require('gulp-ruby-sass'),
		combinemq = require('gulp-combine-mq'),
		shrink = require('gulp-cssshrink'),
		sourcemaps = require('gulp-sourcemaps'),
		jshint = require('gulp-jshint'),
		uglify = require('gulp-uglify'),
		gutil = require('gulp-util'),
		webserver = require('gulp-webserver'),
		wrap = require('gulp-wrap');

// Webserver Task ===============================
	gulp.task('webserver', function() {
		gulp.src('../web')
			.pipe(webserver({
				port: 3000,
				livereload: true,
				directoryListing: true
		}));
	});

// Views Task ===================================
	gulp.task('layout', function () {
		return gulp.src(['./views/**/*.html', '!./views/layout.html'])
			.pipe(wrap({src: './views/layout.html'}))
			.pipe(gulp.dest('../web/views'));
	});

// SASS Task ====================================
	gulp.task('sass', function() {
		var opt = { trace: true, style: "compressed", sourcemap: true };
		return sass('./sass/master.scss', opt)
			// .pipe(combinemq())
			// .pipe(shrink())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('../web/assets/css/'))
			.pipe(notify('Styles Task Completed'));
	});

// JS Task ======================================
	gulp.task('lint', function() {
		var lint_opts = {
			globals: { $: true }
		};
		return gulp
			.src(['./js/**/*.js','!**/libs/**/*'])
			.pipe(jshint(lint_opts))
			.pipe(jshint.reporter('default'));
	});
	gulp.task('js', function() {
		return gulp.src('./js/**/*.js')
			.pipe(sourcemaps.init())
			.pipe(uglify())
			.on('error', gutil.log)
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest('../web/assets/js'))
			.pipe(notify('JS Task Completed'));
	});

// Watch Task ===================================
	gulp.task('watch', function() {
		gulp.watch(['./js/**/*.js'],['lint','js']);
		gulp.watch('./sass/**/*.scss',['sass']);
		gulp.watch('./views/**/*.html',['layout']);
	});

// Tasks ========================================
	gulp.task('default', [ 'sass', 'lint', 'js', 'watch']);
	gulp.task('server', ['webserver', 'sass', 'lint', 'js', 'watch']);