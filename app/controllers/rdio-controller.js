var passport = require('passport');

var RdioController = function(){
  this.authorize = passport.authenticate('rdio', { scope: [] });
  this.callback  = passport.authenticate('rdio', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = RdioController;
