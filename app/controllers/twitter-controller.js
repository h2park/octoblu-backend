var passport = require('passport');

var TwitterController = function(){
  this.authorize = passport.authenticate('twitter', { scope: 'email' });
  this.callback  = passport.authenticate('twitter', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Twitter');
  };
};

module.exports = TwitterController;
