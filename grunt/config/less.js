'use strict';

module.exports = function (grunt, config) {
    grunt.config.set('less', {
        main: {
            options: {
                compress: true
            },
            files: config.less_files || {}
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
};