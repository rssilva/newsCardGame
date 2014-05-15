module.exports = function( grunt ) {
 
    grunt.initConfig({

      // js minifcation options
      uglify : {
          task : {
            options : {
              report : 'gzip',
              compress : true,
              mangle : false
            },
              files : {
                  'dist/js/bundle.js' : [
                    'js/jquery-1.11.0.min.js',
                    'StartModal.js',
                    'RoundModal.js',
                    'Player.js',
                    'Computer.js',
                    'GameModeModule.js',
                    'GameMaster.js'
                  ]
              }
          }
      },

      // css minifcation options
      cssmin: {
          task : {
            options : {
              report : 'gzip'
            },
            files : { 
              'dist/css/style.css': [ 'css/style.css' ] 
            }
        }
      },

      // watch options
      watch : {
        js : {
          files : [ 'js/*.js' ],
          tasks : [ 'uglify' ]
        },
        css: {
          files : [ 'css/*.css' ],
          tasks : [ 'cssmin' ]
        }
      },

    });

    // load our plugins
    //grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );

    // set custom tasks
    grunt.registerTask( 'default', ['watch'] );
    //grunt.registerTask( 'build', [ 'uglify' ,'jshint', 'sass', 'concat', 'cssmin' ] );
    //grunt.registerTask( 'test', [ 'uglify' ,'jshint' ] );
}