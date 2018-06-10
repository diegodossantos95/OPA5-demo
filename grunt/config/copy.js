'use strict';

module.exports = function (grunt) {

    grunt.config.set('copy', {
        main: {
            files: [{
                    expand: true,
                    cwd: 'webapp',
                    src: ['**/*.css', 'index.html', 'neo-app.json'],
                    dest: 'dist/'
                }]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
};