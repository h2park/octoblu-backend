var passport = require('passport');

var SlackController = function(){
  this.authorize = passport.authenticate('slack');
  this.callback  = passport.authenticate('slack', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Slack');
  };
};

module.exports = SlackController;
