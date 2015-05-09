'use strict';

angular.module( 'app.services', [] )

   .factory( 'WindowService', function ( $window ) {

      var signal = new signals.Signal();
      var o = {
         resize: signal,
         width: $window.innerWidth,
         height: $window.innerHeight,
         hasTouch: function () {
            return ( 'ontouchstart' in $window);
         }
      };

      $window.onresize = function ( event ) {
         o.width = $window.innerWidth;
         o.height = $window.innerHeight;
         signal.dispatch( o.width, o.height );
      };
      return o;

   } )

   .factory( 'ImageSize', function ( WindowService ) {

      var minSizes = [768, 992, 1200];
      var imagesSizes = [768, 992, 1200, 992];

      return {
         getValue: function () {
            var size = WindowService.width;

            var i = 0;
            do {
               if (size < minSizes[i]) {
                  return imagesSizes[i];
               }
               i++;
            } while (i < minSizes.length) ;


            return imagesSizes[imagesSizes.length - 1];
         }
      }
   } )

   .factory( 'API', function ( $http, ImageSize ) {

      return {
         getBook: function ( project, book ) {
            return $http.get( '/api-book/' + project + '/' + book + '/' + ImageSize.getValue() + '/' )
               .then( function ( result ) {
                  return result.data;
               } );git


         },
         getProject: function ( search ) {

            var query = "";
            for (var key in search) {
               if (query != "") {
                  query += "&"
               }
               query += key + "=" + search[key];
            }

            if (query != "") {
               query = "?" + query;
            }

            return $http.get( '/api-project/' + query )
               .then( function ( result ) {
                  return result.data;
               } );
         }
      }


   } )

   //todo - pull out the tick stuff into its own service
   .factory( 'BookService', function ( $location, animationFrame, API, imageService ) {

      var NULL_RETURN = {baseURL: null, overlayURL: null, overlayOpacity: -1};
      var _tick = new signals.Signal();
      var _pageValues = {page: 0, remainder: 0};
      var _overlayData = {
         isComplete: function () {
            var cV = Math.round( this.currentValue * 1000 );
            var tV = Math.round( this.targetValue * 1000 );
            return cV === tV;
         },
         reset: function () {
            this.currentValue = 0;
            this.targetValue = 0;
            this.baseURL = null;
            this.overlayURL = null;
            this.overlayOpacity = -1;
         },
         backToBase: function () {
            this.targetValue = this.currentValue;
         },

         currentValue: 0,
         targetValue: 0,
         baseURL: null,
         overlayURL: null,
         overlayOpacity: -1
      };
      var _active;
      var _permissionToEnd = false;
      var _stopTimeOut;


      var _update = function () {
         _stopTimeOut = setTimeout( function () {
            if (!_active)return;
            animationFrame( _update );
            _tick.dispatch( adjustMultiplier );
         }, 33 );

      };

      var start = function () {
         _permissionToEnd = false;
         if (!_active) {
            _active = true;
            _update();
         }
         else {
            _overlayData.backToBase();
         }
      };

      var end = function () {
         _permissionToEnd = true;
      };

      _active = true;
      var kill = function () {
         _active = false;
         _permissionToEnd = false;
         clearTimeout( _stopTimeOut );
      };


      var adjustMultiplier = function ( value ) {
         if (isNaN( value ))return NULL_RETURN;
         var newValue = _overlayData.targetValue + value;
         if (newValue > 0 && newValue < 1) {
            _overlayData.targetValue += value;
         }

         applyValue();


         var overlayIndex = _pageValues.page + 1;
         var nextBase = imageService.images[_pageValues.page].src;


         if (overlayIndex >= imageService.images.length) {
            overlayIndex = _pageValues.page;
         }

         var nextOverlay = imageService.images[overlayIndex].src;

         _overlayData.baseURL = (_overlayData.baseURL == nextBase) ? null : nextBase;
         _overlayData.overlayURL = (_overlayData.overlayURL == nextOverlay) ? null : nextOverlay;
         _overlayData.overlayOpacity = _pageValues.remainder;


         if (_permissionToEnd && _overlayData.isComplete()) {
            kill();
         }

         return _overlayData;
      };


      var applyValue = function () {
         _overlayData.currentValue += (_overlayData.targetValue - _overlayData.currentValue) * 0.25;
         var v = _overlayData.currentValue * imageService.totalNumberImages;
         _pageValues.page = Math.floor( v );
         _pageValues.remainder = v - _pageValues.page;
      };

      var load = function () {

         var search = $location.search();
         API.getBook( search.project, search.book )
            .then( function ( data ) {
               imageService.resetWith( data.book.imageURLs );
               imageService.start();
            } );
      };

      var reset = function () {
         kill();
         _overlayData.reset();
         imageService.on.removeAll();
         _tick.removeAll();
      };


      return {
         resolve: imageService.on.resolve,
         progress: imageService.on.progress,
         complete: imageService.on.complete,
         start: start,
         tick: _tick,
         end: end,
         load: load,
         reset: reset
      }

   } )

   .factory( 'Settings', function () {


      return {
         fullscreen: false,
         sensitivity: 4,
         sensitivitySliderValues: {min: 0.25, max: 20, step: 0.25},
         imageSize: 110,
         imageSizeSliderValues: {min: 50, max: 110, step: 1},
         getImageSizeAsCSS: function () {

            if (this.imageSize < 100)
               return this.imageSize + "%";
            if (this.imageSize < 110)
               return "contains";
            else
               return "cover";
         }


      }

   }
)

   .
   value( 'imageService', new ImageListLoader() );




