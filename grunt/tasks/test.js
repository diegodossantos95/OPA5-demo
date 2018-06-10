const getProxySetupTask = require('../config/proxySetup');

module.exports = function (grunt) {
	grunt.registerTask('test', [
		'less:main',
		'configureRewriteRules:test',
		getProxySetupTask(),
		'connect:test',
        'watch'
	]);
};
