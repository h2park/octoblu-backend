var passport = require('passport');

var VimeoController = function(){
  this.authorize = passport.authenticate('vimeo');
  this.callback  = passport.authenticate('vimeo', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Vimeo');
  };
};

module.exports = VimeoController;
