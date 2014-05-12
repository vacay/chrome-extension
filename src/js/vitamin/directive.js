/* global app */

app.directive('vitamin', ['Crate', function(Crate) {
    return {
	restrict: 'AE',
	templateUrl: function(elem, attrs) {
	    return attrs.templateUrl || '/layouts/vitamin.html';
	},
	link: function(scope) {
	    var crate = function() {
		scope.isCrated = true;
		Crate.create(scope.vitamin.id, function(err) {
		    if (err) console.error(err);
		});
	    };

	    var uncrate = function() {
		scope.isCrated = false;
		Crate.destroy(scope.vitamin.id, function(err) {
		    if (err) console.error(err);
		});
	    };

	    scope.isCrated = scope.vitamin.crates.length ? true : false;

	    scope.toggleCrate = function() {
		scope.isCrated ? uncrate() : crate();
	    };
	}
    };
}]);
