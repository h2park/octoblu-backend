var passport = require('passport');

var RightSignatureController = function(){
  this.authorize = passport.authenticate('rightsignature');
  this.callback  = passport.authenticate('rightsignature', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=RightSignature');
  };
};

module.exports = RightSignatureController;
