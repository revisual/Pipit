(function ( angular ) {

   'use strict';

   var app = angular.module( 'tick-service', [] );

   app.factory( 'tickService', ['animationFrame', function ( animationFrame ) {

      var _tick = new signals.Signal();
      var _active;
      var _stopTimeOut;
      var _fps = 33;

      var _update = function () {
         _stopTimeOut = setTimeout( function () {
            if (!_active)return;
            animationFrame( _update );
            _tick.dispatch();
         }, _fps );

      };

      var start = function (fps) {
         if (_active)return;
         _fps = fps;
         _active = true;
         _update();
      };

      var stop = function () {
         _active = false;
         clearTimeout( _stopTimeOut );
      };

      var flush = function () {
         stop() ;
         _tick.removeAll();
      };

      return {
         start: start,
         stop: stop,
         setFPS: function ( value ) {
            _fps = value;
         },
         flush:flush,
         tick: _tick
      }

   }] );


})( window.angular );