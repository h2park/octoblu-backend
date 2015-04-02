var passport = require('passport');

var XeroController = function(){
  this.authorize = passport.authenticate('xero');
  this.callback  = passport.authenticate('xero', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = XeroController;
