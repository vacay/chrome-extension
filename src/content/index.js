(function() {

    'use strict';
    chrome.storage.local.get(['token', 'username'], function(keys) {
        if (keys.token && keys.username) {
	    Vacay.token = keys.token;
	    Vacay.username = keys.username;

            setTimeout(function() {
		Page.evaluate();
		Links.insertImportButton();
            }, 1000);
        }
    });
    
})();
