var passport = require('passport');

var GoToAssistController = function(){
  this.authorize = passport.authenticate('gotoassist', {});
  this.callback  = passport.authenticate('gotoassist', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=GoToAssist');
  };
};

module.exports = GoToAssistController;
