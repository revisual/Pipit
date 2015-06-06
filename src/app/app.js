'use strict';

var module = angular.module( 'app',
   [
      'app.services', 'app.directives',
      'app.controllers', 'ngRoute',
      'ngTouch', 'ui.bootstrap',
      'angular-progress-arc',
      'FBAngular',
      'angular-animation-frame',
      'angular-slider',
      'angular-scroll-indicator'
     /* ,'ngGeolocation'*/
   ] );

module.config( ['$routeProvider', '$locationProvider',
   function ( $routeProvider, $locationProvider ) {

      $routeProvider.when( "/",
         {
            templateUrl: "partials/main-menu.html",
            controller: "MenuCtrl"
         } )
         .when( "/book",
         {
            templateUrl: "partials/book.html",
            controller: "BookCtrl"
         } )
         .otherwise( {redirectTo: '/'} );

      $locationProvider.html5Mode( {
         enabled: true,
         requireBase: false
      } );

   }] );

