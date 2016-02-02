/* global app, analytics */

app.run(['$rootScope', 'Auth', '$window', 'User', function ($rootScope, Auth, $window, User) {

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(sender.tab ?
		    "from a content script:" + sender.tab.url :
		    "from the extension");

	$rootScope.$apply(function() {
	    $rootScope.loading = false;
	});
	window.close();
    });

    $rootScope.initialized = false;
    $rootScope.authenticated = false;
    $rootScope.username = null;
    
    $rootScope.$on('auth:initialized', function() {
	$rootScope.initialized = true;
    });
    
    $rootScope.$on('user:authenticated', function(e, username) {
	$rootScope.username = username;
	$rootScope.authenticated = true;

	$rootScope.loading = true;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	    chrome.tabs.sendMessage(tabs[0].id, {
		command: 'evaluate_link',
		token: $window.localStorage.token,
		username: User.username
	    }, function(response) {
		console.log(response.farewell);
	    });
	});

	analytics.identify(username);
    });
    
    $rootScope.$on('user:deauthenticated', function() {
	$rootScope.authenticated = false;
	$rootScope.username = null;
    });

    $rootScope.signout = Auth.signout;
    
    Auth.init();

}]);
