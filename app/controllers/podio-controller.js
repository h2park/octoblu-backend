var passport = require('passport');

var PodioController = function(){
  this.authorize = passport.authenticate('podio');
  this.callback  = passport.authenticate('podio', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Podio');
  };
};

module.exports = PodioController;
