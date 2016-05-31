var gulp                = require('gulp');
var _                   = require('lodash');
var concat              = require('gulp-concat');
var jsoncombine         = require('gulp-jsoncombine');
var plumber             = require('gulp-plumber');
var sourcemaps          = require('gulp-sourcemaps');
var nodemon             = require('gulp-nodemon');
var coffee              = require('gulp-coffee');
var clean               = require('gulp-clean');
var source              = require('vinyl-source-stream')
var OperationsMangler   = require('./setup/gulp-operations-mangler');
var ChristacheioStream  = require('gulp-json-template-christacheio');

var NODE_REGISTRY_URL = process.env.NODE_REGISTRY_URL;

gulp.task('channels:concat', function(){
  return gulp.src('./assets/json/channels/*.json')
    .pipe(jsoncombine('channels.json', function(data){
      return new Buffer(JSON.stringify(_.values(data)));
    }))
    .pipe(gulp.dest('./assets/json/'));
});

gulp.task('nodetypes:concat', function(){  
  var christacheioStream = new ChristacheioStream({data: {
    endoDomain: process.env.ENDO_DOMAIN || 'octoblu.com',
    dataForwarderDomain: process.env.DATA_FORWARDER_DOMAIN || 'octoblu.com'
  }});

  return gulp.src('./assets/json/nodetypes/**/*.json')
    .pipe(jsoncombine('nodetypes.json', function(data){
      return new Buffer(JSON.stringify(_.values(data)));
    }))
    .pipe(christacheioStream)
    .pipe(gulp.dest('./assets/json/'));
});

gulp.task('operations:concat', function(){
  return gulp.src('./assets/json/operations/**/*.json')
    .pipe(jsoncombine('operations.json', function(data){
      return new Buffer(JSON.stringify(_.values(data)));
    }))
    .pipe(gulp.dest('./assets/json/'));
});

//Doing bad things. If you're having problems, this is probably why.
//Pull requests accepted.
gulp.task('mangle-operations', ['default'], function(){
  return gulp
  .src('./assets/json/operations.json')
  .pipe(new OperationsMangler({ nodeRegistryUrl: NODE_REGISTRY_URL}))
  .pipe(source('operations.json'))
  .pipe(gulp.dest('./assets/json/'));
});

gulp.task('default', ['channels:concat', 'nodetypes:concat', 'operations:concat'], function() {});

gulp.task('production', ['default']);

gulp.task('watch', ['default', 'mangle-operations'], function() {
  gulp.watch(['./assets/json/channels/*.json'], ['channels:concat']);
  gulp.watch(['./assets/json/nodetypes/**/*.json'], ['nodetypes:concat']);
  gulp.watch(['./assets/json/operations/**/*.json'], ['operations:concat']);

  nodemon({
    script : 'server.js',
    ext : 'js json coffee',
    watch : ['server.js', 'app/*', 'config/*', 'assets/*']
  });
});
