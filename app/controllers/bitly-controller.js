var passport = require('passport');

var BitlyController = function(){
  this.authorize = passport.authenticate('bitly');
  this.callback  = passport.authenticate('bitly', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Bitly');
  };
};

module.exports = BitlyController;
