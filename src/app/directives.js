'use strict';
angular.module( 'app.directives', [] )

   .directive( 'trackPad', ['$swipe', function ( $swipe ) {

      return {
         restrict: "E",

         link: function ( scope, element, attrib ) {
            var _hasTouch = (attrib.touchEnabled == 'true');
            var _enabled = false;
            var _moveValidated = false;


            scope.active = false;
            scope.trackPad = {
               previousPoint: {x: 0, y: 0},
               distancePoint: {x: 0, y: 0, mx: 0, my: 0}
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
                  element.off( 'mouseout', mouseEnd );
                  element.off( 'mouseup', mouseEnd );
               }
            }

            function mouseDown( event ) {

               event.preventDefault();
               start( {x: event.screenX, y: event.screenY} );

               element.on( 'mousemove', mouseMove );
               element.on( 'mouseup', mouseEnd );
               element.on( 'mouseout', mouseEnd );

            }

            function mouseMove( event ) {
               move( {x: event.screenX, y: event.screenY} );
            }

            function mouseEnd() {
               //console.log( "off" )
               element.off( 'mousemove', mouseMove );
               element.off( 'mouseout', mouseEnd );
               element.off( 'mouseup', mouseEnd );
               end()
            }

            function start( pos ) {
               scope.$apply( function () {
                  scope.active = true;
               } );

               var trackPad = scope.trackPad;
               trackPad.previousPoint = pos;

            }

            function end( pos ) {

               scope.trackPad.distancePoint = {x: 0, y: 0, mx: 0, my: 0};
               scope.$apply( function () {
                  scope.active = false;
               } );

            }

            function move( pos ) {

               var trackPad = scope.trackPad;
               trackPad.distancePoint.mx = pos.x - trackPad.previousPoint.mx;
               trackPad.previousPoint.mx = pos.x;
               trackPad.distancePoint.x = pos.x - trackPad.previousPoint.x;
               _moveValidated = true;

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


            scope.imageOverlay ['disable' + capitalizeFirstLetter( attribs.id ) + 'Image'] = function () {
               if (element.hasClass( 'hidden' )) return;
               element.addClass( 'hidden' );
            };

            scope.imageOverlay['set' + capitalizeFirstLetter( attribs.id ) + 'Image'] = function ( url, a, sizeType ) {

               var apply = false;
               var o = {};
               var isHidden = element.hasClass( 'hidden' );

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

               if (isHidden && sizeType == undefined) {
                  element.removeClass( 'hidden' );
               }


            };

         }
      }
   }] )


;









