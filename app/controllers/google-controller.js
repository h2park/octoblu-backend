var passport = require('passport');

var GoogleController = function(){
	var scope = [
		'profile',
		'email',
		'https://www.googleapis.com/auth/drive',
		'https://www.googleapis.com/auth/monitoring.readonly',
		'https://gdata.youtube.com',
		'https://www.googleapis.com/auth/adsensehost',
		'https://www.googleapis.com/auth/adsense.readonly',
		'https://www.googleapis.com/auth/dfp'
	];
  this.authorize = passport.authenticate('google', { scope: scope });
  this.callback  = passport.authenticate('google', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Google');
  };
};

module.exports = GoogleController;
