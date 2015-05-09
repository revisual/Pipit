'use strict';
var module = angular.module( "app.controllers", [] );

module.controller( 'MenuCtrl', ['$scope', '$location', 'API',
   function ( $scope, $location, API ) {

      var search = $location.search();
      $scope.partial = (search.partial === undefined) ? "partials/default.html" : "partials/" + search.partial + ".html";

      API.getProject( search )
         .then( function ( data ) {
            $scope.projects = data.projects;
         } );

   }] );

module.controller( 'FullScreenCtrl', ['$scope', 'Fullscreen', 'Settings',
   function ( $scope, Fullscreen, Settings ) {

      $scope.toggle = function () {
         if (Fullscreen.isEnabled()) {
            Fullscreen.cancel();
            Settings.fullscreen = false;

         }
         else {
            Fullscreen.all();
            Settings.fullscreen = true;

         }
         $scope.fullscreen = Settings.fullscreen;
      };

      $scope.fullscreen = Settings.fullscreen;
      $scope.toggle = function () {
         if (Fullscreen.isEnabled()) {
            Fullscreen.cancel();
            Settings.fullscreen = false;

         }
         else {
            Fullscreen.all();
            Settings.fullscreen = true;

         }
         $scope.fullscreen = Settings.fullscreen;
      };

      $scope.fullscreen = Settings.fullscreen;

   }] );

module.controller( 'ToolBarCtrl', ['$scope', 'Settings', 'WindowService',
   function ( $scope, Settings, WindowService ) {

      $scope.hasTouch = WindowService.hasTouch();
      $scope.enabled = true;

      $scope.$watch( 'imageSize', function () {
         Settings.imageSize = $scope.imageSize;
         $scope.$emit( 'imageSize', Settings.getImageSizeAsCSS() );
      } );

      $scope.$watch( 'sensitivity', function () {
         Settings.sensitivity = $scope.sensitivity;
      } );

      $scope.$watch( 'drag', function () {
         Settings.drag = $scope.drag;
      } );


      $scope.imageSize = Settings.imageSize;
      $scope.imageSizeSliderValues = Settings.imageSizeSliderValues;

      $scope.sensitivity = Settings.sensitivity;
      $scope.sensitivitySliderValues = Settings.sensitivitySliderValues;

      $scope.drag = Settings.drag;
      $scope.dragSliderValues = Settings.dragSliderValues;


   }] );

module.controller( 'BookCtrl', ['$scope', 'BookService', 'Settings', 'WindowService',
   function ( $scope, BookService, Settings, WindowService ) {

      BookService.reset();

      $scope.hasTouch = WindowService.hasTouch();


      BookService.progress.add( function ( current, total ) {
         $scope.$apply( function () {
            $scope.progress = current / total;
         } );
      } );

      BookService.resolve.addOnce( function ( img ) {
         $scope.imageOverlay.setBottomImage( img.src );
         $scope.showBook = true;
         $scope.showProgress = true;
      } );

      BookService.complete.addOnce( function () {
         $scope.$apply( function () {
            $scope.showProgress = false;
            $scope.enabled = true;
         } );

      } );

      BookService.tick.add( function ( adjust ) {
         var o = adjust( $scope.trackPad.normalise( WindowService.width / Settings.sensitivity, 1 ).distFromLastX );
         var overlay = $scope.imageOverlay;
         overlay.setBottomImage( o.baseURL );
         overlay.setTopImage( o.overlayURL, o.overlayOpacity );
      } );

      BookService.load();

      $scope.$watch( 'active', function () {

         if ($scope.active) {
            BookService.start();
         }

         else {
            BookService.end();
         }
      } );

      $scope.$on( 'imageSize', function ( event, imageSize ) {
         var overlay = $scope.imageOverlay;
         overlay.setBottomImage( null, -1, imageSize );
         overlay.setTopImage( null, -1, imageSize );

      } );

   }] );










