module.exports = function (grunt) {
	grunt.registerTask('testProxy', [
		'less:main',
		'configureRewriteRules:test',
		'setupProxies:sapProxy',
		'connect:test',
        'watch'
	]);
};
