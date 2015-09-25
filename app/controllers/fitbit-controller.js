var passport = require('passport');

var FitbitController = function(){
  this.authorize = passport.authenticate('fitbit', { scope: ['r_basicprofile', 'r_emailaddress'] });
  this.callback  = passport.authenticate('fitbit', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=FitBit');
  };
};

module.exports = FitbitController;
