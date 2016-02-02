(function(root, factory) {

    root.Prescription = factory(root);

})(this, function() {

    'use strict';

    return {
	render: function(p, vitamin) {
	    var image_url;
	    if (p.image_url && p.image_url.indexOf('/tmp') === -1)
		image_url = p.image_url.replace('-original', '-900');

	    p.artwork = image_url || p.image_url;
	    p.vitaminCount = p.vitamins.length + ' Vitamin' + (p.vitamins.length > 1 ? 's': '');

	    var item = Elem.create({
		className: 'vacay-crx-prescription',
		childs: [{
		    tag: 'img',
		    attributes: {
			src: p.artwork,
			onerror: 'this.src=""'
		    }
		}]
	    });
	    var itemBody = Elem.create({
		className: 'body',
		childs: [{
		    tag: 'h2',
		    text: p.description || '(empty description)'
		}, {
		    tag: 'p',
		    childs: [{
			tag: 'small',
			text: p.vitaminCount
		    }]
		}]
	    });
	    var addBtn = Elem.create({
		tag: 'button',
		text: 'Add'
	    });

	    if (Utils.exists(p.vitamins, vitamin.id)) {
		addBtn.classList.add('active');
	    }

	    addBtn.onclick = function() {
		var isActive = addBtn.classList.contains('active');
		var cb = function(err) {
		    if (err) addBtn.classList.toggle('active', isActive);
		};

		if (isActive) {
		    Prescription.destroyVitamin(p.id, vitamin.id, cb);
		} else {
		    Prescription.addVitamin(p.id, vitamin.id, cb);
		}
		addBtn.classList.toggle('active');
	    };
	    item.appendChild(itemBody);
	    item.appendChild(addBtn);	    

	    return item;
	},
	getDrafts: function(cb) {
	    Vacay.api('/user/' + Vacay.username + '/drafts').get().success(function(res) {
		cb(null, res.data);
	    }).error(function(res) {
		cb(res);
	    });
	},
	create: function(description, vitamin_id, cb) {
	    if (!description) {
		cb('missing description');
		return;
	    }

	    Vacay.api('/prescription').post({
		description: description,
		vitamins: [{
		    vitamin_id: vitamin_id,
		    order: 0
		}]
	    }).success(function(res) {
		cb(null, res.data);
	    }).error(function(res) {
		cb(res);
	    });
	},
	addVitamin: function(prescription_id, vitamin_id, cb) {
	    Vacay.api('/prescription/' + prescription_id + '/vitamin').post({
		vitamin_id: vitamin_id
	    }).success(function(res) {
		cb(null, res);
	    }).error(function(res) {
		cb(res);
	    });
	},
	destroyVitamin: function(prescription_id, vitamin_id, cb) {
	    Vacay.api('/prescription/' + prescription_id + '/vitamin').del({
		vitamin_id: vitamin_id
	    }).success(function(res) {
		cb(null, res);
	    }).error(function(res) {
		cb(res);
	    });
	}
    };
});
