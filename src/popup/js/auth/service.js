/* global App, chrome, Me */

(function(root, factory) {

    root.Auth = factory(root);

})(this, function() {

    'use strict';
    return {
        init: function (done) {
	    App.api('/me').get().success(function(res) {
                chrome.storage.local.set({
                    token: window.localStorage.token,
                    username: res.data.username
                }, function() {
                    console.debug('stored token: ', window.localStorage.token);
                });

                Me.init(res.data, done);
            }).error(function (res) {
		done(res);
            });
        },

        signin: function (params, cb) {
	    App.api('/auth/signin').post(params).success(function (res) {
                chrome.storage.local.set({
                    token: res.token,
                    username: res.data.username
                }, function() {
                    console.debug('stored token: ', res.token);
                });
                window.localStorage.token = res.token;

                Me.init(res.data, cb);
            }).error(function (res) {
                delete window.localStorage.token;
                chrome.storage.local.remove('token');
		cb(res);
            });
        },

        signout: function () {
            delete window.localStorage.token;
            chrome.storage.local.remove(['token', 'username']);
            Me.deauthenticate();
        }
    };
});
