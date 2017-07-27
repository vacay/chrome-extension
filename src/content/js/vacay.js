/* global chrome, window, document, DOMTokenList, setTimeout */

(function(root, factory) {

    root.Vacay = factory(root);

})(this, function() {

    'use strict';

    return {

        hosts: {

            'soundcloud.com': {
                url:/^(?:https?:\/\/)?(?:(?:(?:www\.|m\.)?soundcloud\.com\/(?!pages|tags|charts|popular|for|search|you)([\w\d-]+)\/(?!sets|reposts|recommended|groups|tracks|following|followers|comments|favorites|likes)([\w\d-]+)\/?(?!recommended|sets|likes|reposts|comments)([\w\d-]+)(?:$|[?#])([^?]+?)?(?:[?].*)?$))/i,
		embed: /^(?:https?:\/\/)?(?:player\.|w\.)?soundcloud\.com\/(?:(?:player)|(?:player.swf))\/?\?(.+)?(?:url=)(.+)?$/i,
                options: {
                    container: '.listenEngagement__footer .listenEngagement__actions .sc-button-group',
                    classes: ['sc-button', 'sc-button-medium', 'sc-button-responsive']
                }
            },

            'www.youtube.com': {
                url: /^((?:https?:\/\/|\/\/)(?:(?:(?:(?:\w+\.)?[yY][oO][uU][tT][uU][bB][eE](?:-nocookie)?\.com\/)(?:.*?\#\/)?(?:(?:(?:v|embed|e)\/(?!videoseries))|(?:(?:(?:watch|movie)(?:_popup)?(?:\.php)?\/?)?(?:\?|\#!?)(?:.*?&)?v=)))))?([0-9A-Za-z_-]{11})(?!.*?&list=)(.+)?$/i,
		embed: /^((?:https?:\/\/|\/\/)(?:(?:(?:(?:\w+\.)?[yY][oO][uU][tT][uU][bB][eE](?:-nocookie)?\.com\/)(?:.*?\#\/)?(?:(?:(?:v|embed|e)\/(?!videoseries))|(?:(?:(?:watch|movie)(?:_popup)?(?:\.php)?\/?)?(?:\?|\#!?)(?:.*?&)?v=)))))?([0-9A-Za-z_-]{11})(?!.*?&list=)(.+)?$/i,
                options: {
                    container: '.watch-action-buttons .watch-secondary-actions',
                    classes: ['yt-uix-button', 'yt-uix-button-size-default', 'yt-uix-button-opacity']
                }
            },

            'www.mixcloud.com': {
                url: /^(?:https?:\/\/)?(?:www\.)?mixcloud\.com\/(?!discover|favorites|listens|followers|following|uploads|playlists)([^/]+)\/(?!competitions|categories|tag|groups|previews|widget)([^/]+)\/?$/i,
		embed: /^(?:https?:\/\/)?(?:www\.)?mixcloud\.com\/widget\/iframe\/?\?(.+)?(?:feed=)(.+)?$/i,
                options: {
                    container: '.cloudcast-actions',
                    classes: ['button']
                }
            },
            
            'hypem.com': {
                url: /^https?:\/\/(?:www\.)?hypem\.com\/track\/([^/]+)(.+)?/i,
                options: {
                    container: '.track-info',
                    classes: [],
                    style: {
                        position: 'absolute',
                        right: '0'
                    }
                }
            },
            
            'bandcamp.com': {
                url: /^https?:\/\/.*?\.bandcamp\.com\/track\/(.*)/i,
                options: {
                    container: '.inline_player',
                    classes: ['compound-button', 'follow-unfollow'],
                    style: {
                        'margin-top': '20px'
                    }
                }
            }
        },

        token: null,
        username: null,
	tags: [],
	api: function(path) {
	    var token = this.token;
	    path = 'https://api.vacay.io:8080/v1' + path;
	    return {
		get: function(params) {
		    params = params || {};
		    if (token) params.token = token;
		    return Request.get(path, params);
		},
		put: function(params) {
		    if (token) path += '?token=' + token;
		    return Request.put(path, params);
		},
		post: function(params) {
		    if (token) path += '?token=' + token;
		    return Request.post(path, params);
		},
		del: function(params) {
		    params = params || {};
		    if (token) params.token = token;
		    return Request.del(path, params);
		}
	    };
	}
    };

});
