'use strict';
angular.module( 'app.directives', [] )

   .directive( 'trackPad', ['$swipe', function ( $swipe ) {

      return {
         restrict: "E",

         link: function ( scope, element, attrib ) {
            var _hasTouch = (attrib.touchEnabled == 'true');
            var _enabled = false;

            scope.active = false;
            scope.trackPad = {
               previousPoint: {x: 0, y: 0},
               distancePoint: {x: 0, y: 0, mx: 0, my: 0},

               normalise: function ( w, h ) {
                  var trackPad = scope.trackPad;
                  return {
                     firstTouchX: trackPad.previousPoint.x / w,
                     firstTouchY: trackPad.previousPoint.y / h,
                     lastTouchX: trackPad.previousPoint.mx / w,
                     lastTouchY: trackPad.previousPoint.my / h,
                     distFromFirstX: trackPad.distancePoint.x / w,
                     distFromFirstY: trackPad.distancePoint.y / h,
                     distFromLastX: trackPad.distancePoint.mx / w,
                     distFromLastY: trackPad.distancePoint.my / h
                  }
               }
            };


            attrib.$observe( 'enabled', function ( value ) {
               if (value == 'true') enable();
               else disable();
            } );


            function enable() {
               if (_enabled)return;
               _enabled = true;

               if (_hasTouch) {
                  $swipe.bind( element, {start: start, move: move, end: end, cancel: end} );
               }

               else {
                  element.on( 'mousedown', mouseDown );
               }
            }

            function disable() {
               if (!_enabled)return;
               _enabled = false;
               if (_hasTouch) {
                  $swipe.unbind( element, {start: start, move: move, end: end, cancel: end} );
               }

               else {
                  element.off( 'mousedown', mouseDown );
                  element.off( 'mousemove', mouseMove );
                  element.off( 'mouseup', mouseEnd );
               }
            }


            function mouseDown( event ) {

               event.preventDefault();
               start( {x: event.screenX, y: event.screenY} );

               element.on( 'mousemove', mouseMove );
               element.on( 'mouseup', mouseEnd );

            }

            function mouseMove( event ) {
               move( {x: event.screenX, y: event.screenY} );
            }

            function mouseEnd() {
               element.unbind( 'mousemove', mouseMove );
               element.unbind( 'mouseup', mouseEnd );
               end()
            }

            function start( pos ) {
               scope.$apply( function () {
                  scope.active = true;
               } );

               var trackPad = scope.trackPad;
               trackPad.previousPoint = pos;
               trackPad.distancePoint = {x: 0, y: 0, mx: 0, my: 0};
            }

            function end( pos ) {

               scope.$apply( function () {
                  scope.active = false;
               } );

            }

            function move( pos ) {
               var trackPad = scope.trackPad;
               trackPad.distancePoint.mx = pos.x - trackPad.previousPoint.mx;
               trackPad.distancePoint.my = pos.y - trackPad.previousPoint.my;
               trackPad.previousPoint.mx = pos.x;
               trackPad.previousPoint.my = pos.y;
               trackPad.distancePoint.x = pos.x - trackPad.previousPoint.x;
               trackPad.distancePoint.y = pos.y - trackPad.previousPoint.y;
               //console.log( trackPad.distancePoint.x );

            }


         }
      }
   }] )

   .directive( 'imageOverlay', [function () {
      return {
         restrict: "E",
         link: function ( scope, element, attribs ) {

            function capitalizeFirstLetter( string ) {
               return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
            }

            if (scope.imageOverlay == undefined) {
               scope.imageOverlay = {};
            }

            scope.imageOverlay['set' + capitalizeFirstLetter( attribs.id ) + 'Image'] = function ( url, a, sizeType ) {

               var apply = false;
               var o = {};

               if (url != null && url != "") {
                  o['background-image'] = 'url(' + url + ')';
                  apply = true;
               }

               if (a >= 0) {
                  o.opacity = a;
                  apply = true;
               }

               if (sizeType != undefined) {
                  o['background-size'] = sizeType;
                  apply = true;
               }

               if (apply) {
                  element.css( o );
               }


            };

         }
      }
   }] )


;









