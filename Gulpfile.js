var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    del = require('del'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify'),
    browserify = require('browserify'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),
    ftp = require('vinyl-ftp');

var express = require('express'),
    serverport = 5000;

var outRoot = 'dist/wp-content/themes/ierfh_fun';
var appRoot = 'app';

// JSHint task
gulp.task('jshint', jshintTask);

// Watchify tasks
gulp.task('watchify', makeWatchify(appRoot+'/scripts/index.ts',outRoot, true));
gulp.task('watchify-debug', makeWatchify(appRoot+'/scripts/index.ts',outRoot, false));

// App views tasks
gulp.task('cleanIndex', cleanIndex(outRoot));
gulp.task('cleanViews', cleanViews(outRoot));
gulp.task('copyIndex', ['cleanIndex'], copyIndex(appRoot,outRoot));
gulp.task('copyViews', ['cleanViews'], copyViews(appRoot,outRoot));

// App styles tasks
gulp.task('cleanStyles', cleanStyles(outRoot));
gulp.task('styles', ['cleanStyles'], styles(appRoot,outRoot));
// App assets task
gulp.task('cleanAssets', cleanAssets(outRoot));
gulp.task('copyAssets', ['cleanAssets'], copyAssets(appRoot,outRoot));

var jshintBlobs = [
  appRoot+'/scripts/*.js',appRoot+'/scripts/**/*.js',
  ];

gulp.task('dev-prod', ['jshint', 'watchify', 'copyAssets', 'copyIndex', 'copyViews', 'styles'], keepWatch);
gulp.task('dev', ['jshint', 'watchify-debug', 'copyAssets', 'copyIndex', 'copyViews', 'styles'], keepWatch);

function keepWatch() {
  // Watch our scripts
  gulp.watch(jshintBlobs,['jshint']);

  // Watch app files
  gulp.watch(appRoot+'/styles/*.scss',['styles']);
  gulp.watch([appRoot+'/*.html', appRoot+'/*.php', 'apache/.*', 'apache/**/.*'], ['copyIndex']);
  gulp.watch([appRoot+'/views/*', appRoot+'/views/**/*'], ['copyViews']);
}

function jshintTask() { // jshint task
  gulp.src(jshintBlobs)
  .pipe(jshint())
  // You can look into pretty reporters as well, but that's another story
  .pipe(jshint.reporter('default'));
}

function makeWatchify(mainScript, outPath, bundleName, useUglify) { // Watchify task builder
  bundleName = bundleName || 'bundle.js';
  var bundler = watchify(browserify(mainScript, watchify.args));
  bundler.plugin('tsify', {target:'ES5', module:'commonjs'})
  bundler.on('update', watchifyBundle); // on any dep update, runs the bundler
  bundler.on('log', gutil.log); // output build logs to terminal
  bundler.transform('brfs');
  if (useUglify)
    bundler.transform('uglifyify',{global: true});

  return watchifyBundle;

  function watchifyBundle() {
    return bundler.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source(bundleName))
      // Output it to our dist folder
      .pipe(gulp.dest(outPath));
  }
}

function cleanIndex(outFolder) { // cleanIndex task builder
  return function(cb) {
    del([
      outFolder+'/*.html',
      outFolder+'/*.php',
      outFolder+'/.*',
      outFolder+'/**/.*'
      ], cb);
  };
}
function copyIndex(appFolder,outFolder) { // copyIndex task builder
  return function() {
    var globs = [
        appFolder+'/*.html',
        appFolder+'/*.php',
        'apache/.*',
        'apache/**/.*'
    ];
    return gulp.src(globs)
      .pipe(gulp.dest(outFolder+'/'));
  };
}
function cleanViews(outFolder) { // cleanViews task builder
  return function(cb) {
    del([outFolder+'/views/'], cb);
  };
}
function copyViews(appFolder,outFolder) { // copyViews task builder
  return function() {
    return gulp.src(appFolder+'/views/**/*')
      .pipe(gulp.dest(outFolder+'/views/'));
  };
}
function cleanAssets(outFolder) { // cleanAssets task builder
  return function(cb) {
    del([outFolder+'/assets/'], cb);
  };
}
function copyAssets(appFolder,outFolder) { // assets task builder
  return function() {
    return gulp.src(appFolder+'/assets/**/*')
      .pipe(gulp.dest(outFolder+'/assets/'));
  };
}

function cleanStyles(outFolder) { // cleanStyles task builder
  return function(cb) {
    del([outFolder+'/*.css'], cb);
  };
}
function styles(appFolder,outFolder) { // styles task builder
  return function() {
    return gulp.src(appFolder+'/styles/style.scss')
      // The onError handler prevents Gulp from crashing when you make a mistake in your SASS
      .pipe(sass({precision: 8}).on('error', sass.logError))
      // Optionally add autoprefixer
      .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8"))
      .pipe(minifyCss({compatibility: 'ie8'}))
      .pipe(gulp.dest(outFolder));
  };
}
