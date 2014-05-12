/* global document, app */

var environment = '@@environment';

if (environment === 'development') {
    app.constant('api', 'http://localhost:8000/v1');
} else {
    app.constant('api', 'https://api.vacay.io/v1');
    window.analytics.load('u32ikjebq3');
    window.analytics.page();
} 
	
angular.bootstrap(document, [app.name]);
