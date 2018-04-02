/* global window, document, CONFIG */
(function() {
    'use strict';

    document.querySelector('.sign-out').onclick = Auth.signout;

    var form = document.querySelector('form');

    form.onsubmit = function() {
	Auth.signin({
	    email: form.elements['email'].value,
	    password: form.elements['password'].value
	}, function(err) {
	    if (err && err.data) {
		console.log(err.data);
		form.querySelector('.alert').innerHTML = err.data;
		form.classList.add('shake');
		setTimeout(function() {
		    form.classList.remove('shake');
		}, 2000);
		return;
	    }
	});

	return false;
    };

    chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.count) {
	    var result = 'Found ' + msg.count + ' importable vitamins on this page.';
	    document.querySelector('.message').innerHTML = result;
	}
    });

    Auth.init(function(err) {
	document.body.classList.remove('not-ready');
	if (err) {
	    console.log(err);
	    return;
	}
    });

})();
