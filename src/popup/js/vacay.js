/* global chrome, window, document, DOMTokenList, setTimeout */

(function(root, factory) {

    root.App = factory(root);

})(this, function() {

    'use strict';

    return {
	api: function(path) {
	    var token = window.localStorage.token;
	    path = 'https://api.vacay.io:8080/v1' + path;
	    return {
		get: function(params) {
		    params = params || {};
		    if (token) params.token = token;
		    return Request.get(path, params);
		},
		put: function(params) {
		    if (token) path += '?token=' + token;
		    return Request.put(path, params);
		},
		post: function(params) {
		    if (token) path += '?token=' + token;
		    return Request.post(path, params);
		},
		del: function(params) {
		    params = params || {};
		    if (token) params.token = token;
		    return Request.del(path, params);
		}
	    };
	}
    };

});
