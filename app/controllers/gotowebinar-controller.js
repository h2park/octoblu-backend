var passport = require('passport');

var GoToWebinarController = function(){
  this.authorize = passport.authenticate('gotowebinar', {});
  this.callback  = passport.authenticate('gotowebinar', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=GoToWebinar');
  };
};

module.exports = GoToWebinarController;
