/* global */
(function(root, factory) {

    root.Loading = factory(root);

})(this, function() {

    'use strict';

    return {
	show: function() {
	    var html = '<div class="vacay-md-loading indeterminate">' +
		    '<div class="vacay-md-spinner-wrapper">' +
		    '<div class="vacay-md-inner">' +
		    '<div class="vacay-md-gap"></div>' +
		    '<div class="vacay-md-left">' +
		    '<div class="vacay-md-half-circle"></div>' +
		    '</div>' +
		    '<div class="vacay-md-right">' +
		    '<div class="vacay-md-half-circle"></div>' +
		    '</div></div></div></div>';
	    
	    Elem.create({
		id: 'vacay-loading',
		html: html,
		parent: document.body
	    });
	},

	hide: function() {
	    document.getElementById('vacay-loading').remove();
	}
    };
});
