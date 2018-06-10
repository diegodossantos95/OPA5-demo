module.exports = function (grunt) {
	grunt.registerTask('build', [
		'less:main',
        'copy',
        'openui5_preload'
	]);
};
