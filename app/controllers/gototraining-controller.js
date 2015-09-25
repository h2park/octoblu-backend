var passport = require('passport');

var GoToTrainingController = function(){
  this.authorize = passport.authenticate('gototraining', {});
  this.callback  = passport.authenticate('gototraining', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=GoToTraining');
  };
};

module.exports = GoToTrainingController;
