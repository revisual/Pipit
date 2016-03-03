'use strict';

angular.module( 'app.services', [] )

   .factory( 'bookData', ['Settings', function ( Settings ) {

      return {
         isComplete: function () {
            var threshold = Settings.killThreshold;
            // round both and compare
            return ((( this.currentValue * threshold ) + 0.5 << 1) >> 1) === ((( this.targetValue * threshold ) + 0.5 << 1) >> 1);
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

            this.targetValue += value;

            //add capped delta
            this.currentValue +=
               Math.min(
                  Math.max(
                     ((this.targetValue - this.currentValue) * Settings.drag),
                     -Settings.maxVel
                  ),
                  Settings.maxVel
               );

            // cap value within pages
            this.currentValue =
               Math.min(
                  Math.max(
                     this.currentValue,
                     0
                  ),
                  this.totalPages - 1
               );

            this.currentPage = this.currentValue | 0;//bitwise floor
            this.currentAlpha = this.currentValue - this.currentPage;
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


   .factory( 'BookService', ['$location', 'bookData', 'API', 'imageService', 'Settings', function ( $location, bookData, API, imageService, Settings ) {

      var reset = function () {
         bookData.reset();
         imageService.reset();
      };


      var moveBy = function ( value ) {

         bookData.applyValue( value );
         bookData.applyUrls( imageService );

      };

      var load = function () {

         var search = $location.search();
         API.getBook( search.id || search.book, Settings.getImageSizeValue() )
            .then( function ( data ) {
               bookData.totalPages = data.book.imageURLs.length;
               imageService.resetWith( data.book.imageURLs );
               imageService.start();
            } );
      };

      return {
         resolve: imageService.on.resolve,
         progress: imageService.on.progress,
         complete: imageService.on.complete,
         data: bookData,
         load: load,
         reset: reset,
         moveBy: moveBy
      }

   }] )



   .
   value( 'imageService', new ImageListLoader() );




