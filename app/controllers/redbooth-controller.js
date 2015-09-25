var passport = require('passport');

var RedBoothController = function(){
  this.authorize = passport.authenticate('redbooth');
  this.callback  = passport.authenticate('redbooth', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=RedBooth');
  };
};

module.exports = RedBoothController;
