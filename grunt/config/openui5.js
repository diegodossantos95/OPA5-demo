'use strict';

module.exports = function (grunt, mConfig) {
    grunt.config.set('openui5_preload', {
        component: {
            options: {
                resources: {
                    cwd: 'webapp',
                    prefix: mConfig.namespace.split(".").join("/"),
                    src: [
                            '**/*.json',
                            '**/*.js',
                            '**/*.fragment.html',
                            '**/*.fragment.json',
                            '**/*.fragment.xml',
                            '**/*.view.html',
                            '**/*.view.xml',
                            '**/*.properties',
                            '!neo-app.json',
                            '!**/*-preload.*',
                            '!test/**/*.*'
                        ]
                },
                compress: true,
                dest: 'dist'
            },
            libraries: false,
            components: true
        }
    });

    grunt.loadNpmTasks('grunt-openui5');
};