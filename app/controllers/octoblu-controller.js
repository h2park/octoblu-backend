var passport = require('passport');

var OctobluController = function(){
  this.authorize = passport.authenticate('octoblu', { scope: []});
  this.callback  = passport.authenticate('octoblu', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Octoblu');
  };
};

module.exports = OctobluController;
