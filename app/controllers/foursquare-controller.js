var passport = require('passport');

var FourSquareController = function(){
  this.authorize = passport.authenticate('foursquare');
  this.callback  = passport.authenticate('foursquare', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Foursquare');
  };
};

module.exports = FourSquareController;
