'use strict';
var module = angular.module( "app.controllers", [] );

module.controller( 'MenuCtrl', ['$scope', '$location', 'API',
   function ( $scope, $location, API ) {

      var search = $location.search();
      $scope.partial = (search.partial === undefined) ? "partials/default.html" : "partials/" + search.partial + ".html";

      API.getProjectList( search )
         .then( function ( data ) {

            $scope.projects = data.projects;

         } );

   }] );

module.controller( 'ProjectCtrl', ['$scope', '$location', 'API',
   function ( $scope, $location, API ) {

      var search = $location.search();
      API.getProject( search.id )
         .then( function ( data ) {
            $scope.books = data.project.content;
            $scope.project = data.project;

         } );


   }] );


module.controller( 'FullScreenCtrl', ['$scope',  'windowService', 'Fullscreen', 'Settings',
   function ( $scope, windowService, Fullscreen, Settings ) {

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

      $scope.backToMenu = function () {
         windowService.back();
      };

      $scope.fullscreen = Settings.fullscreen;


   }] );

module.controller( 'ToolBarCtrl', ['$scope', 'Settings', 'windowService',
   function ( $scope, Settings, windowService ) {

      $scope.hasTouch = windowService.hasTouch();
      $scope.enabled = true;

      $scope.$watch( 'imageScale', function () {
         Settings.imageScale = $scope.imageScale;
         $scope.$emit( 'imageScale', Settings.getImageSizeAsCSS() );
      } );

      $scope.$watch( 'sensitivity', function () {
         Settings.sensitivity = $scope.sensitivity;
      } );

      $scope.$watch( 'interpolation', function () {
         Settings.interpolation = $scope.interpolation;
      } );

      $scope.imageScale = Settings.imageScale;
      $scope.imageSizeSliderValues = Settings.imageSizeSliderValues;

      $scope.sensitivity = Settings.sensitivity;
      $scope.sensitivitySliderValues = Settings.sensitivitySliderValues;

      $scope.interpolation = Settings.interpolation;


   }] );

module.controller( 'ScrollCtrl', ['$scope', 'BookService',
   function ( $scope, BookService ) {
      var pageData = BookService.data;

      $scope.scrollProperties = {
         ratio: 1 / pageData.totalPages,
         position: pageData.currentValue / (pageData.totalPages - 1)
      };

      BookService.tick.add( function ( adjust ) {
         $scope.$apply( function () {
            $scope.scrollProperties = {
               ratio: 1 / pageData.totalPages,
               position: pageData.currentValue / ( pageData.totalPages - 1)
            };
         } );
      } );

   }] );

module.controller( 'ImageSizeCtrl', ['$scope', 'Settings',
   function ( $scope, Settings ) {

      $scope.checkModel = Settings.sizes;

      $scope.radioModel = Settings.currentSize;

      $scope.$watch( 'radioModel', function () {
         Settings.currentSize = $scope.radioModel;
      } );


   }] );

module.controller( 'BookCtrl', ['$scope', 'BookService', 'Settings', 'windowService', '$location',
   function ( $scope, BookService, Settings, windowService, $location ) {

      BookService.reset();

      $scope.hasTouch = windowService.hasTouch();

      BookService.progress.add( function ( current, total ) {
         $scope.$apply( function () {
            $scope.progress = current / total;
         } );
      } );

      BookService.resolve.addOnce( function ( img ) {
         $scope.imageOverlay.setBottomImage( img.src );
         $scope.showBook = true;
         $scope.showProgress = true;
         $scope.showDragInfo = false;
      } );

      BookService.complete.addOnce( function () {
         $scope.$apply( function () {
            $scope.showProgress = false;
            $scope.enabled = true;
            $scope.showDragInfo = true;
         } );

      } );

      BookService.tick.add( function ( adjust ) {

         var adjustedWidth = windowService.width / Settings.sensitivity;

         var move = ( $scope.trackPad.distancePoint.mx / adjustedWidth);
         var pageData = adjust( move );
         var overlay = $scope.imageOverlay;
         overlay.setBottomImage( pageData.baseURL );

         if (Settings.interpolation) {
            overlay.setTopImage( pageData.overlayURL, pageData.overlayOpacity );
         }
         else {
            overlay.disableTopImage();
         }

      } );


      Settings.setFromPreset( $location.search() );

      BookService.load();

      $scope.$watch( 'active', function () {

         if ($scope.active) {
            if ($scope.showDragInfo) {
               $scope.showDragInfo = false;
            }
            BookService.start();
         }

         else {
            BookService.end();
         }
      } );

      $scope.$on( 'imageScale', function ( event, imageScale ) {
         var overlay = $scope.imageOverlay;
         overlay.setBottomImage( null, -1, imageScale );
         overlay.setTopImage( null, -1, imageScale );

      } );

   }] );

module.controller( 'CollapseCtrl', ['$scope',
   function ( $scope ) {

      $scope.isCollapsed = true;

   }] );










