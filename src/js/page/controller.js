/* global app, chrome */

app.controller('PageCtrl', ['$scope', 'Page', function($scope, Page) {
    $scope.vitamins = null;
    $scope.page = null;
    $scope.loading = true;

    chrome.tabs.getSelected(null, function(tab) {
	Page.create(tab.url, function(err, data) {
	    if (err) console.error(err);
            $scope.page = data;
	    $scope.loading = false;
	});
    });
}]);
