const getProxySetupTask = require('../config/proxySetup');

module.exports = function (grunt) {
	grunt.registerTask('serve', [
		'less:main',
		'configureRewriteRules:dev',
		getProxySetupTask(),
		'connect:dev',
        'watch'
	]);
};
