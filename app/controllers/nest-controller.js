var passport = require('passport');

var NestController = function(){
  this.authorize = passport.authenticate('nest');
  this.callback  = passport.authenticate('nest', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = NestController;
