var passport = require('passport');

var ReadabilityController = function(){
  this.authorize = passport.authenticate('readability');
  this.callback  = passport.authenticate('readability', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Readability');
  };
};

module.exports = ReadabilityController;
