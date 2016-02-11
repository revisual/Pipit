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
         },
         back: function () {
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

   /*  .factory( 'imageSize', ['Settings', 'windowService', function ( Settings, windowService ) {


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
    }] )*/

   .factory( 'API', ['$http', function ( $http ) {

      return {
         getBook: function ( bookID, imageSize ) {
            return $http.get( '/api/book?id=' + bookID + '&size=' + imageSize )
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
         getPresets: function () {
            return $http.get( '/api/presets' )
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
            var threshold = Settings.killThreshold;
            var cV = Math.round( this.currentValue * threshold );
            var tV = Math.round( this.targetValue * threshold );
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
            this.targetValue += test;
            this.currentValue += (this.targetValue - this.currentValue) * Settings.drag;

            if (this.currentValue < 0) this.currentValue = 0;
            else if (this.currentValue > this.totalPages - 1)  this.currentValue = this.totalPages - 1;

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

   .factory( 'BookService', ['$location', 'animationFrame', 'bookData', 'API', 'imageService', 'Settings', function ( $location, animationFrame, bookData, API, imageService, Settings ) {

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
         }, Settings.fps );

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
            console.log( "KILL" );
            kill();
         }

         return bookData;
      };

      var load = function () {

         var search = $location.search();
         API.getBook( search.id || search.book, Settings.getImageSizeValue() )
            .then( function ( data ) {
               imageService.resetWith( data.book.imageURLs );
               imageService.start();
            } );
      };

      var reset = function () {
         kill();
         bookData.reset();
         imageService.reset();
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

   .factory( 'Settings', ['$cookies', 'windowService', 'API', function ( $cookies, windowService, API ) {

      var that = {
            fps: 40,
            imageSize: 'xsmall',
            sizes: {xsmall: 480, small: 768, medium: 992, large: 1200, xlarge: 1620, auto: 'auto'},
            fullscreen: false,
            sensitivity: 100,
            drag: 0.025,
            imageScale: 110,
            interpolation: true,
            killThreshold: 10,
            current: 1,
            items: [],

            changed: new signals.Signal(),

            getImageSizeValue: function () {

               var sizes = this.sizes;
               var imageSize = this.imageSize;
               var value = sizes[imageSize];

               if (value == 'auto') {
                  var windowSize = windowService.width;
                  if (windowSize <= sizes.xsmall)return sizes.xsmall;
                  if (windowSize <= sizes.small)return sizes.small;
                  if (windowSize <= sizes.medium)return sizes.medium;
                  if (windowSize <= sizes.large)return sizes.large;
                  if (windowSize <= sizes.xlarge)return sizes.xlarge;
               }
               return value;
            },
            setFromCookie: function () {
               if ($cookies.preset == undefined)return;
               var index = parseInt( $cookies.preset );
               this.current = index;
               this.setFromPreset( this.items[index] );
            },
            setFromPreset: function ( data ) {

               if (data == null)return;

               for (var name in that) {
                  var nameLC = name.toLowerCase();
                  if (data.hasOwnProperty( name ) && data[name] != null) {
                     that[name] = data[name];
                  }
                  else if (data.hasOwnProperty( nameLC ) && data[nameLC] != null) {
                     that[name] = data[nameLC];
                  }
               }
               that.changed.dispatch();
            },
            getImageSizeAsCSS: function () {

               if (this.imageScale < 100)
                  return this.imageScale + "%";
               if (this.imageScale < 110)
                  return "contains";
               else
                  return "cover";
            }
            ,

            persist: function () {
               if (this.current == -1)return;
               $cookies.preset = this.current
            }
            ,

            load: function () {

               return API.getPresets()
                  .then( function ( data ) {
                     if (data.success) {
                        that.items = data.items;
                        that.changed.dispatch();
                     }
                     return data;
                  } );
            }
            ,

            setCurrent: function ( value ) {
               var index = this.items.indexOf( value );
               if (value == -1)return;
               this.current = index;
            }
         }
         ;

      return that;

   }] )

   .
   value( 'imageService', new ImageListLoader() );




