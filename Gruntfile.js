module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    //Use the following line to import a .yml config file which will name all of
    //our directories we might want to reference in the Gruntfile.js. Helps with
    //maintenance.
    //    var config = grunt.file.readYAML('Gruntconfig.yml');



    grunt.initConfig({
        //Lint JavaScript
        jshint: {
            all: [
            'Gruntfile.js',
            'src/**/*.js',
            '!src/lib/knockout-3.4.2.js'
            ]
        },
        //Minify JavaScript
        uglify: {
            dist: {
                files: [{
                    'dist/js/app.js': 'src/js/app.js',
                    'dist/lib/knockout-3.4.2.js': 'src/lib/knockout-3.4.2.js'
                }]
            }
        },
        //Minify HTML
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'src/index.html'
                }
            }
        }
    });

    grunt.registerTask('default',
        ['jshint',
        'uglify',
        'htmlmin'
        ]);
};