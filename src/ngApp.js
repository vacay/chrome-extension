/* global define */

var app = angular.module('vacay', [
    'ngRoute',
    'ngAnimate'
]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(['$rootScope', '$q', '$window', 'api', function($rootScope, $q, $window, api) {
	return {
	    request: function(config) {
		if ($window.localStorage.token && config.url.indexOf(api) !== -1) {
		    config.params = config.params || {};
		    config.params.token = $window.localStorage.token;
		}
		return config || $q.when(config);
	    }
	};
    }]);
}]);

