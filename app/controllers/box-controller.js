var passport = require('passport');

var BoxController = function(){
  this.authorize = passport.authenticate('box', {});
  this.callback  = passport.authenticate('box', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Box');
  };
};

module.exports = BoxController;
