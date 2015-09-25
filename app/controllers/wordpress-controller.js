var passport = require('passport');

var WordPressController = function(){
  this.authorize = passport.authenticate('wordpress');
  this.callback  = passport.authenticate('wordpress', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Wordpress');
  };
};

module.exports = WordPressController;
