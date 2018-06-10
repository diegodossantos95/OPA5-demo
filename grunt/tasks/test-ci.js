module.exports = function (grunt) {
	grunt.registerTask('test-ci', [
		'bower:install',
		'karma:ci'
	]);
};
