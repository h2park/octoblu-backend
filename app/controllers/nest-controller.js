var passport = require('passport');

var NestController = function(){
  this.authorize = passport.authenticate('nest');
  this.callback  = passport.authenticate('nest', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Nest');
  };
};

module.exports = NestController;
