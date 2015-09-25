var passport = require('passport');

var ThingiverseController = function(){
  this.authorize = passport.authenticate('thingiverse');
  this.callback  = passport.authenticate('thingiverse', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Thingiverse');
  };
};

module.exports = ThingiverseController;
