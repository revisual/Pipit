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


module.controller( 'FullScreenCtrl', ['$scope', '$location', '$route', 'Fullscreen', 'Settings',
   function ( $scope, $location, $route, Fullscreen, Settings ) {

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
         $location.path( '/' );
         $route.reload();
      };

      $scope.fullscreen = Settings.fullscreen;


   }] );

module.controller( 'ToolBarCtrl', ['$scope', 'Settings', 'windowService',
   function ( $scope, Settings, windowService ) {

      $scope.hasTouch = windowService.hasTouch();
      $scope.enabled = true;

      $scope.$watch( 'imageSize', function () {
         Settings.imageSize = $scope.imageSize;
         $scope.$emit( 'imageSize', Settings.getImageSizeAsCSS() );
      } );

      $scope.$watch( 'sensitivity', function () {
         Settings.sensitivity = $scope.sensitivity;
      } );

      $scope.$watch( 'interpolation', function () {
         Settings.interpolation = $scope.interpolation;
      } );

      $scope.imageSize = Settings.imageSize;
      $scope.imageSizeSliderValues = Settings.imageSizeSliderValues;

      $scope.sensitivity = Settings.sensitivity;
      $scope.sensitivitySliderValues = Settings.sensitivitySliderValues;

      $scope.interpolation = Settings.interpolation;


   }] );

module.controller( 'ScrollCtrl', ['$scope', 'BookService',
   function ( $scope, BookService ) {
      var pageData = BookService.data;

      $scope.scrollProperties = {ratio: 1 / pageData.totalPages, position: pageData.currentValue};

      BookService.tick.add( function ( adjust ) {
         $scope.$apply( function () {
            $scope.scrollProperties = {ratio: 1 / pageData.totalPages, position: pageData.currentValue};
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

module.controller( 'BookCtrl', ['$scope', 'BookService', 'Settings', 'windowService',
   function ( $scope, BookService, Settings, windowService ) {

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
         //var adjustedWidth = (windowService.width / Settings.sensitivity) * BookService.data.totalPages;
         var adjustedWidth =   BookService.data.totalPages   ;
         //console.log("mx = " + $scope.trackPad.distancePoint.mx) ;
         var pageData = adjust( $scope.trackPad.normalise( adjustedWidth, 1 ).distFromLastX );
         var overlay = $scope.imageOverlay;
         overlay.setBottomImage( pageData.baseURL );

         if (Settings.interpolation) {
            overlay.setTopImage( pageData.overlayURL, pageData.overlayOpacity );
         }
         else  {
            overlay.disableTopImage();
         }

      } );

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

      $scope.$on( 'imageSize', function ( event, imageSize ) {
         var overlay = $scope.imageOverlay;
         overlay.setBottomImage( null, -1, imageSize );
         overlay.setTopImage( null, -1, imageSize );

      } );

   }] );

module.controller( 'CollapseCtrl', ['$scope',
   function ( $scope ) {

      $scope.isCollapsed = true;

   }] );










