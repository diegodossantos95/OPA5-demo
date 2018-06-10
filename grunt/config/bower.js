'use strict';

module.exports = function (grunt, config) {
    grunt.config.set('bower', {
        install: {
            options: {
                copy: false,
                verbose: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-task');
};