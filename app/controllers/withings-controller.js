var passport = require('passport');

var WithingsController = function(){
  this.authorize = passport.authenticate('withings');
  this.callback  = passport.authenticate('withings', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = WithingsController;
