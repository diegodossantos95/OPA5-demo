module.exports = function (grunt) {
	grunt.registerTask('serveProxy', [
		'less:main',
		'configureRewriteRules:dev',
		'setupProxies:sapProxy',
		'connect:dev',
        'watch'
	]);
};
