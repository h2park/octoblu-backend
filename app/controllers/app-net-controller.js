var passport = require('passport');

var AppNetController = function(){
  this.authorize = passport.authenticate('appdotnet', { scope: 'basic stream write_post follow public_messages' });
  this.callback  = passport.authenticate('appdotnet', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=App.net');
  };
};

module.exports = AppNetController;
