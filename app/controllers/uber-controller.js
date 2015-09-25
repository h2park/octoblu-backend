var passport = require('passport');

var UberController = function(){
  this.authorize = passport.authenticate('uber');
  this.callback  = passport.authenticate('uber', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Uber');
  };
};

module.exports = UberController;
