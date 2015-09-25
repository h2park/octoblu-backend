var passport = require('passport');

var SurveyMonkeyController = function(){
  this.authorize = passport.authenticate('surveymonkey');
  this.callback  = passport.authenticate('surveymonkey', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=SurveyMonkey');
  };
};

module.exports = SurveyMonkeyController;
