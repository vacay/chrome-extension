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
		className: 'vacay-title',
		text: data.displayTitle
	    });
	    elem.appendChild(title);

	    var editTitle = Elem.create({
		tag: 'button',
		className: 'vacay-edit-hide',
		text: 'Edit Title',
		parent: elem
	    });

	    editTitle.onclick = function() {
		elem.classList.toggle('vacay-editable', true);
		title.contentEditable = 'true';
		title.dataset.prev = Elem.text(title);
		title.focus();
	    };

	    var saveTitle = Elem.create({
		tag: 'button',
		className: 'vacay-edit-show',
		text: 'Save Title',
		parent: elem
	    });

	    saveTitle.onclick = function() {
		elem.classList.toggle('vacay-editable', false);
		title.contentEditable = 'false';
		var cb = function(err) {
		    if (err) Log.error(err);
		};

		Vitamin.update(data.id, Elem.text(title), cb);
	    };

	    var cancelTitle = Elem.create({
		tag: 'button',
		className: 'vacay-edit-show',
		text: 'Cancel',
		parent: elem
	    });

	    cancelTitle.onclick = function() {
		elem.classList.toggle('vacay-editable', false);
		title.contentEditable = 'false';
		title.innerHTML = title.dataset.prev;
	    };

	    var crate = Elem.create({
		tag: 'button',
		className: 'vacay-success',
		text: 'Crate',
		parent: elem
	    });

	    crate.onclick = function() {
		var isActive = crate.classList.contains('active');
		var cb = function(err) {
		    if (err) crate.classList.toggle('active', isActive);
		};

		if (isActive) self.uncrate(data.id, cb);
		else self.crate(data.id, cb);

		crate.classList.toggle('active');
	    };
	    data.crated = Utils.exists(data.craters, Vacay.username, 'username');
	    if (data.crated) crate.classList.add('active');

	    elem.appendChild(Tags.render());

	    var parent = elem.querySelector('.vacay-crx-tags .current');
	    if (data.tags.length) {
		data.tags.forEach(function(t) {
		    parent.appendChild(Tags.tag(t.value, { create: true }));
		});
	    }

	    var h = Elem.create({
		className: 'vacay-h vacay-_d vacay-edit-show',
		parent: elem,
		childs: [{
		    tag: 'span',
		    text: 'Title Suggestions'
		}]
	    });
	    var list = Elem.create({
		className: 'list vacay-edit-show',
		parent: elem
	    });

	    data.hosts.forEach(function(h) {
		Elem.create({
		    className: 'i',
		    text: h.vitamin_title,
		    parent: list
		});
	    });

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

	update: function(id, title) {
	    if (!title) return;

	    Vacay.api('/vitamin/' + id).put({
		title: title
	    }).success(function() {
		//TODO
	    }).error(function(err) {
		Log.error(err, title);
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
