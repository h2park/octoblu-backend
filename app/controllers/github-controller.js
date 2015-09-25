var passport = require('passport');

var GithubController = function(){
  this.authorize = passport.authenticate('github', { scope: 'user,repo,repo_deployment,notifications,gist' });
  this.callback  = passport.authenticate('github', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Github');
  };
};

module.exports = GithubController;
