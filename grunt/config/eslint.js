'use strict';

module.exports = function(grunt) {
	grunt.config.set('eslint',{
        options: {
            fix: true
        },
        target: ['webapp/**/*.js', 'webapp/*.js']
	});
    
	grunt.loadNpmTasks('grunt-eslint');
};