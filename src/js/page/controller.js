/* global app, chrome */

app.controller('PageCtrl', ['$scope', 'Page', 'Notification', function($scope, Page, Notification) {
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
	    if (err) console.error(err);
            $scope.page = data;
	    $scope.loading = false;
	});
    });
}]);
