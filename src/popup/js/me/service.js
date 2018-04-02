/* global document */

(function(root, factory) {

    root.Me = factory(root);

})(this, function() {

    'use strict';
    return {
        id: null,
        username: null,
        data: null,
        authenticated: null,

        init: function (user, cb) {
            this.id = user.id;
            this.username = user.username;
            this.authenticated = true;

            this.data = user;
            delete this.data.subscriptions;

	    document.querySelector('.user').innerHTML = this.username;
	    document.body.classList.toggle('authenticated', true);

	    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
		    command: 'evaluate_link',
		    token: window.localStorage.token,
		    username: Me.username
		}, function(res) {
		    if (!res) {
			var msg = 'Page has not finished loading. Retry in a few seconds.';
			document.querySelector('.message').innerHTML = msg;
		    }
		});
	    });

	    cb();
        },

        deauthenticate: function() {
	    document.body.classList.toggle('authenticated', false);
            this.id = null;
            this.username = null;
            this.data = null;
            this.authenticated = false;

	    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
		    command: 'signout'
		});
	    });
        }
    };

});
