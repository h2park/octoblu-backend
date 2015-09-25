var passport = require('passport');

var InstagramController = function(){
  this.authorize = passport.authenticate('instagram');
  this.callback  = passport.authenticate('instagram', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Instagram');
  };
};

module.exports = InstagramController;
