/* global app */

app.factory('User', ['$rootScope', function($rootScope) {
    return {
	id: null,
	username: null,
	data: null,
	authenticated: null,

	init: function (user) {
	    this.id = user.id;
	    this.username = user.username;
	    this.authenticated = true;

	    this.data = user;
	    delete this.data.subscriptions;

	    $rootScope.$broadcast('user:initialized');
	    $rootScope.$broadcast('user:subscriptions:update');
	    $rootScope.$broadcast('user:authenticated', user.username);
	},

	deauthenticate: function() {
	    this.id = null;
	    this.username = null;
	    this.data = null;
	    this.authenticated = false;
	    $rootScope.$broadcast('user:deauthenticated');
	}
    };

}]);
