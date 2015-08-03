var _ = require('lodash');

module.exports = function(grunt) {

    var paths = {
        header : 'src/greasemonkey_header.js',
        globals : [
            'src/include/gm_wrappers.js',
            'src/include/js_utils.js'
        ],
        dest : 'bin/tofu.user.js'
    };

    function prependFile() {
        var header = grunt.file.read(paths.header);
        var globals = _.map(paths.globals, grunt.file.read);
        var bin = grunt.file.read(paths.dest);

        grunt.file.write(paths.dest, header + globals.join(' ') + bin);
    }

    function updateFF() {
        grunt.file.copy(paths.dest,
                '/Users/donatoborrello/Library/Application Support/Firefox/Profiles/l7q3zswe.default/gm_scripts/ToFu_Script' + '/tofu.user.js');
    }

    // Webpack plugins are objects with an apply method
    var afterWebpackBuild = {
        apply: function (compiler) {
            compiler.plugin('done', function () {
                prependFile();
                grunt.file.copy('bin/tofu.user.js',
                        '/Users/donatoborrello/Library/Application Support/Firefox/Profiles/l7q3zswe.default/gm_scripts/ToFu_Script' + '/tofu.user.js');
            })
        }
    };

	grunt.initConfig({
        'gm-header': {
            options : {
                dest: 'bin/tofu.user.js'
            }
        },
		jshint: {
			options: {
				jshintrc: 'src/.jshintrc'
			},
			beforeconcat : ['Gruntfile.js', 'src/includes/*.js', 'src/includes/**/*.js']
			//afterconcat : ['tofu.user.js']
		},
		less: {
			options: {
				report:'min'
				// paths: ['server/css']
			},
			development: {
				files: {
					'server/css/default.css' : 'server/css/default.less'
				}
			}
		},
        webpack: {
            options : {
                resolve : {
                    alias : {
                        underscore : 'lodash'
                        //underscore : 'underscore/underscore.js',
                        //jquery : 'jquery/jquery.js'
                    },
                    moduleDirectories: [
                        'src/',
                    ]
                }
            },
            devel : {
                entry : {
                    tofu : './src/main.js'
                },
                debug: true,
                output: {
                    path: 'bin/',
                    filename: '[name].user.js'
                }
            },
            watch : {
                entry : {
                    tofu : './src/main.js'
                },
                debug: true,
                output: {
                    path: 'bin/',
                    filename: '[name].user.js'
                },
                plugins : [ afterWebpackBuild ],
                watch: true,
                failOnError: false,
                keepalive: true
            }
        }
	});


	grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('gm-header', prependFile);
    grunt.registerTask('update-firefox', updateFF);
    grunt.registerTask('ff', 'update-firefox');

	grunt.registerTask('default', ['webpack', 'gm-header', 'update-firefox']);

};
