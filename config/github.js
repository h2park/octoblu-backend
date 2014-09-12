var GithubStrategy = require('passport-github').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');

var CONFIG = {
  production: {
    clientID: "d67367e23f89dcb0fdbe",
    clientSecret: "c2b1741e8a8ff08673607b3b67753b2dc8778d71",
    callbackURL:    'http://localhost:8080/api/oauth/github/callback',
    passReqToCallback: true
  },
  development: {
    clientID: "463a8c25ee407035cd1c",
    clientSecret: "fdccd7d4fa72cda2746dc3db787e5558b8bb3837",
    callbackURL:    'http://localhost:8080/api/oauth/github/callback',
    passReqToCallback: true
  }
}[process.env.NODE_ENV];

var ensureUser = function(user, profile, callback){
  if(user){ return callback(null, user); }

  var query, userParams;

  query = {'github.id': profile.id};
  userParams = {
    username:    profile.username,
    displayName: profile.displayName,
    email:       profile.username,
    github: {
      id: profile.id
    }
  };

  User.findOneAndUpdate(query, {$set: userParams}, {upsert: false, new: false}).exec()
  .then(function (user) {
    callback(null, user);
  }, function(){
    callback(err);
  });
}

var githubStrategy = new GithubStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  ensureUser(req.user, profile, function(err, user){
    if(err){ return done(err, user); }

    var channelId = new mongoose.Types.ObjectId('532a258a50411e5802cb8053');

    user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
    user.save(function (err) {
      done(err, user);
    });
  });
});

module.exports = githubStrategy;