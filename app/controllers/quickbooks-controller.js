var passport = require('passport');

var QuickBooksController = function(){
  this.authorize = passport.authenticate('intuit', { });
  this.callback  = passport.authenticate('intuit', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = QuickBooksController;
