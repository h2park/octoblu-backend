var gulp         = require('gulp'),
  bower          = require('gulp-bower'),
  mainBowerFiles = require('main-bower-files'),
  concat         = require('gulp-concat'),
  jsoncombine    = require('gulp-jsoncombine'),
  less           = require('gulp-less'),
  plumber        = require('gulp-plumber'),
  sourcemaps     = require('gulp-sourcemaps'),
  nodemon        = require('gulp-nodemon'),
  _              = require('lodash');

gulp.task('bower', function() {
  bower('./public/lib');
});

gulp.task('bower:concat', ['bower'], function(){
  return gulp.src(mainBowerFiles({filter: /\.js/}))
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(concat('dependencies.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/assets/javascripts/dist/'));
});

gulp.task('less:compile', function(){
  return gulp.src('./assets/less/manifest.less')
    .pipe(plumber())
    // .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(concat('styles.css'))
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/assets/stylesheets/dist/'));
});

gulp.task('javascript:concat', function(){
  return gulp.src(['./public/angular/app.js', './public/angular/**/*.js'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(concat('application.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/assets/javascripts/dist/'));
});

gulp.task('channels:concat', function(){
  return gulp.src('./assets/json/channels/*.json')
    .pipe(jsoncombine('channels.json', function(data){
      return new Buffer(JSON.stringify(_.values(data)));
    }))
    .pipe(gulp.dest('./assets/json/'));
});

gulp.task('nodetypes:concat', function(){
  return gulp.src('./assets/json/nodetypes/**/*.json')
    .pipe(jsoncombine('nodetypes.json', function(data){
      return new Buffer(JSON.stringify(_.values(data)));
    }))
    .pipe(gulp.dest('./assets/json/'));
});

gulp.task('default', ['bower:concat', 'less:compile', 'javascript:concat', 'channels:concat', 'nodetypes:concat'], function() {});

gulp.task('production', ['channels:concat', 'nodetypes:concat']);

gulp.task('watch', ['default'], function() {
  gulp.watch(['./bower.json'], ['bower']);
  gulp.watch(['./assets/less/**/*.less'], ['less:compile']);
  gulp.watch(['./public/angular/**/*.js', './public/angular/*.js'], ['javascript:concat']);
  gulp.watch(['./assets/json/channels/*.json'], ['channels:concat']);
  gulp.watch(['./assets/json/nodetypes/**/*.json'], ['nodetypes:concat']);

  nodemon({
    script : 'server.js',
    ext : 'js json',
    watch : ['server.js', 'app/*', 'config/*', 'assets/*'],
    env: { 'NODE_ENV': 'development' }
  });
});
