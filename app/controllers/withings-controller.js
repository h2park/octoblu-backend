var passport = require('passport');

var WithingsController = function(){
  this.authorize = passport.authenticate('withings');
  this.callback  = passport.authenticate('withings', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Withings');
  };
};

module.exports = WithingsController;
