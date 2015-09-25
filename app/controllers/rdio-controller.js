var passport = require('passport');

var RdioController = function(){
  this.authorize = passport.authenticate('rdio', { scope: [] });
  this.callback  = passport.authenticate('rdio', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Rdio');
  };
};

module.exports = RdioController;
