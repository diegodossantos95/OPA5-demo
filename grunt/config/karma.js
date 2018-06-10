'use strict';

module.exports = function (grunt, config) {
    grunt.config.set('karma', {
        ci: {
            configFile: 'karma.ci.conf.js'
        }
    });

    grunt.loadNpmTasks('grunt-karma');
};