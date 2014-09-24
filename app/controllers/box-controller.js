var passport = require('passport');

var BoxController = function(){
  this.authorize = passport.authenticate('box', {});
  this.callback  = passport.authenticate('box', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = BoxController;