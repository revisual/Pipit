(function ( angular ) {

   'use strict';

   var app = angular.module( 'window-service', [] );

   app .factory( 'windowService', ['$window','$location', function ( $window , $location) {

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
         ,
         isExternal:($location.search().isExternal == "true")

      };

      $window.onresize = function ( event ) {
         o.width = $window.innerWidth;
         o.height = $window.innerHeight;
         signal.dispatch( o.width, o.height );
      };
      return o;

   }] )


})( window.angular );