var passport = require('passport');

var FlicController = function(){
  this.authorize = passport.authenticate('flic');
  this.callback  = passport.authenticate('flic', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = FlicController;
