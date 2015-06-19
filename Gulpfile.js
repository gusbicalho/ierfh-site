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

var serverRoot = 'dist';

// JSHint task
gulp.task('jshint', jshintTask);

// Watchify tasks
gulp.task('watchify', makeWatchify('./app/scripts/index.ts',serverRoot, true));
gulp.task('watchify-debug', makeWatchify('./app/scripts/index.ts',serverRoot, false));

// App views tasks
gulp.task('cleanIndex', cleanIndex(serverRoot));
gulp.task('cleanViews', cleanViews(serverRoot));
gulp.task('copyIndex', ['cleanIndex'], copyIndex('./app',serverRoot));
gulp.task('copyViews', ['cleanViews'], copyViews('./app',serverRoot));

// App styles tasks
gulp.task('cleanStyles', cleanStyles(serverRoot));
gulp.task('styles', ['cleanStyles'], styles('./app',serverRoot));
// App assets task
gulp.task('cleanAssets', cleanAssets(serverRoot));
gulp.task('copyAssets', ['cleanAssets'], copyAssets('./app',serverRoot));

var jshintBlobs = [
  './app/scripts/*.js','./app/scripts/**/*.js',
  ];

gulp.task('watch', ['jshint', 'watchify', 'copyAssets', 'copyIndex', 'copyViews', 'styles'], keepWatch);
gulp.task('watch-debug', ['jshint', 'watchify-debug', 'copyAssets', 'copyIndex', 'copyViews', 'styles'], keepWatch);

gulp.task('dev', ['watch'], serveDist);
gulp.task('dev-debug', ['watch-debug'], serveDist);
gulp.task('serve', [], serveDist);

gulp.task('deploy', function() {
  var conn = ftp.create( {
      host:     'cellere.com.br',
      user:     'cellere@gusbicalho.com.br',
      password: 'cellere2611',
      parallel: 5,
      log: gutil.log
  });

  var globs = [
      'dist/**',
      'apache/*','apache/.*',
      'apache/**/*','apache/**/.*'
  ];
  
  return gulp.src( globs, { buffer: false } )
      .pipe( conn.newerOrDifferentSize( '/' ) ) // only upload newer files 
      .pipe( conn.dest( '/' ) );
});

function serveDist() {
  var server = express();
  server.use(express.static('./dist'));
  // Redirects everything back to index.html
  server.all('/*', function(req, res) {
    console.log('Sending index.html for url:', req.url);
    res.sendFile('/index.html', { root: serverRoot });
  });
  // Start webserver
  server.listen(serverport);
  console.log('Server listening at port',serverport);
}

function keepWatch() {
  // Watch our scripts
  gulp.watch(jshintBlobs,['jshint']);

  // Watch app files
  gulp.watch('./app/styles/*.scss',['styles']);
  gulp.watch('./app/*.html', ['copyIndex']);
  gulp.watch(['./app/views/*','./app/views/**/*'], ['copyViews']);
  //gulp.watch('./app/assets/**/*', ['copyAssets']);
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
    del([outFolder+'/*.html'], cb);
  };
}
function copyIndex(appFolder,outFolder) { // copyIndex task builder
  return function() {
    return gulp.src([appFolder+'/*.html'])
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
    del([outFolder+'/css/'], cb);
  };
}
function styles(appFolder,outFolder) { // styles task builder
  return function() {
    return gulp.src(appFolder+'/styles/app.scss')
      // The onError handler prevents Gulp from crashing when you make a mistake in your SASS
      .pipe(sass().on('error', sass.logError))
      // Optionally add autoprefixer
      .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8"))
      .pipe(minifyCss({compatibility: 'ie8'}))
      .pipe(gulp.dest(outFolder+'/css'));
  };
}
