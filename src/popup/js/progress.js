/* global app */

app.directive('ngProgressCircular', function() {
    return {
	restrict: 'E',
	template: '<div class="md-spinner-wrapper">' +
            '<div class="md-inner">' +
            '<div class="md-gap"></div>' +
            '<div class="md-left">' +
            '<div class="md-half-circle"></div>' +
            '</div>' +
            '<div class="md-right">' +
            '<div class="md-half-circle"></div>' +
            '</div>' +
            '</div>' +
            '</div>'
    };
});
