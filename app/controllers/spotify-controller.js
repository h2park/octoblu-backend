var passport = require('passport');

var SpotifyStrategy = function(){
  this.authorize = passport.authenticate('spotify', { scope: 'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private streaming user-follow-modify user-follow-read user-library-read user-library-modify user-read-private user-read-birthdate user-read-email' });
  this.callback  = passport.authenticate('spotify', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = SpotifyStrategy;
