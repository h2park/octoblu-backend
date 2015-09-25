var passport = require('passport');

var FacebookController = function(){
  this.authorize = passport.authenticate('facebook', { scope: ['email'] });
  this.callback  = passport.authenticate('facebook', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Facebook');
  };
};

module.exports = FacebookController;
