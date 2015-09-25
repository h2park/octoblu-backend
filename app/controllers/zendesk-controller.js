var passport = require('passport');

var ZendeskController = function(){
  this.authorize = passport.authenticate('zendesk');
  this.callback  = passport.authenticate('zendesk', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Zendesk');
  };
};

module.exports = ZendeskController;
