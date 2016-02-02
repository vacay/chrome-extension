(function(root, factory) {

    root.Vitamin = factory(root);

})(this, function() {

    'use strict';

    return {
	render: function(data, opts) {
	    var elem = Elem.create({className: 'vacay-crx-vitamin' });
	    elem.dataset.id = data.id;
	    var self = this;

	    if (data.verified_at) {
		data.displayTitle = data.title;
	    } else {
		for (var i=0; i<data.hosts.length; i++) {
		    if (data.hosts[i].vitamin_title) {
			data.displayTitle = data.hosts[i].vitamin_title;
			break;
		    }
		}

		if (!data.displayTitle) data.displayTitle = data.title;
	    }	    

	    var title = Elem.create({
		tag: 'h2',
		text: data.displayTitle
	    });
	    elem.appendChild(title);

	    var crate = Elem.create({
		tag: 'button',
		text: 'Crate'
	    });

	    data.crated = Utils.exists(data.craters, Vacay.username, 'username');
		
	    crate.onclick = function() {
		var isActive = crate.classList.contains('active');
		var cb = function(err) {
		    if (err) crate.classList.toggle('active', isActive);
		};

		if (isActive) {
		    self.uncrate(data.id, cb);
		    elem.removeChild(elem.querySelector('.vacay-crx-tags'));
		} else {
		    self.crate(data.id, cb);
		    elem.appendChild(Tags.render());
		}
		crate.classList.toggle('active');
	    };
	    elem.appendChild(crate);

	    if (data.crated) {
		crate.classList.add('active');
		elem.appendChild(Tags.render());

		var parent = elem.querySelector('.vacay-crx-tags .current');
		if (data.tags.length) {
		    data.tags.forEach(function(t) {
			parent.appendChild(Tags.tag(t.value, { create: true }));
		    });
		}		

	    }	    

	    return elem;
	},

	create: function(url, cb) {
	    Vacay.api('/vitamin').post({
		url: url
	    }).success(function(res) {
		cb(null, res.data);
	    }).error(function(res) {
		cb(res);
	    });
	},

	crate: function(id, cb) {
	    Vacay.api('/vitamin/' + id + '/crate').post().success(function(res) {
		cb(null, res);
            }).error(function(res) {
		cb(res);
            });
	},

	uncrate: function(id, cb) {
	    Vacay.api('/vitamin/' + id + '/crate').del().success(function(res) {
		cb(null, res);
            }).error(function(res) {
		cb(res);
            });
	}
    };
});
