/* global */

(function(root, factory) {

  root.Page = factory(root);

})(this, function() {

  return {
    container: null,
    button: null,

    handleClick: function() {
      var self = this;

      self.button.innerHTML = 'importing...';

      Vitamin.create(window.location.href, function(err, vitamin) {
	if (err) {
	  console.log('Error', err);
          self.button.innerHTML = 'loading error';
	  return;
	}

        self.button.innerHTML = 'import to vacay.io';
	Links.show(vitamin);

      });
    },

    insertButton: function(options) {
      var self = this;
      if (document.getElementById('vacayButton')) return;
      this.container = document.querySelector(options.container);
      if (!this.container) {
	setTimeout(function() {
	  self.evaluate();
	}, 1000);
	return;
      }

      this.button = document.createElement(options.element || 'button');
      this.button.id = 'vacayButton';
      this.button.innerHTML = 'import to vacay.io';

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
	  if (p === 'www.youtube.com' && document.getElementsByTagName('ytd-app')) {
	    return this.insertButton({
	      element: 'ytd-button-renderer',
	      container: '#info.ytd-video-primary-info-renderer',
	      classes: ['style-scope', 'ytd-button-renderer', 'force-icon-button', 'style-default']
	    })
	  }
          return this.insertButton(Vacay.hosts[p].options);
        }
      }
      console.log('single page does not match');
    }
  };
});
