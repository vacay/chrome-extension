/* global module */

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            options: {
                force: true
            },
            tmp: {
                src: ['tmp/**/*']
            },
            index: {
                src: ['dist/index.html']
            },
            css: {
                src: ['tmp/*.css', 'dist/*.css']
            },
            js: {
                src: ['tmp/*.js', 'dist/*.js']
            }
        },

        /************************ STYLE ************************/
        stylus: {
            options: {
                compress: true,
                'include css': true
            },
            compile: {
                files: [{
                    'tmp/popup.css': 'src/popup/css/*.styl'
                }, {
		    'tmp/content.css': 'src/content/css/*.styl'
		}]
            }
        },
        cssmin: {
            compress: {
                files: [{
                    'tmp/popup.css': 'tmp/popup.css'
                }, {
		    'tmp/content.css': 'tmp/content.css'
		}]
            }
        },

        /************************ JAVASCRIPT ************************/
        concat: {
            vendor: {
                files: {
                    'tmp/vendor.js': [
                        //libraries
                        'components/angular/angular.min.js',
                        'components/crypto-js/rollups/md5.js',
                        'components/stacktrace-js/stacktrace.js',

                        //ngModules
                        'components/angular-route/angular-route.min.js',
                        'components/angular-animate/angular-animate.min.js'
                    ]
                }
            },
            js: {
                files: {
                    'tmp/popup.js' : ['src/popup/ngApp.js', 'src/popup/js/**/*.js', 'src/popup/main.js']
                }
            },
	    content: {
		files: {
		    'tmp/content.js': ['src/content/js/**/*.js', 'src/content/index.js']
		}
	    },
            development: {
                files: {
                    'tmp/popup.js': ['config/development.js', 'tmp/popup.js']
                }
            },
            production: {
                files: {
                    'tmp/popup.js': ['config/production.js', 'tmp/popup.js']
                }
            }

        },
        uglify: {
            options: {
                beautify: {
                    ascii_only: true,
                    inline_script: true
                }
            },
            vendor: {
                files: {
                    'tmp/vendor.js': ['tmp/vendor.js']
                }
            },
            js: {
                files: {
                    'tmp/popup.js': ['tmp/popup.js']
                }
            },
	    content: {
		files: {
		    'tmp/content.js': ['tmp/content.js']
		}
	    }
        },

        /************************ HTML ************************/
        jade: {
            index: {
                files: [{
                    'tmp/index.html': ['src/popup/views/index.jade']
                }]
            },
            partials: {
                files: [{
                    expand: true,
                    src: ['partials/**/*.jade', 'layouts/*.jade'],
                    dest: 'tmp/',
                    cwd: 'src/popup/views/',
                    ext: '.html'
                }]
            }
        },
        inline_angular_templates: {
            index: {
                options: {
                    base: 'tmp',
                    prefix: '/',
                    selector: 'body',
                    method: 'prepend'
                },
                files: {
                    'tmp/index.html': ['tmp/partials/**/*.html', 'tmp/layouts/*.html']
                }
            }
        },
        htmlmin: {
            index: {
                options: {
                    collapseWhitespace: true,
                    removeComments: true
                },
                files: {
                    'dist/index.html': 'dist/index.html'
                }
            }
        },
        /********************* ASSETS *********************/
        copy: {
            manifest: {
                files: [
                    {
                        src: 'manifest.json',
                        dest: 'dist/'
                    }
                ]
            },
            images: {
                files: [
                    {
                        expand: true,
                        src: ['assets/**/*'],
                        dest: 'dist/'
                    }
                ]
            },
            html: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: 'tmp/index.html',
                        dest: 'dist/'
                    }
                ]
            },
            js: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['tmp/popup.js', 'tmp/vendor.js', 'src/analytics.js', 'tmp/content.js', 'src/background.js'],
                        dest: 'dist/'
                    }
                ]
            },
            css: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'tmp/popup.css',
                    dest: 'dist/'
                }, {
		    expand: true,
		    flatten: true,
		    src: 'tmp/content.css',
		    dest: 'dist/'
		}]
            }
        },

        /************************ UTILITY ************************/
        jshint: {
            options: {
                curly: false,
                undef: true,
                unused: true,
                bitwise: true,
                freeze: true,
                immed: true,
                latedef: true,
                newcap: true,
                noempty: true,
                nonew: true,
                trailing: true,
                forin: true,
                eqeqeq: true,
                eqnull: true,
                force: true,
                quotmark: 'single'
            },
            main: [
                './gruntfile.js',
                'src/**/*.js',
                '!src/analytics.js'
            ]
        },
        watch: {
            index: {
                files: 'src/popup/views/**/*.jade',
                tasks: ['clean:index', 'jade', 'inline_angular_templates', 'copy:html']
            },
            css: {
                files: ['src/popup/css/*.styl', 'src/content/css/*.styl'],
                tasks: ['clean:css', 'stylus', 'cssmin', 'copy:css', 'copy:html']
            },
            js: {
                files: 'src/**/*.js',
                tasks: ['clean:js', 'concat:vendor', 'concat:js', 'concat:content', 'concat:production', 'copy:js', 'copy:html']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-inline-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('lint', ['jshint']);

    grunt.registerTask('production', [
        'clean',

        'stylus',
        'cssmin',

        'concat:vendor',
        'concat:js',
	'concat:content',
        'concat:production',
        'uglify',

        'jade',
        'inline_angular_templates',

        'copy',

        'htmlmin'

    ]);

    grunt.registerTask('default', [
        'clean',

        'stylus',
        'cssmin',

        'concat:vendor',
        'concat:js',
	'concat:content',
        'concat:development',

        'jade',
        'inline_angular_templates',

        'copy',

        'htmlmin'

    ]);

};
