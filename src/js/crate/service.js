/* global app */

app.factory('Crate', ['$http', 'api', function($http, api) {
    return {
	create: function(id, cb) {
	    $http.post(api + '/vitamin/' + id + '/crate').success(function(response) {
		cb(null, response.data);
	    }).error(function(response) {
		cb(response.data, null);
	    });
	},

	destroy: function(id, cb) {
	    $http.delete(api + '/vitamin/' + id + '/crate').success(function(response) {
		cb(null, response.data);
	    }).error(function(response) {
		cb(response.data, null);
	    });
	}
    };
}]);
