var passport = require('passport');

var ShareFileController = function(){
  this.authorize = passport.authenticate('sharefile', {});
  this.callback  = passport.authenticate('sharefile', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=ShareFile');
  };
};

module.exports = ShareFileController;
