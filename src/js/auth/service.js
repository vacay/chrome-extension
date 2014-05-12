/* global app, chrome, analytics */

app.factory('Auth', ['$http', 'User', '$rootScope', 'api', '$window', function ($http, User, $rootScope, api, $window) {
    return {
	init: function () {
	    $http.get(api + '/me').success(function (response) {
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
		$window.localStorage.token = response.token;
		User.init(response.data);
		analytics.track('signin');
	    }).error(function (response) {
		delete $window.sessionStorage.token;
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
