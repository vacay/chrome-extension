/* global window, angular, document, app, CONFIG */

app.constant('api', CONFIG.api);

if (CONFIG.env === 'production') {
    window.analytics.load(CONFIG.analytics);
    window.analytics.page();
}
	
angular.bootstrap(document, [app.name]);
