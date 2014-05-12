/* global app */

app.controller('SigninCtrl', ['$scope', 'Auth', '$timeout', function ($scope, Auth, $timeout) {
    $scope.message = null;
    $scope.email = null;
    $scope.password = null;
    $scope.shake = false;

    $scope.signin = function () {
	Auth.signin($scope.email, $scope.password);
    };

    $scope.$on('auth:signin:message', function (e, message) {
	$scope.message = message;
	$scope.shake = true;
	$timeout(function () {
            $scope.shake = false;
	}, 2000);
    });
}]);
