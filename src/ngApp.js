/* global angular, CONFIG, printStackTrace, CryptoJS, window */

var app = angular.module('vacay', [
    'ngRoute',
    'ngAnimate'
]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(['$rootScope', '$q', '$window', 'api', function($rootScope, $q, $window, api) {
        return {
            request: function(config) {
                if ($window.localStorage.token && config.url.indexOf(api) !== -1) {
                    config.params = config.params || {};
                    config.params.token = $window.localStorage.token;
                }
                return config || $q.when(config);
            }
        };
    }]);
}]);

app.config(['$provide', function($provide) {
    $provide.decorator('$log', ['$delegate', '$injector', '$window', function($delegate, $injector, $window) {

        var _error = $delegate.error;

        var report = function(exception, cause, data) {
            var $http = $injector.get('$http');
            try {

                if(!CONFIG.log.url){
                    _error('Can\'t log error to server: logging url not set\n');
                    return;
                }

                var errorMessage = exception.toString();
                var stackTrace = printStackTrace({ e: exception });
                var userAgent = $window.navigator.userAgent;

                var params = {
                    error: {
                        errorUrl: $window.location.href,
                        errorMessage: errorMessage,
                        stackTrace: stackTrace,
                        cause: cause || '' ,
                        userAgent: userAgent,
                        data: data || ''
                    }
                };

                var hash = CryptoJS.MD5(JSON.stringify(params)).toString();

                if (!$window.sessionStorage.getItem(hash)) {

                    $window.sessionStorage.setItem(hash, new Date());
                    $http.post(CONFIG.log.url, params);

                }

            } catch ( loggingError ) {
                $delegate.warn( 'Error logging failed' );
                $delegate.log( loggingError );
            }
        };

        $delegate.error = function(msg, cause, data) {

            _error(msg);
            report(msg, cause, data);

        };

        $delegate.fatal = function(exception, cause){

            _error(exception);
            report(exception, cause);

        };

        window.onerror = function (errorMsg) {
            if (errorMsg.indexOf('Script error.') > -1) return;
            report(errorMsg);
        };

        return $delegate;

    }]);

}]);

app.config(['$provide', function($provide) {
    $provide.decorator('$exceptionHandler', ['$delegate', '$log', function($delegate, $log) {
        return function(exception, cause) {
            $log.fatal(exception, cause);
        };
    }]);
}]);
