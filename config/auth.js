var development = true;
if (development) {

  // expose our config directly to our application using module.exports
  module.exports = {

    // DEVELOPMENT
    'facebookAuth' : {
      'clientID'    : '244672615710168', // your App ID
      'clientSecret'  : '936b46491b2f10ac4f9941329d68b3bb', // your App Secret
      'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
      'consumerKey'     : '2GFvhpzG7PzDAiommSLIg',
      'consumerSecret'  : 'PMftByICxSfbvf7rPqfivAocDE25a0EqZGDkMbKh6Q',
      'callbackURL'     : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
      'clientID'    : '541650856544-9rka38kfvik59jb6j3denspgjn202lcv.apps.googleusercontent.com',
      'clientSecret'  : 'VE5h4f7DAh4Z5jQgscPFVIZk',
      'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    },
    'linkedIn' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/LinkedIn/callback'
    },
    'readability' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/Rdio/callback'
    },
    'stackexchange' : {
      'clientId'       : '2619',
      'clientKey'    : 'je)EAcFS8nB0JYVrAJ0zWw((',
      'clientSecret'   : 'OlbENW0n3RlpTLwLCicYgA((',
      'callbackURL'    : 'http://localhost:8080/api/auth/StackOverflow/callback'
    },
    'bitly' : {
      'clientId'       : '1c55f213d790c4b5efc3ab67520d71926daf33fe',
      'clientSecret'    : 'e07a564eca8414628833830ea3c42800f16aef98',
      'callbackURL'    : 'http://localhost:8080/api/auth/Bitly/callback'
    },
    'vimeo' : {
      'consumerKey'       : '450b10e7d2abf68021beb0c7a584175c93064729',
      'consumerSecret'   : 'dcee7ecfc313c5fb8f7a59498a123c1ff6a9d4d8',
      'token'          : 'adcfb27faab26a4f06eb20750f628b86',
      'callbackURL'    : 'http://localhost:8080/api/auth/Vimeo/callback'
    },
    'foursquare' : {
      'clientKey'    : '0FHIAV0KFBVSBNYAXBKYMZY4HE0CMBTXLIBG0TGZLQ0TRJYB',
      'clientSecret' : '3XRB1YRDIP1WYTUXZWZPN5IE5OLXV0GIBQT1VYZYDFMKGWX4',
      'callbackURL'    : 'http://localhost:8080/api/auth/FourSquare/callback'
    },
    'tumblr' : {
      'consumerKey'    : 'XbAAewbcTCBuTulBPksJRwgH4ESS0B87051HK3OhTnmDI73Pbb',
      'consumerSecret' : '1XKq2MgOZTWBC5me8NAvZyVQxkgn7xSMOM1YWaa2LG8XQV2sqs',
      'callbackURL'    : 'http://localhost:8080/api/auth/Tumblr/callback'
    },
    'fitbit' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/Rdio/callback'
    },
    'rdio' : {
      'consumerKey'    : '8xrf6qedwvp2m5zmwrrhbb2j',
      'consumerSecret' : 'E5EbEc5vdf',
      'callbackURL'    : 'http://localhost:8080/api/auth/Rdio/callback'
    },
    'port' : 8080,
    'domain': null
  }

} else {

  module.exports = {
    // PRODUCTION
    'facebookAuth' : {
      'clientID'    : 'INSERT_SECERT_HERE', // your App ID
      'clientSecret'  : 'INSERT_SECERT_HERE', // your App Secret
      'callbackURL'   : 'http://octoblu.com/auth/facebook/callback'
    },

    'twitterAuth' : {
      'consumerKey'     : '2GFvhpzG7PzDAiommSLIg',
      'consumerSecret'  : 'PMftByICxSfbvf7rPqfivAocDE25a0EqZGDkMbKh6Q',
      'callbackURL'     : 'http://octoblu.com/auth/twitter/callback'
    },
    // // Meshines
    // 'googleAuth' : {
    //   'clientID'    : '541059729530-bbt3n8qh5s8c8m5dm7dh6gojiqqrfrbg.apps.googleusercontent.com',
    //   'clientSecret'  : 'SVTqhJ7RtsK6zqRcKUZrjxM6',
    //   'callbackURL'   : 'http://octoblu.com/auth/google/callback'
    // },
    // Octoblu
    'googleAuth' : {
      'clientID'    : '369178117909-psv35jjicbu961aj4ups6h5s2mb08j6m.apps.googleusercontent.com',
      'clientSecret'  : 'bgqPgsEjZC_F65rKDxp7PwRQ',
      'callbackURL'   : 'http://octoblu.com/auth/google/callback'
    },
    'linkedIn' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/LinkedIn/callback'
    },
    'readability' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/Rdio/callback'
    },
    'stackexchange' : {
      'clientId'       : '2619',
      'clientKey'    : 'je)EAcFS8nB0JYVrAJ0zWw((',
      'clientSecret' : 'OlbENW0n3RlpTLwLCicYgA((',
      'callbackURL'    : 'http://localhost:8080/api/auth/StackOverflow/callback'
    },
    'bitly' : {
      'clientId'       : '1c55f213d790c4b5efc3ab67520d71926daf33fe',
      'clientSecret'    : 'e07a564eca8414628833830ea3c42800f16aef98',
      'callbackURL'    : 'http://localhost:8080/api/auth/Bitly/callback'
    },
    'vimeo' : {
      'consumerKey'       : '450b10e7d2abf68021beb0c7a584175c93064729',
      'consumerSecret'   : 'dcee7ecfc313c5fb8f7a59498a123c1ff6a9d4d8',
      'token'          : 'adcfb27faab26a4f06eb20750f628b86',
      'callbackURL'    : 'http://localhost:8080/api/auth/Vimeo/callback'
    },
    'foursquare' : {
      'clientKey'    : '0FHIAV0KFBVSBNYAXBKYMZY4HE0CMBTXLIBG0TGZLQ0TRJYB',
      'clientSecret' : '3XRB1YRDIP1WYTUXZWZPN5IE5OLXV0GIBQT1VYZYDFMKGWX4',
      'callbackURL'    : 'http://localhost:8080/api/auth/FourSquare/callback'
    },
    'tumblr' : {
      'consumerKey'    : 'XbAAewbcTCBuTulBPksJRwgH4ESS0B87051HK3OhTnmDI73Pbb',
      'consumerSecret' : '1XKq2MgOZTWBC5me8NAvZyVQxkgn7xSMOM1YWaa2LG8XQV2sqs',
      'callbackURL'    : 'http://localhost:8080/api/auth/Tumblr/callback'
    },
    'fitbit' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/Rdio/callback'
    },
    'rdio' : {
      'consumerKey'    : '8xrf6qedwvp2m5zmwrrhbb2j',
      'consumerSecret' : 'E5EbEc5vdf',
      'callbackURL'    : 'http://localhost:8080/api/auth/Rdio/callback'
    },
    'port' : 80,
    'domain': '.octoblu.com'
  }

};