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
	    this.button.onclick = this.evaluate.bind(this);
	    this.button.innerHTML = 'import to vacay';

	    var covers = document.querySelectorAll('.vacay-crx-link-cover');
	    Elem.each(covers, function(c) { c.remove(); });
	},
	show: function(vitamin) {

	    Tags.load(function(err, tags) {
		if (!err) Vacay.tags = tags;
	    });

	    document.body.classList.add('vacay-crx-no-scroll');
	    
	    var container = Elem.create({ id: 'vacay-crx-container' });
	    var close = Elem.create({ id: 'vacay-crx-close' });	    
	    var content = Elem.create({ id: 'vacay-crx-content' });
	    var list = Elem.create({
		className: 'list' ,
		attributes: {
		    empty: 'There are no drafts you can add this vitamin to.'
		}
	    });

	    container.appendChild(close);
	    container.appendChild(content);
	    content.appendChild(Vitamin.render(vitamin));

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

		console.log(prescriptions);
	    });

	    document.body.appendChild(container);
	},	
	handleClick: function(e) {
	    var self = this;
	    e.preventDefault();
	    e.stopImmediatePropagation();
	    e.stopPropagation();	    
	    e.cancelBubble = true;

	    var link = e.target.href || Elem.getClosest(e.target, '[href]');
	    console.log(link);

	    var url = canonicalize(link.href);
	    Vitamin.create(url, function(err, vitamin) {
		if (err) {
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
	    
	    var cover = Elem.create({ tag: 'span', className: 'vacay-crx-link-cover' });
	    cover.addEventListener('click', this._listener);
	    link.appendChild(cover);
	},
	insertImportButton: function() {
	    if (document.getElementById('vacay-crx-button')) return;
	    var self = this;	    
	    self.button = Elem.create({ id: 'vacay-crx-button', text: 'Import to Vacay' });
	    self.button.onclick = function() {
		self.evaluate();
	    };
	    document.body.appendChild(self.button);
	},	
	evaluate: function() {
	    this._listener = this.handleClick.bind(this);
	    this.button.innerHTML = 'scanning...';	    
	    
	    var self = this;
	    var links = document.links;
	    var foundNone = true;

	    var hostname = window.location.hostname;
	    if (hostname.indexOf('bandcamp.com') !== -1) hostname = 'bandcamp.com';
	    var host = Vacay.hosts[hostname];

	    Elem.each(links, function(link) {
		var url = canonicalize(link.href);
		
		if (!host) {
		    for (var h in Vacay.hosts) {
			if (Vacay.hosts.hasOwnProperty(h) && Vacay.hosts[h].url.test(url)) {
			    self.enableLink(link);
			    foundNone = false;
			}
		    }
		} else if (host.url.test(url)) {
		    self.enableLink(link);
		    foundNone = false;		    
		}
	    });

	    if (foundNone) {
		this.button.innerHTML = 'nothing found';		
	    } else {
		this.button.onclick = this.cleanup.bind(this);
		this.button.innerHTML = 'cancel import';
		console.log(this.button.innerHTML);
	    }		
	}
    };
});
