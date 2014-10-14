var passport = require('passport');

var GoogleController = function(){
	var scope = [
		'profile',
		'email',
		'https://www.googleapis.com/auth/drive',
		'https://www.googleapis.com/auth/monitoring.readonly',
		'https://gdata.youtube.com'
	];
  this.authorize = passport.authenticate('google', { scope: scope });
  this.callback  = passport.authenticate('google', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/home');
  };
};

module.exports = GoogleController;
