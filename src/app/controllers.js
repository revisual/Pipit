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


module.controller( 'FullScreenCtrl', ['$scope', 'windowService', 'Fullscreen', 'Settings',
   function ( $scope, windowService, Fullscreen, Settings ) {

      if (windowService.isExternal) {
         $scope.isHidden = true;
      }

      else {
         $scope.backToMenu = function () {
            windowService.back();
         };
      }

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

module.controller( 'ScrollCtrl', ['$scope', 'bookData', 'tickService',
   function ( $scope, bookData, tickService ) {


      $scope.scrollProperties = {
         ratio: 1 / bookData.totalPages,
         position: bookData.currentValue / (bookData.totalPages - 1)
      };

      tickService.tick.add( function () {
         $scope.$apply( function () {
            $scope.scrollProperties = {
               ratio: 1 / bookData.totalPages,
               position: bookData.currentValue / ( bookData.totalPages - 1)
            };
         } );
      } );

   }] );

module.controller( 'ImageSizeCtrl', ['$scope', 'Settings',
   function ( $scope, Settings ) {

      $scope.checkModel = Settings.sizes;

      $scope.radioModel = Settings.imageSize;

      $scope.$watch( 'radioModel', function () {
         Settings.imageSize = $scope.radioModel;
      } );


   }] );

module.controller( 'BookCtrl', ['$scope', 'BookService', 'tickService', 'Settings', 'windowService',
   function ( $scope, BookService, tickService, Settings, windowService ) {

      var bookData = BookService.data;

      $scope.$on( "$destroy", function () {
         tickService.flush();
         BookService.reset();
      } );

      Settings.load()
         .then( function ( data ) {
            Settings.setFromPreset( Settings.items[0] );
            BookService.load();
         } );

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

      tickService.tick.add( function () {

         var overlay = $scope.imageOverlay;
         var cappedDelta =
            Math.min(
               Math.max(
                  $scope.trackPad.distancePoint.mx,
                  -Settings.deltaThrottle
               ),
               Settings.deltaThrottle
            );
         //console.log("cappedDelta = " +cappedDelta)

         var move = ( cappedDelta * Settings.sensitivity );

         BookService.moveBy( isNaN( move ) ? 0 : move );

         overlay.setBottomImage( bookData.baseURL );

         if (Settings.interpolation) {
            overlay.setTopImage( bookData.overlayURL, bookData.overlayOpacity );
         }
         else {
            overlay.disableTopImage();
         }

         if (bookData.isComplete() && !$scope.active) {
            tickService.stop();
         }

      } );


      $scope.$watch( 'active', function () {

         if ($scope.active) {
            if ($scope.showDragInfo) {
               $scope.showDragInfo = false;
            }
            bookData.backToBase();
            tickService.start( Settings.fps );
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










