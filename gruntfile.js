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
		files: {
		    'tmp/app.css': 'src/css/*.styl'
		}
	    }
	},
	cssmin: {
	    compress: {
		files: {
		    'tmp/app.css': 'tmp/app.css'
		}
	    }
	},
	
	/************************ JAVASCRIPT ************************/
	concat: {
	    vendor: {
		files: {
		    'tmp/vendor.js': [
			//libraries
			'components/angular/angular.min.js',

			//ngModules
			'components/angular-route/angular-route.min.js',
			'components/angular-animate/angular-animate.min.js',
			'components/angular-once/once.js'
		    ]
		}
	    },
	    js: {
		files: {
		    'tmp/app.js' : ['src/ngApp.js', 'src/js/**/*.js', 'src/main.js']
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
		    'tmp/app.js': ['tmp/app.js']
		}
	    }
	},

	/************************ HTML ************************/
	jade: {
	    index: {
		files: [{
		    'tmp/index.html': ['src/views/index.jade']
		}]
	    },
	    partials: {
		files: [{
		    expand: true,
		    src: ['partials/**/*.jade', 'layouts/*.jade'],
		    dest: 'tmp/',
		    cwd: 'src/views/',
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
			src: ['tmp/app.js', 'tmp/vendor.js', 'src/analytics.js'],
			dest: 'dist/'
		    }
		]
	    },
	    css: {
		files: [
		    {
			expand: true,
			flatten: true,
			src: 'tmp/app.css',
			dest: 'dist/'
		    }
		]
	    }
	},
	
	/************************ UTILITY ************************/
	replace: {
	    development: {
		options: {
		    patterns: [
			{
			    match: 'environment',
			    replacement: 'development'
			}
		    ]
		},
		files: {
		    'tmp/app.js': 'tmp/app.js'
		}
	    },
	    production: {
		options: {
		    patterns: [
			{
			    match: 'environment',
			    replacement: 'production'
			}
		    ]
		},
		files: {
		    'tmp/app.js': 'tmp/app.js'
		}
	    }
	},

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
		indent: 2,
		force: true,
		quotmark: 'single'
	    },
	    main: [
		'./gruntfile.js',
		'app/**/*.js'
	    ]
	},
	watch: {
	    index: {
		files: 'src/views/**/*.jade',
		tasks: ['clean:index', 'jade', 'inline_angular_templates', 'copy:html']
	    },
	    css: {
		files: 'src/css/*.styl',
		tasks: ['clean:css', 'stylus', 'cssmin', 'copy:css', 'copy:html']
	    },
	    js: {
		files: 'src/**/*.js',
		tasks: ['clean:js', 'concat', 'replace:development', 'copy:js', 'copy:html']
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
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('lint', ['jshint']);

    grunt.registerTask('production', [
	'clean',
	
	'stylus',
	'cssmin',
	
	'concat',
	'replace:production',
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
	
	'concat',
	'replace:development',

	'jade',
	'inline_angular_templates',

	'copy',

	'htmlmin'

    ]);

};
