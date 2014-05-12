/* global define, app */

app.factory('Page', ['$rootScope', '$http', 'api', function($rootScope, $http, api) {
    return {
	create: function(url, cb) {
	    $http.post(api + '/page', {
		url: url
	    }).success(function(response) {
		cb(null, response.data);
		analytics.track('page:create');
	    }).error(function(response) {
		cb(response.data || 'failed to load', null);
	    });
	}
    };
}]);
