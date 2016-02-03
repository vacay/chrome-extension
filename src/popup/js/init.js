/* global app, analytics */

app.run(['$rootScope', 'Auth', '$window', 'User', '$timeout', function ($rootScope, Auth, $window, User, $timeout) {

    $rootScope.initialized = false;
    $rootScope.authenticated = false;
    $rootScope.username = null;
    $rootScope.message = null;
    
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
	    }, function(res) {
		if (res.close) {
		    $rootScope.$apply(function() {
			$rootScope.loading = false;
		    });
		    window.close();
		}
	    });
	});

	$timeout(function() {
	    $rootScope.message = 'Page has not finished loading. Retry in a few seconds.';
	}, 1500);

	analytics.identify(username);
    });
    
    $rootScope.$on('user:deauthenticated', function() {
	$rootScope.authenticated = false;
	$rootScope.username = null;
    });

    $rootScope.signout = Auth.signout;
    
    Auth.init();

}]);
