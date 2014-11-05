(function(global, $) {

  function getParam(variable, url) {
    if (!url) url = global.location.href;
    if (!~url.indexOf('?')) {
      return false;
    }
    var query = url.split('?')[1];
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return false;
  }

  function closeSettings(uuid, token){
  	console.log('Closing', uuid, token);
  	global.location.href = "octoblu://close?uuid=" + uuid + "&token=" + token;
  }

  function checkUrl(){
  	var url 		 = global.location.href,
  			uuidTest = /\?uuid=(.+)$/.exec(url);
    if (uuidTest) {
      var uuid 	= getParam('uuid', url),
        	token = getParam('token', url);
      // Set new Skynet Tokens
      if (uuid && token) {
        console.log('Verified Credentials');
        closeSettings(uuid, token);
      }
    }
  }

  function loginViaProvider(provider) {
    var url = '/api/oauth/' + provider;
    url += '?mobile=true&referrer=' + encodeURIComponent('/auth-login.html');
    global.open(url, '_self', 'location=no,toolbar=no');
  }

  $(document).ready(function() {

  	checkUrl();

    $('.login-via-provider').click(function(e) {
      e.preventDefault();
      loginViaProvider($(this).attr('data-provider'));
      return false;
    });

    $('#loginForm').submit(function(e) {
      e.preventDefault();
      $.post('/api/auth', {
        email: $('#email').val(),
        password: $('#password').val()
      }).success(function(currentUser) {
        closeSettings(currentUser.skynet.uuid, currentUser.skynet.token);
      }).error(function() {
        alert('There was an error signing into Octoblu');
      });
      return false;
    });
  });

})(window, jQuery);