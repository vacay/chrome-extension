/* global */

(function(root, factory) {

    root.Links = factory(root);

})(this, function() {

    'use strict';

    function canonicalize(url) {
	var div = document.createElement('div');
	div.innerHTML = '<a></a>';
	div.firstChild.href = url; // Ensures that the href is properly escaped
	div.innerHTML = div.innerHTML; // Run the current innerHTML back through the parser
	return div.firstChild.href;
    }

    return {
	button: null,
	cleanup: function() {
	    document.body.classList.remove('vacay-crx-no-scroll');
	    var c = document.getElementById('vacay-crx-container');
	    if (c) c.remove();
	    var links = document.querySelectorAll('a.vacay-crx-link');
	    Elem.each(links, this.disableLink.bind(this));
	    if (this.button) this.button.remove();

	    var covers = document.querySelectorAll('.vacay-crx-cover');
	    Elem.each(covers, function(c) { c.remove(); });
	},
	show: function(vitamin) {

	    Tags.load(function(err, tags) {
		if (!err) Vacay.tags = tags;
	    });

	    document.body.classList.add('vacay-crx-no-scroll');
	    
	    var container = Elem.create({ id: 'vacay-crx-container' });
	    var close = Elem.create({ id: 'vacay-crx-close', parent: container });
	    var overlay = Elem.create({ id: 'vacay-crx-overlay', parent: container });
	    var content = Elem.create({ id: 'vacay-crx-content', parent: container });
	    var list = Elem.create({
		className: 'list' ,
		attributes: {
		    empty: 'There are no drafts you can add this vitamin to.'
		}
	    });

	    content.appendChild(Vitamin.render(vitamin));

	    overlay.onclick = this.cleanup.bind(this);
	    close.onclick = this.cleanup.bind(this);

	    var form = Elem.create({tag: 'form'});
	    var input = Elem.create({
		tag: 'input',
		attributes: {
		    placeholder: 'Create a new draft...'
		}
	    });
	    form.appendChild(input);

	    form.onsubmit = function() {
		var description = input.value;
		input.value = null;

		Prescription.create(description, vitamin.id, function(err, res) {
		    if (err) {
			console.log(err);
			return;
		    }

		    list.insertBefore(Prescription.render(res, vitamin), list.firstChild);
		});

		return false;
	    };
	    content.appendChild(form);
	    content.appendChild(list);

	    Prescription.getDrafts(function(err, prescriptions) {
		if (err) {
		    console.log(err);
		    return;
		}

		var frag = document.createDocumentFragment();

		prescriptions.forEach(function(p) {
		    frag.appendChild(Prescription.render(p, vitamin));
		});

		list.appendChild(frag);
	    });

	    document.body.appendChild(container);
	},	
	handleClick: function(url, e) {
	    var self = this;
	    e.preventDefault();
	    e.stopImmediatePropagation();
	    e.stopPropagation();	    
	    e.cancelBubble = true;

	    url = canonicalize(url);
	    Loading.show();

	    Vitamin.create(url, function(err, vitamin) {

		Loading.hide();

		if (err) {
		    alert('loading error');
		    console.log('error:', err);
		    return;
		}

		self.show(vitamin);
	    });
	    
	    return false;
	},	
	disableLink: function(link) {
	    link.style.background = null;
	    link.style.position = null;
	    link.classList.remove('vacay-crx-link');
	},	
	enableLink: function(link) {
	    link.style.background = 'yellow';
	    link.style.position = 'relative';
	    link.classList.add('vacay-crx-link');	    
	    
	    var cover = Elem.create({ tag: 'span', className: 'vacay-crx-cover' });
	    cover.addEventListener('click', this.handleClick.bind(this, link.href));
	    link.appendChild(cover);
	},
	enableIframe: function(iframe) {
	    var cover = Elem.create({ className: 'vacay-crx-cover' });
	    cover.addEventListener('click', this.handleClick.bind(this, iframe.src));

	    if (iframe.parentNode.classList.contains('vacay-crx-iframe-container')) {
		iframe.parentNode.appendChild(cover);
	    } else {
		var container = Elem.create({ className: 'vacay-crx-iframe-container' });
		iframe.parentNode.insertBefore(container, iframe);
		iframe.parentNode.removeChild(iframe);
		container.appendChild(iframe);
		container.appendChild(cover);
	    }
	},
	insertCancelButton: function() {
	    if (document.getElementById('vacay-crx-button')) return;
	    this.button = Elem.create({ id: 'vacay-crx-button', text: 'scanning...' });
	    document.body.appendChild(this.button);
	},	
	evaluate: function(sendResponse) {

	    this.insertCancelButton();
	    
	    var self = this;
	    var links = document.links;
	    var iframes = document.querySelectorAll('iframe');
	    var count = 0;

	    var hostname = window.location.hostname;
	    if (hostname.indexOf('bandcamp.com') !== -1) hostname = 'bandcamp.com';
	    var host = Vacay.hosts[hostname];

	    Elem.each(links, function(link) {
		var url = canonicalize(link.href);
		
		if (!host) {
		    for (var h in Vacay.hosts) {
			if (Vacay.hosts.hasOwnProperty(h) && Vacay.hosts[h].url.test(url)) {
			    self.enableLink(link);
			    count++;
			}
		    }
		} else if (host.url.test(url)) {
		    self.enableLink(link);
		    count++;
		}
	    });

	    if (!host) {
		Elem.each(iframes, function(iframe) {
		    for (var h in Vacay.hosts) {
			if (Vacay.hosts.hasOwnProperty(h) && Vacay.hosts[h].embed && Vacay.hosts[h].embed.test(iframe.src)) {
			    self.enableIframe(iframe);
			    count++;
			}
		    }
		});
	    }

	    if (count) {
		this.button.onclick = this.cleanup.bind(this);
		this.button.innerHTML = 'cancel import';
	    } else {
		this.button.remove();
	    }

	    sendResponse({
		count: count
	    });
	}
    };
});
