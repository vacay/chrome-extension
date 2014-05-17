/* global define, app */

app.factory('Page', ['$rootScope', '$http', 'api', function($rootScope, $http, api) {
    return {

	isUrl: function (text) {
            var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
				     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
				     '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
				     '(?::\\d{2,5})?' + // port
				     '(?:/[^\\s]*)?$', 'i'); // path

            return pattern.test(text);
        },

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
