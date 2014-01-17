module.exports = function(app, passport) {
	
	var User = require('./models/user');
	var request = require('request');

	// app.get('/profile', isLoggedIn, function(req, res) {
	// 	res.render('profile', {
	// 		user : req.user
	// 	});
	// });

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.clearCookie('e2e');
		res.redirect('/');
	});

	app.post('/login', function(req, res, next) {
	  passport.authenticate('local-login', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { return res.redirect('/login'); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
        res.cookie('e2e', user._id.toString(), {
          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
          httpOnly: false
        });	

 	      // Todo: Update user presence on Skynet

	      return res.redirect('/dashboard');
	    });
	  })(req, res, next);
	});		

	app.post('/signup', function(req, res, next) {
	  passport.authenticate('local-signup', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { return res.redirect('/login'); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
        res.cookie('e2e', user._id.toString(), {
          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
          httpOnly: false
        });		      

        // Add user to Skynet
		    request.post('http://skynet.im/devices', 
		    	{form: {"type":"user", "email": user.local.email}}
			  , function (error, response, body) {
			      if(response.statusCode == 200){

			      	data = JSON.parse(body);

			        User.update({_id: user._id}, 
			        	{local: {email: user.local.email, password: user.local.password, skynetuuid: data.uuid, skynettoken: data.token}}
			        , function(err){
								if(!err) {
		                console.log("user " + user._id + " updated");
		            }
		            else {
		                console.log("Error: could not update user - error " + err);
		            }
			        });

							// User.findOne({_id: user._id}, function(err, user) {
							//     if(!err) {
							//         if(!user) {
							//             user = new User();
							//             user.local.email = user.local.email;
							//         }
							//         user.local.skynetuuid = data.uuid.toString();
							//         user.local.skynettoken = data.token.toString();
							//         user.save(function(err) {
							//             if(!err) {
							//                 console.log("user " + user._id + " updated ");
							//             }
							//             else {
							//                 console.log("Error: " + err);
							//             }
							//         });
							//     }
							// });

			      } else {
			        console.log('error: '+ response.statusCode);
			        console.log(error);
			      }
			      return res.redirect('/dashboard');
			    }
			  )

	    });
	  })(req, res, next);
	});		


	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
	app.get('/auth/facebook/callback', function(req, res, next) {

	  passport.authenticate('facebook', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { return res.redirect('/login'); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
        res.cookie('e2e', user._id.toString(), {
          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
          httpOnly: false
        });		     

        // Check if user exists in Skynet
				request.get('http://skynet.im/devices', 
		    	{qs: {"email": user.facebook.email}}
			  , function (error, response, body) {
					data = JSON.parse(body);
			    if(data.errors){

		        // Add user to Skynet
				    request.post('http://skynet.im/devices', 
				    	{form: {"type":"user", "email": user.facebook.email}}
					  , function (error, response, body) {
					      if(response.statusCode == 200){

					      	data = JSON.parse(body);
									User.findOne({_id: user._id}, function(err, user) {
								    if(!err) {
							        user.facebook.skynetuuid = data.uuid.toString();
							        user.facebook.skynettoken = data.token.toString();
							        user.save(function(err) {
						            if(!err) {
						                console.log("user " + user._id + " updated ");
						            }
						            else {
						                console.log("Error: " + err);
						            }
							        });
								    }
									});

					      } else {
					        console.log('error: '+ response.statusCode);
					        console.log(error);
					      }
					      return res.redirect('/dashboard');
					    }
					  )


			    } else {
			    	return res.redirect('/dashboard');
			    }

				});

	    });
	  })(req, res, next);

	});


	app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));
	app.get('/auth/twitter/callback', function(req, res, next) {

	  passport.authenticate('twitter', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { return res.redirect('/login'); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      console.log(user);
	      console.log(info);
        res.cookie('e2e', user._id.toString(), {
          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
          httpOnly: false
        });		      

        // Check if user exists in Skynet
				request.get('http://skynet.im/devices', 
		    	{qs: {"email": user.twitter.username + "@twitter"}}
			  , function (error, response, body) {
					data = JSON.parse(body);
			    if(data.errors){

		        // Add user to Skynet
				    request.post('http://skynet.im/devices', 
				    	{form: {"type":"user", "email": user.twitter.username + "@twitter"}}
					  , function (error, response, body) {
					      if(response.statusCode == 200){

					      	data = JSON.parse(body);
									User.findOne({_id: user._id}, function(err, user) {
								    if(!err) {
							        user.twitter.skynetuuid = data.uuid.toString();
							        user.twitter.skynettoken = data.token.toString();
							        user.save(function(err) {
						            if(!err) {
						                console.log("user " + user._id + " updated ");
						            }
						            else {
						                console.log("Error: " + err);
						            }
							        });
								    }
									});

					      } else {
					        console.log('error: '+ response.statusCode);
					        console.log(error);
					      }
					      return res.redirect('/dashboard');
					    }
					  )


			    } else {
			    	return res.redirect('/dashboard');
			    }

				});




	    });
	  })(req, res, next);

	});


	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
	app.get('/auth/google/callback', function(req, res, next) {

	  passport.authenticate('google', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { return res.redirect('/login'); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      console.log(user);
	      console.log(info);
        res.cookie('e2e', user._id.toString(), {
          maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
          httpOnly: false
        });		      

        // Check if user exists in Skynet
				request.get('http://skynet.im/devices', 
		    	{qs: {"email": user.google.email}}
			  , function (error, response, body) {
					data = JSON.parse(body);
			    if(data.errors){

		        // Add user to Skynet
				    request.post('http://skynet.im/devices', 
				    	{form: {"type":"user", "email": user.google.email}}
					  , function (error, response, body) {
					      if(response.statusCode == 200){

					      	data = JSON.parse(body);
									User.findOne({_id: user._id}, function(err, user) {
								    if(!err) {
							        user.google.skynetuuid = data.uuid.toString();
							        user.google.skynettoken = data.token.toString();
							        user.save(function(err) {
						            if(!err) {
						                console.log("user " + user._id + " updated ");
						            }
						            else {
						                console.log("Error: " + err);
						            }
							        });
								    }
									});

					      } else {
					        console.log('error: '+ response.statusCode);
					        console.log(error);
					      }
					      return res.redirect('/dashboard');
					    }
					  )


			    } else {
			    	return res.redirect('/dashboard');
			    }

				});


	    });
	  })(req, res, next);

	});

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

// locally --------------------------------
	app.get('/connect/local', function(req, res) {
		res.render('connect-local.ejs', { message: req.flash('loginMessage') });
	});
	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect : '/dashboard', // redirect to the secure profile section
		failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

// facebook -------------------------------

	// send to facebook to do the authentication
	app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

	// handle the callback after facebook has authorized the user
	app.get('/connect/facebook/callback',
		passport.authorize('facebook', {
			successRedirect : '/dashboard',
			failureRedirect : '/'
		}));

// twitter --------------------------------

	// send to twitter to do the authentication
	app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

	// handle the callback after twitter has authorized the user
	app.get('/connect/twitter/callback',
		passport.authorize('twitter', {
			successRedirect : '/dashboard',
			failureRedirect : '/'
		}));


// google ---------------------------------

	// send to google to do the authentication
	app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

	// the callback after google has authorized the user
	app.get('/connect/google/callback',
		passport.authorize('google', {
			successRedirect : '/dashboard',
			failureRedirect : '/'
		}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/dashboard');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/dashboard');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/dashboard');
		});
	});

	// google ---------------------------------
	app.get('/unlink/google', function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/dashboard');
		});
	});

	// APIs
	app.get('/api/user/:id', function(req, res) {

		// use mongoose to find user
    User.findOne({
      _id : req.params.id
    }, function(err, userInfo) {
      if (err) {
        res.send(err);
      } else {
      	// not sure why local.password cannot be deleted from user object
      	userInfo.local.password = null;
      	delete userInfo.local.password;
        res.json(userInfo);
      }
    });
	});

	// show the home page (will also have our login links)
	app.get('/*', function(req, res) {
		res.sendfile('./public/index.html');
	});


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}






// var Todo = require('./models/todo');

// module.exports = function(app) {

// 	// api ---------------------------------------------------------------------
// 	// get all todos
// 	app.get('/api/todos', function(req, res) {

// 		// use mongoose to get all todos in the database
// 		Todo.find(function(err, todos) {

// 			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
// 			if (err)
// 				res.send(err)

// 			res.json(todos); // return all todos in JSON format
// 		});
// 	});

// 	// create todo and send back all todos after creation
// 	app.post('/api/todos', function(req, res) {

// 		// create a todo, information comes from AJAX request from Angular
// 		Todo.create({
// 			text : req.body.text,
// 			done : false
// 		}, function(err, todo) {
// 			if (err)
// 				res.send(err);

// 			// get and return all the todos after you create another
// 			Todo.find(function(err, todos) {
// 				if (err)
// 					res.send(err)
// 				res.json(todos);
// 			});
// 		});

// 	});

// 	// delete a todo
// 	app.delete('/api/todos/:todo_id', function(req, res) {
// 		Todo.remove({
// 			_id : req.params.todo_id
// 		}, function(err, todo) {
// 			if (err)
// 				res.send(err);

// 			// get and return all the todos after you create another
// 			Todo.find(function(err, todos) {
// 				if (err)
// 					res.send(err)
// 				res.json(todos);
// 			});
// 		});
// 	});

// 	// application -------------------------------------------------------------
// 	app.get('*', function(req, res) {
// 		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
// 	});
// };