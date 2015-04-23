var gulp         = require('gulp'),
  concat         = require('gulp-concat'),
  jsoncombine    = require('gulp-jsoncombine'),
  plumber        = require('gulp-plumber'),
  sourcemaps     = require('gulp-sourcemaps'),
  nodemon        = require('gulp-nodemon'),
  coffee         = require('gulp-coffee'),
  clean          = require('gulp-clean'),
  _              = require('lodash');

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

gulp.task('operations:concat', function(){
  return gulp.src('./assets/json/operations/**/*.json')
    .pipe(jsoncombine('operations.json', function(data){
      return new Buffer(JSON.stringify(_.values(data)));
    }))
    .pipe(gulp.dest('./assets/json/'));
});

gulp.task('default', ['channels:concat', 'nodetypes:concat', 'operations:concat'], function() {});

gulp.task('production', ['default']);

gulp.task('watch', ['default'], function() {
  gulp.watch(['./assets/json/channels/*.json'], ['channels:concat']);
  gulp.watch(['./assets/json/nodetypes/**/*.json'], ['nodetypes:concat']);
  gulp.watch(['./assets/json/operations/**/*.json'], ['operations:concat']);

  nodemon({
    script : 'server.js',
    ext : 'js json coffee',
    watch : ['server.js', 'app/*', 'config/*', 'assets/*'],
    env: { 'NODE_ENV': 'development' }
  });
});
