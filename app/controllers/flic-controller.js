var passport = require('passport');

var FlicController = function(){
  this.authorize = passport.authenticate('flic');
  this.callback  = passport.authenticate('flic', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Flic');
  };
};

module.exports = FlicController;
