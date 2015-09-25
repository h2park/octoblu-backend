var passport = require('passport');

var PaypalController = function(){
  this.authorize = passport.authenticate('paypal', {});
  this.callback  = passport.authenticate('paypal', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=PayPal');
  };
};

module.exports = PaypalController;
