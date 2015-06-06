'use strict';
var module = angular.module( "app.controllers", [] );

module.controller( 'MenuCtrl', ['$scope', '$location', 'API'/*, '$geolocation'*/,
   function ( $scope, $location, API/*, $geolocation */) {

      var search = $location.search();
      $scope.partial = (search.partial === undefined) ? "partials/default.html" : "partials/" + search.partial + ".html";

      API.getProject( search )
         .then( function ( data ) {
            $scope.projects = data.projects;




         } );

     /* $geolocation.watchPosition( {
         timeout: 5000,
         maximumAge: 5000,
         enableHighAccuracy: true
      } );

      $scope.position = $geolocation.position;
      $scope.coordsError = $geolocation.position.error;
      $scope.count = 0;



      $scope.$watch( "position.coords", function ( newVal, oldVal ) {
         if($scope.projects == null)return;
         $scope.count++;
         var books =  $scope.projects[2].content;

         for ( var book in books){
            if( books[book].position.lat == Math.round($geolocation.position.coords.latitude * 1000)/1000
               && books[book].position.long == Math.round($geolocation.position.coords.longitude * 1000)/1000) {
               books[book].active = true;
            }
            else{
               books[book].active = false;
            }
         }


      } );*/




   }] );

/*module.controller( 'golocationCtrl', ['$scope', '$geolocation',
   function ( $scope, $geolocation ) {



      *//*
       $scope.$watch("coordsError", function(newVal, oldVal){
       console.log(" coordsError " + newVal)
       })*//*

   }] );*/


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

      $scope.imageSize = Settings.imageSize;
      $scope.imageSizeSliderValues = Settings.imageSizeSliderValues;

      $scope.sensitivity = Settings.sensitivity;
      $scope.sensitivitySliderValues = Settings.sensitivitySliderValues;


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
      } );

      BookService.complete.addOnce( function () {
         $scope.$apply( function () {
            $scope.showProgress = false;
            $scope.enabled = true;
         } );

      } );

      BookService.tick.add( function ( adjust ) {
         var adjustedWidth = (windowService.width / Settings.sensitivity) * BookService.data.totalPages;
         var pageData = adjust( $scope.trackPad.normalise( adjustedWidth, 1 ).distFromLastX );
         var overlay = $scope.imageOverlay;
         overlay.setBottomImage( pageData.baseURL );
         overlay.setTopImage( pageData.overlayURL, pageData.overlayOpacity );
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










