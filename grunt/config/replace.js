'use strict';

module.exports = function (grunt, config) {
    grunt.config.set('replace', {
        dist: {
            options: {
                preserveOrder: true,
                patterns: [{
                    match: /com.sap.CloudSCAME.SAPUI5Seed/g,
                    replacement: function(value) {
                        if (value.indexOf("/") >= 0) {
                            return config.namespace.split(".").join("/");
                        }
                        return config.namespace; 
                    }
                },{
                    match: /SAPUI5Seed/g,
                    replacement: config.name
                }]
            },
            files: [{
                expand: true, 
                src: ['webapp/*.*', 'webapp/**/*.*', 'pom.xml', 'karma.ci.conf.js', 'bower.json']
            }]
        }
    });

    grunt.loadNpmTasks('grunt-replace');
};