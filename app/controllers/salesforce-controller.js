var passport = require('passport');

var SalesforceController = function(){
  this.authorize = passport.authenticate('forcedotcom', { scope : ['id','chatter_api', 'api', 'full', 'refresh_token', 'visualforce', 'web'] });
  this.callback  = passport.authenticate('forcedotcom', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=SalesForce');
  };
};

module.exports = SalesforceController;
