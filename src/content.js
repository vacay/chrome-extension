/* global chrome, axios, window, document, DOMTokenList, setTimeout */

(function() {
    
    console.log('content script loaded');

    var Vacay = {

        pages: {

            soundcloud: {
                url:/^(?:https?:\/\/)?(?:(?:(?:www\.|m\.)?soundcloud\.com\/([\w\d-]+)\/(?!sets|reposts|recommended|groups|tracks|following|followers|comments|favorites|likes\/?(?:$|[?#]))([\w\d-]+)\/?([^?]+?)?(?:[?].*)?$))/i,
                options: {
                    container: '.listenEngagement__footer .listenEngagement__actions .sc-button-group',
                    classes: ['sc-button', 'sc-button-medium', 'sc-button-responsive']
                }
            },

            youtube: {
                url: /^((?:https?:\/\/|\/\/)(?:(?:(?:(?:\w+\.)?[yY][oO][uU][tT][uU][bB][eE](?:-nocookie)?\.com\/)(?:.*?\#\/)?(?:(?:(?:v|embed|e)\/(?!videoseries))|(?:(?:(?:watch|movie)(?:_popup)?(?:\.php)?\/?)?(?:\?|\#!?)(?:.*?&)?v=)))))?([0-9A-Za-z_-]{11})(?!.*?&list=)(.+)?$/i,
                options: {
                    container: '.watch-action-buttons .watch-secondary-actions',
                    classes: ['yt-uix-button', 'yt-uix-button-size-default', 'yt-uix-button-opacity']
                }
            },

            mixcloud: {
                url: /^(?:https?:\/\/)?(?:www\.)?mixcloud\.com\/(?!favorites|listens|followers|following|uploads|playlists)([^/]+)\/(?!competitions|categories|tag|groups|previews|widget)([^/]+)\/?$/i,
                options: {
                    container: '.cloudcast-actions',
                    classes: ['button']
                }
            },
            
            hypem: {
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
            
            bandcamp: {
                url: /^https?:\/\/.*?\.bandcamp\.com\/track\/(.*)/i,
                options: {
                    container: '.inline_player',
                    classes: ['compound-button', 'follow-unfollow'],
                    style: {
                        'margin-top': '20px'
                    }
                }
            },
            
            bop: {
                url: /^https?:\/\/(?:www\.)?bop\.fm\/s\/([^/]+)\/(.*)/i,
                options: {
                    container: '.hero-action-buttons',
                    classes: ['btn']
                }
            }
        },

        token: null,
        username: null,
        vitamin: null,

        container: null,
        button: document.createElement('button'),

        init: function() {
            var self = this;
            chrome.storage.local.get(['token', 'username'], function(keys) {
                if (keys.token && keys.username) {
                    self.token = keys.token;
                    self.username = keys.username;
                    self.button.id = 'vacayButton';

                    setTimeout(function() {
                        self.evaluate();
                    }, 1000);
                }
            });
        },

        loadVitamin: function(url) {
            var self = this;
            axios({
                url: 'https://api.vacay.io/v1/vitamin',
                method: 'post',
                params: {
                    url: url,
                    token: self.token
                }
            }).then(function (response) {
                console.log(response);

                self.vitamin = response.data.data;
                self.button.innerHTML = self.isCrated() ? 'saved' : 'save to vacay.io';
                self.button.addEventListener('click', self.toggleCrate.bind(self));
            }).catch(function (response) {
                if (response instanceof Error) {
                    console.log('Error', response.message);
                } else {
                    console.log(response.data);
                    console.log(response.status);
                    console.log(response.headers);
                    console.log(response.config);
                }
                self.button.innerHTML = 'loading error';
            });
        },

        addToCrate: function() {
            var self = this;
            axios({
                url: 'https://api.vacay.io/v1/vitamin/' + self.vitamin.id + '/crate',
                method: 'post',
                params: {
                    token: self.token
                }
            }).then(function(response) {
                console.log(response);
                self.button.innerHTML = 'saved';
                self.vitamin.craters.push({
                    username: self.username
                });
            }).catch(function(response) {
                if (response instanceof Error) {
                    console.log('Error', response.message);
                } else {
                    console.log(response.data);
                    console.log(response.status);
                    console.log(response.headers);
                    console.log(response.config);
                }
            });
        },

        removeFromCrate: function() {
            var self = this;
            axios({
                url: 'https://api.vacay.io/v1/vitamin/' + self.vitamin.id + '/crate',
                method: 'delete',
                params: {
                    token: self.token
                }
            }).then(function(response) {
                console.log(response);
                self.button.innerHTML = 'save to vacay.io';
                for (var i=0; i<self.vitamin.craters.length; i++) {
                    if (self.vitamin.craters[i].username === self.username) {
                        self.vitamin.craters.splice(i,1);
                        break;
                    }
                }
            }).catch(function(response) {
                if (response instanceof Error) {
                    console.log('Error', response.message);
                } else {
                    console.log(response.data);
                    console.log(response.status);
                    console.log(response.headers);
                    console.log(response.config);
                }
            });
        },

        isCrated: function() {
            var isCrated = false;
            for (var i=0; i<this.vitamin.craters.length; i++) {
                if (this.vitamin.craters[i].username === this.username) {
                    isCrated = true;
                    break;
                }
            }
            return isCrated;
        },

        toggleCrate: function() {
            this.button.innerHTML = 'loading...';
            this.isCrated() ? this.removeFromCrate() : this.addToCrate();
        },

        insertButton: function(options) {
            this.button.innerHTML = 'loading...';
            this.container = document.querySelector(options.container);
            DOMTokenList.prototype.add.apply(this.button.classList, options.classes);
            for(var style in options.style) {
                if (options.style.hasOwnProperty(style)) this.button.style[style] = options.style[style];
            }
            this.container.appendChild(this.button);
            this.loadVitamin(window.location.href);
        },

        evaluate: function() {
            for (var page in this.pages) {
                if (this.pages.hasOwnProperty(page) && this.pages[page].url.test(window.location.href)) {
                    this.insertButton(this.pages[page].options);
                    return;
                }
            }
            console.log('single page does not match');
        }
    };

    Vacay.init();

})();
