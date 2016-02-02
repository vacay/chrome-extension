/* global */

(function(root, factory) {

    root.Page = factory(root);

})(this, function() {

    return {
        vitamin: null,
	
        container: null,
        button: null,

	handleClick: function() {
            var self = this;

	    if (self.vitamin) {
		Links.show(self.vitamin);
		return;
	    }

            self.button.innerHTML = 'importing...';

	    Vitamin.create(window.location.href, function(err, vitamin) {
		if (err) {
		    console.log('Error', err);
                    self.button.innerHTML = 'loading error';
		    return;
		}

                self.vitamin = vitamin;
                self.button.innerHTML = 'import to vacay.io';
		Links.show(self.vitamin);

	    });
	},
	
        insertButton: function(options) {
	    if (document.getElementById('vacayButton')) return;
	    this.button = document.createElement('button');
	    this.button.id = 'vacayButton';
            this.button.innerHTML = 'import to vacay.io';
            this.container = document.querySelector(options.container);
            DOMTokenList.prototype.add.apply(this.button.classList, options.classes);
            for(var style in options.style) {
                if (options.style.hasOwnProperty(style))
		    this.button.style[style] = options.style[style];
            }
            this.container.appendChild(this.button);
            this.button.addEventListener('click', this.handleClick.bind(this));
        },
	
	evaluate: function() {
            for (var p in Vacay.hosts) {
                if (Vacay.hosts.hasOwnProperty(p) && Vacay.hosts[p].url.test(window.location.href)) {
                    this.insertButton(Vacay.hosts[p].options);
                    return;
                }
            }
            console.log('single page does not match');
	}
    };
});
