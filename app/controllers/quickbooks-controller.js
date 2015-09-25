var passport = require('passport');

var QuickBooksController = function(){
  this.authorize = passport.authenticate('intuit', { });
  this.callback  = passport.authenticate('intuit', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=QuickBooks');
  };
};

module.exports = QuickBooksController;
