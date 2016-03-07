(function ( angular ) {

   'use strict';

   var app = angular.module( 'pipit-settings', [] );

   app.factory( 'Settings', ['$cookies', 'windowService', 'API', function ( $cookies, windowService, API ) {

      var that = {
            fps: 40,
            imageSize: 'xsmall',
            sizes: {xsmall: 480, small: 768, medium: 992, large: 1200, xlarge: 1620, auto: 'auto'},
            maxVel: 0.55,
            fullscreen: false,
            sensitivity: 0.5,
            drag: 0.1,
            imageScale: 110,
            interpolation: true,
            killThreshold: 10,
            deltaThrottle: 33,
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

               return API.getPresets( windowService.hasTouch() )
                  .then( function ( data ) {
                     if (data.success) {
                        that.items = data.items;
                        that.changed.dispatch();
                     }
                     return data;
                  } );
            }                ,

            setCurrent: function ( value ) {
               var index = this.items.indexOf( value );
               if (value == -1)return;
               this.current = index;
            }
         }
         ;

      return that;

   }] )


})( window.angular );