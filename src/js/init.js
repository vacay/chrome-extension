/* global app, analytics */

app.run(['$rootScope', 'Auth', function ($rootScope, Auth) {

    $rootScope.initialized = false;
    $rootScope.authenticated = false;
    $rootScope.username = null;
    
    $rootScope.$on('auth:initialized', function() {
	$rootScope.initialized = true;
    });
    
    $rootScope.$on('user:authenticated', function(e, username) {
	$rootScope.username = username;
	$rootScope.authenticated = true;

	analytics.identify(username);
    });
    
    $rootScope.$on('user:deauthenticated', function() {
	$rootScope.authenticated = false;
	$rootScope.username = null;
    });

    $rootScope.signout = Auth.signout;
    
    Auth.init();

}]);
