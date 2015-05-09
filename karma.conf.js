module.exports = function ( config ) {
   config.set( {
      basePath: '',
      frameworks: ['mocha', 'chai'],
      files: [
         'node_modules/angular/angular.js',
         'node_modules/angular-mocks/angular-mocks.js',
         'node_modules/jquery/dist/jquery.js',
         'test/client/*.spec.js',

         'public/js/signals.js',
         'public/js/*.js'
      ],
      port: 9876,
      colors: true,
      autoWatch: true,
      browsers: ['Chrome'],
      singleRun: false

   } )
}