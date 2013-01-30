module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    distName: '<%= pkg.name %>-<%= pkg.version %>',

    jshint: {
      src: [
        'Gruntfile.js',
        'lib/**/*.js',
        '!lib/intro.js',
        '!lib/outro.js',
        'test/**/*.js',
        '!test/vendor/**'
      ],
      concatenated: 'dist/<%= distName %>.js',
      options: {
        browser: true
      }
    },

    concat: {
      dist: {
        src: [
          'lib/intro.js',
          'lib/event_manager.js',
          'lib/m2e.js',
          'lib/outro.js'
        ],
        dest: 'dist/<%= distName %>.js'
      }
    },

    uglify: {
      min: {
        files: {
          'dist/<%= distName %>.min.js': ['dist/<%= distName %>.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('prelint', 'jshint:src');
  grunt.registerTask('cat', 'concat:dist');
  grunt.registerTask('postlint', 'jshint:concatenated');
  grunt.registerTask('min', 'uglify:min');
  grunt.registerTask('default', ['prelint', 'cat', 'postlint', 'min']);

};