var passport = require('passport');

var DropboxController = function(){
  this.authorize = passport.authenticate('dropbox-oauth2');
  this.callback  = passport.authenticate('dropbox-oauth2', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Dropbox');
  };
};


module.exports = DropboxController;
