(function() {

    'use strict';

    console.log('vacay content script injected');

    chrome.storage.local.get(['token', 'username'], function(keys) {
        if (keys.token && keys.username) {
	    Vacay.token = keys.token;
	    Vacay.username = keys.username;

            setTimeout(function() {
		Page.evaluate();
            }, 1000);
        }
    });

    chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.token) Vacay.token = msg.token;
	if (msg.username) Vacay.username = msg.username;
	if (msg.command) {
	    if (msg.command == 'evaluate_link') {
		if (Vacay.token) Links.evaluate(sendResponse);
	    } else if (msg.command == 'evaluate_page') {
		if (Vacay.token) Page.evaluate();
	    } else if (msg.command == 'signout') {
		Vacay.token = null;
		Vacay.username = null;
		Links.cleanup();
	    }
	}
    });
})();
