var passport = require('passport');

var OctobluController = function(){
  this.authorize = passport.authenticate('octoblu', { scope: []});
  this.callback  = passport.authenticate('octoblu', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = OctobluController;
