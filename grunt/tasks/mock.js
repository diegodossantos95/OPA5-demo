const getProxySetupTask = require('../config/proxySetup');

module.exports = function (grunt) {
	grunt.registerTask('mock', [
		'less:main',
		'configureRewriteRules:mock',
		getProxySetupTask(),
		'connect:mock',
        'watch'
	]);
};
