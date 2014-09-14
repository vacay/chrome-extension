/* global app, chrome */

app.controller('PageCtrl', ['$scope', 'Page', 'Notification', '$log', function($scope, Page, Notification, $log) {
    $scope.vitamins = null;
    $scope.page = null;
    $scope.loading = true;

    chrome.tabs.getSelected(null, function(tab) {
	if (!Page.isUrl(tab.url)) {
	    Notification.add('error', 'Not a valid url');
	    $scope.loading = false;
	    return;
	}
	Page.create(tab.url, function(err, data) {
	    if (err) $log.error(err);
            $scope.page = data;
	    $scope.loading = false;
	});
    });
}]);
