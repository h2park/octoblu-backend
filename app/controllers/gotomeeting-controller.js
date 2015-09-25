var passport = require('passport');

var GoToMeetingController = function(){
  this.authorize = passport.authenticate('gotomeeting', {});
  this.callback  = passport.authenticate('gotomeeting', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=GoToMeeting');
  };
};

module.exports = GoToMeetingController;
