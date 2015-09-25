var passport = require('passport');

var XeroController = function(){
  this.authorize = passport.authenticate('xero');
  this.callback  = passport.authenticate('xero', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Xero');
  };
};

module.exports = XeroController;
