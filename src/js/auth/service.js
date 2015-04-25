/* global app, chrome, analytics */

app.factory('Auth', ['$http', 'User', '$rootScope', 'api', '$window', '$log', function ($http, User, $rootScope, api, $window, $log) {
    return {
        init: function () {
            $http.get(api + '/me').success(function (response) {
                chrome.storage.local.set({
                    token: $window.localStorage.token,
                    username: response.data.username
                }, function() {
                    $log.debug('stored token: ', $window.localStorage.token);
                });

                User.init(response.data);
                $rootScope.$broadcast('auth:initialized');
                analytics.track('init');
            }).error(function () {
                $rootScope.$broadcast('auth:initialized');
                $rootScope.$broadcast('show:landing');
            });
        },

        signin: function (email, password) {
            $http.post(api + '/auth/signin', {
                email: email,
                password: password
            }).success(function (response) {
                chrome.storage.local.set({
                    token: response.token,
                    username: response.data.username
                }, function() {
                    $log.debug('stored token: ', response.token);
                });
                $window.localStorage.token = response.token;

                User.init(response.data);
                analytics.track('signin');
            }).error(function (response) {
                delete $window.localStorage.token;
                chrome.storage.local.remove('token');
                $rootScope.$broadcast('auth:signin:message', response.data);
            });
        },

        signout: function () {
            delete $window.localStorage.token;
            User.deauthenticate();
            analytics.track('signout');
        }
    };
}]);
