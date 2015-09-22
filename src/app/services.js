'use strict';

angular.module( 'app.services', [] )

   .factory( 'windowService', ['$window', function ( $window ) {

      var signal = new signals.Signal();
      var o = {
         resize: signal,
         width: $window.innerWidth,
         height: $window.innerHeight,
         hasTouch: function () {
            return ( 'ontouchstart' in $window);
         }   ,
         back:function(){
            $window.history.back();
         }

      };

      $window.onresize = function ( event ) {
         o.width = $window.innerWidth;
         o.height = $window.innerHeight;
         signal.dispatch( o.width, o.height );
      };
      return o;

   }] )

   .factory( 'imageSize', ['Settings', 'windowService', function ( Settings, windowService ) {


      return {
         getValue: function () {

            var sizes = Settings.sizes;
            var currentSize = Settings.currentSize;
            var value = sizes[currentSize];

            if (value == 'auto') {
               var windowSize = windowService.width;
               if (windowSize <= sizes.xsmall)return sizes.xsmall;
               if (windowSize <= sizes.small)return sizes.small;
               if (windowSize <= sizes.medium)return sizes.medium;
               if (windowSize <= sizes.large)return sizes.large;
               if (windowSize <= sizes.xlarge)return sizes.xlarge;
            }
            return value;


         }
      }
   }] )

   .factory( 'API', ['$http', 'imageSize', function ( $http, imageSize ) {

      return {
         getBook: function ( bookID ) {
            return $http.get( '/api/book?id=' + bookID + '&size=' + imageSize.getValue() )
               .then( function ( result ) {
                  return result.data;
               } );
         },
         getProject: function ( projectID ) {
            return $http.get( '/api/project?id=' + projectID )
               .then( function ( result ) {
                  return result.data;
               } );
         },


         getProjectList: function ( search ) {

            var projects = search.projects;
            projects = ( projects != undefined ) ? '?projects=' + projects : "/";
            return $http.get( '/api/listProject' + projects )
               .then( function ( result ) {
                  return result.data;
               } );
         }
      }


   }] )

   //todo - pull out the tick stuff into its own service
   .factory( 'bookData', ['Settings', function ( Settings ) {

      return {
         isComplete: function () {
            var cV = Math.round( this.currentValue * 1000 );
            var tV = Math.round( this.targetValue * 1000 );
            return cV === tV;
         },
         reset: function () {
            this.totalPages = 0;
            this.currentPage = 0;
            this.currentValue = 0;
            this.currentAlpha = 0;
            this.targetValue = 0;
            this.baseURL = null;
            this.overlayURL = null;
            this.overlayOpacity = -1;
         },
         backToBase: function () {
            this.targetValue = this.currentValue;
         },
         applyValue: function ( value ) {
            var test = value;
            var newValue = this.targetValue + test;
            if (newValue < 0) this.targetValue = 0;
            else if (newValue > this.totalPages - 1)  this.targetValue = this.totalPages - 1;
            else this.targetValue += test;
            this.currentValue += (this.targetValue - this.currentValue) * Settings.drag;
            var v = this.currentValue;
            this.currentPage = Math.floor( v );
            this.currentAlpha = v - this.currentPage;
         },
         applyUrls: function ( imageService ) {

            var overlayIndex = this.currentPage + 1;
            var nextBase = imageService.images[this.currentPage].src;

            if (overlayIndex >= imageService.images.length) {
               overlayIndex = this.currentPage;
            }

            var nextOverlay = imageService.images[overlayIndex].src;

            this.baseURL = (this.baseURL == nextBase) ? null : nextBase;
            this.overlayURL = (this.overlayURL == nextOverlay) ? null : nextOverlay;
            this.overlayOpacity = this.currentAlpha;
         },
         totalPages: 0,
         currentPage: 0,
         currentAlpha: 0,
         currentValue: 0,
         targetValue: 0,
         baseURL: null,
         overlayURL: null,
         overlayOpacity: -1
      };


   }] )

   .factory( 'BookService', ['$location', 'animationFrame', 'bookData', 'API', 'imageService', 'Settings', function ( $location, animationFrame, bookData, API, imageService ) {

      var NULL_RETURN = {baseURL: null, overlayURL: null, overlayOpacity: -1};
      var _tick = new signals.Signal();
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
         bookData.totalPages = imageService.totalNumberImages;
         _permissionToEnd = false;
         if (!_active) {
            _active = true;
            _update();
         }
         else {
            bookData.backToBase();
         }
      };

      var end = function () {
         _permissionToEnd = true;
      };

      var kill = function () {
         _active = false;
         _permissionToEnd = false;
         clearTimeout( _stopTimeOut );
      };

      var adjustMultiplier = function ( value ) {
         if (isNaN( value ))return NULL_RETURN;

         bookData.applyValue( value );
         bookData.applyUrls( imageService );

         if (_permissionToEnd && bookData.isComplete()) {
            kill();
         }

         return bookData;
      };

      var load = function () {

         var search = $location.search();
         API.getBook( search.id )
            .then( function ( data ) {
               imageService.resetWith( data.book.imageURLs );
               imageService.start();
            } );
      };

      var reset = function () {
         kill();
         bookData.reset();
         imageService.on.removeAll();
         _tick.removeAll();
      };

      return {
         resolve: imageService.on.resolve,
         progress: imageService.on.progress,
         complete: imageService.on.complete,
         data: bookData,
         start: start,
         tick: _tick,
         end: end,
         load: load,
         reset: reset
      }

   }] )

   .factory( 'Settings', function () {

      return {
         currentSize: 'auto',
         sizes: {xsmall: 480, small: 768, medium: 992, large: 1200, xlarge: 1620, auto: 'auto'},
         fullscreen: false,
         sensitivity: 100,
         sensitivitySliderValues: {min: 1, max: 100, step: 1},
         drag: 0.025,
         dragSliderValues: {min: 0.1, max: 1.0, step: 0.1},
         imageScale: 110,
         imageSizeSliderValues: {min: 50, max: 110, step: 1},
         interpolation: true,
         setFromPreset: function ( data ) {

            if (data.currentSize != undefined) {
               this.currentSize = data.currentSize;
            }

            if (data.sensitivity != undefined) {
               this.sensitivity = data.sensitivity;
            }

            if (data.drag != undefined) {
               this.drag = data.drag;
            }

            if (data.imageScale != undefined) {
               this.imageScale = data.imageScale;
            }

            if (data.interpolation != undefined) {
               this.interpolation = data.interpolation;
            }

         },
         getImageSizeAsCSS: function () {

            if (this.imageScale < 100)
               return this.imageScale + "%";
            if (this.imageScale < 110)
               return "contains";
            else
               return "cover";
         }


      }

   } )

   .factory( 'Presets', function () {

      return {
         current: 0,
         presets: [
            {title: "worst", currentSize: "xsmall", sensitivity: 100, drag: 0.033, imageScale: 50, interpolation: false},
            {title: "best", currentSize: "auto", sensitivity: 100, drag: 0.033, imageScale: 110, interpolation: true}
         ]
      }


   } )
   .value( 'imageService', new ImageListLoader() );




