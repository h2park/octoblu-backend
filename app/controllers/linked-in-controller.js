var passport = require('passport');

var LinkedinController = function(){
  this.authorize = passport.authenticate('linkedin', {
  	'state': 'mAn5GimAn5Gig5coijg5coij',
  	'scope': ['r_emailaddress', 'r_basicprofile', 'r_network', 'r_contactinfo', 'rw_groups', 'w_messages', 'rw_company_admin', 'rw_nus', 'r_fullprofile']
	});
  this.callback  = passport.authenticate('linkedin', { failureRedirect: '/design' });
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=LinkedIn');
  };
};

module.exports = LinkedinController;
