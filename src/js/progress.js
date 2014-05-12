/* global app */

app.directive('ngProgress', ['$rootScope', '$timeout', '$interval', function ($rootScope, $timeout, $interval) {
    return {
        replace: true,
        restrict: 'E',
	scope: {
	    loading: '=',
	    value: '='
	},
        link: function (scope, elem) {

	    scope.count = 0;

	    var intervalCounterId = 0;
	    var visible = false;

	    var hide = function() {
		visible = false;
		$timeout(function() {
		    elem.children().css('opacity', '0');
		    $timeout(function() {
			scope.count = 0 ;
		    }, 200);
		}, 500);
	    };

	    var show = function() {
		visible = true;
		$timeout(function() {
		    elem.children().css('opacity', '1');
		});
	    };

	    var start = function() {
		show();
                intervalCounterId = $interval(function () {
                    if (isNaN(scope.count)) {
                        $interval.cancel(intervalCounterId);
                        scope.count = 0;
                        hide();
                    } else {
                        var remaining = 100 - scope.count;
                        scope.count = scope.count + (0.15 * Math.pow(1 - Math.sqrt(remaining), 2));
                    }
                }, 200);
	    };

	    var complete = function() {
		$interval.cancel(intervalCounterId);
                scope.count = 100;
                $timeout(function () {
                    hide();
                }, 1000);
	    };

	    var setWidth = function(val) {
		if (!visible) show();
		elem.children().css('width', val + '%');
		if (val === 100) hide();
	    };

	    scope.$watch('value', function(newVal) {
		if (newVal) setWidth(newVal);
	    });

	    scope.$watch('count', function(newVal) {
		if (newVal) elem.children().css('width', newVal + '%');
	    });

	    scope.$watch('loading', function(newVal, oldVal) {
		if (newVal === true) start();
		else if (!newVal && oldVal === true) complete();
	    });
        },
        template: '<div class="ngProgress-container"><div class="ngProgress"></div></div>'
    };
}]);
