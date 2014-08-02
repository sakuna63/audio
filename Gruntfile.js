module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    coffee: {
      compile: {
        files: {
          'js/app.js' : ['coffee/*.coffee']
        }
      }
    },
    
    sass: {
      options: {
        loadPath: ['bower_components/foundation/scss']
      },
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'css/app.css': 'scss/app.scss'
        }        
      }
    },

    // connect: {
    //   server: {
    //     options: {
    //       open: {
    //         target: 'http://localhost:8000', // target url to open
    //         appName: 'audio.html', // name of the app that opens, ie: open, start, xdg-open
    //         callback: function() {} // called when the app has opened
    //       }
    //     }
    //   }
    // },
    
    watch: {
      grunt: { files: ['Gruntfile.js'] },

      sass: {
        files: 'scss/**/*.scss',
        tasks: ['sass']
      },

      coffee: {
        files: ['coffee/*.coffee'],
        tasks: ['coffee']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-coffee');
//  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['sass','coffee']);
  grunt.registerTask('default', ['build','watch']);
}
