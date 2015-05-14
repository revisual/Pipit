module.exports = function ( grunt ) {
   grunt.initConfig(
      {
         clean: {
            all: ['public/json', 'public/css', 'public/fonts', 'public/partials', 'public/js']
         },

         copy: {
            data: {
               expand: true,
               flatten: true,
               cwd: 'src/json/',
               src: '*',
               dest: 'public/json/',
               filter: 'isFile'
            },

            fonts: {
               expand: true,
               flatten: true,
               cwd: 'src/fonts/',
               src: '*',
               dest: 'public/fonts/',
               filter: 'isFile'
            }
         },
         cssmin: {
            periplum: {
               src: 'src/css/pipit-*.css',
               dest: 'public/css/pipit.min.css'
            }
         },
         uglify: {

            support: {
               src: [
                  'src/app/signals.js',
                  'src/app/image-loader.js'
               ],
               dest: 'public/js/support.min.js'
            },
            pipit: {
               src: [
                  'src/app/angular-progress-arc.js',
                  'src/app/services.js',
                  'src/app/angular-animation-frame.js',
                  'src/app/angular-fullscreen.js',
                  'src/app/controllers.js',
                  'src/app/ui-slider.js',
                  'src/app/directives.js',
                  'src/app/app.js'
               ],
               dest: 'public/js/app.min.js'
            }

         },

         htmlclean: {
            deploy: {
               expand: true,
               flatten: true,
               cwd: 'src/partials/',
               src: '**/*',
               dest: 'public/partials/'
            }

         },
         mochaTest: {
            test: {
               options: {
                  reporter: 'spec',
                  /*captureFile: 'results.txt', // Optionally capture the reporter output to a file*/
                  quiet: false, // Optionally suppress output to standard out (defaults to false)
                  clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
                  ui: 'bdd'
               },
               src: [
                  'test/server/*.js'
               ]
            }
         },
         karma: {
            /* unit: {
             configFile: 'karma.conf.js'
             }   ,*/
            continuous: {
               configFile: 'karma.conf.js',
               singleRun: true,
               autoWatch: false
            }
         },
         bump: {

               options: {
                  files: ['package.json'],
                  push: true,
                  pushTo: 'origin'
               }

         }

      } );

   grunt.loadNpmTasks( 'grunt-contrib-clean' );
   grunt.loadNpmTasks( 'grunt-contrib-copy' );
   grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
   grunt.loadNpmTasks( 'grunt-contrib-uglify' );
   grunt.loadNpmTasks( 'grunt-htmlclean' );
   grunt.loadNpmTasks( 'grunt-mocha-test' );
   grunt.loadNpmTasks( 'grunt-karma' );
   grunt.loadNpmTasks( 'grunt-bump' );


   grunt.registerTask( 'default', ['clean:all', 'copy', 'htmlclean:deploy', 'cssmin', 'uglify'] );
   grunt.registerTask( 'build', ['mochaTest', 'karma', 'clean:all', 'copy', 'htmlclean:deploy', 'cssmin', 'uglify'] );
   grunt.registerTask( 'tests', ['mochaTest', 'karma'] );
   grunt.registerTask( 'pushDev', ['bump'] );
};
