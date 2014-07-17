angular.module('octobluApp')
    .service('AuthService', function ($q, $cookies,  $http) {
        var currentUser = {};

        //TODO: move me to the eventual root controller.
        function getProfileUrl(user) {

            if (user.local) {
                user.avatarUrl = 'http://avatars.io/email/' + user.local.email.toString();
            } else if (user.twitter) {

            } else if (user.facebook) {
                user.avatarUrl = 'https://graph.facebook.com/' + user.facebook.id.toString() + '/picture';
            } else if (user.google) {
                user.avatarUrl = 'https://plus.google.com/s2/photos/profile/' + user.google.id.toString() + '?sz=32';
            }
        }

        function loginHandler(result) {
            angular.copy(result.data, currentUser);
            $cookies.skynetuuid = currentUser.skynetuuid;
            $cookies.skynettoken = currentUser.skynettoken;
            getProfileUrl(currentUser);
            return currentUser;
        }

        function logoutHandler(err) {
            angular.copy({}, currentUser);
            delete $cookies.skynetuuid;
            delete $cookies.skynettoken;
        }

        return {
            login: function (email, password) {
                return $http.post('/api/auth', {
                    email: email,
                    password: password
                }).then(loginHandler, function (err) {
                    logoutHandler(err);
                    throw err;
                });
            },

            logout: function () {
                return $http.delete('/api/auth').then(logoutHandler, logoutHandler);
            },

            resetPassword: function(email) {
                return $http.post('/api/reset', {email: email}).then(function(response){
                    if(response.status !== 201) {
                        throw response.data;
                    }
                });
            },

            setPassword: function(resetToken, password) {
                return $http.put('/api/reset/'+resetToken, {password: password}).then(function(response){
                    if(response.status !== 204) {
                        throw response.data;
                    }
                });
            },

            updatePassword: function(oldPassword, newPassword) {
                return $http.put('/api/auth', {oldPassword: oldPassword, newPassword: newPassword}).then(function(response){
                    if(response.status !== 204) {
                        throw response.data;
                    }
                })
            },

            getCurrentUser: function (force) {
                if (currentUser.id && !force) {
                    var defer = $q.defer();
                    defer.resolve(currentUser);
                    return defer.promise;
                } else {
                    angular.copy({}, currentUser);
                    return $http.get('/api/auth').then(loginHandler, function (err) {
                        logoutHandler(err);
                        throw err;
                    });
                }
            }
        };
    });
