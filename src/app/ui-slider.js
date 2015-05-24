(function ( angular ) {

   'use strict';

   var app = angular.module( 'angular-slider', [] );

   app.directive( 'sliderControl',['$swipe', function ( $swipe ) {

      return {
         restrict: "E",
         require: '?ngModel',
         template: '<div id="fill" class="fill"></div><div id="thumb" class="thumb"></div>',
         link: function ( scope, element, attrib, ngModel ) {

            var _hasTouch = (attrib.touchEnabled == 'true');
            var _enabled = false;
            var _fill = element.children().eq( 0 );
            var _thumb = element.children().eq( 1 );
            _fill.css( {position: 'absolute', height: 'inherit'} );
            _thumb.css( {position: 'absolute', height: 'inherit'} );
            var _width = element[0].offsetWidth;
            var _thumbWidth = _thumb[0].offsetWidth;
            var _startX = 0;
            var _initialMouseX = 0;

            var _previousSteppedValue = 0;

            attrib.$observe( 'enabled', function ( value ) {
               if (value == 'true') enable();
               else disable()
            } );


            var enable = function () {
               if (_enabled)return;
               _enabled = true;

               if (_hasTouch) {

                  $swipe.bind( element, {start: start, move: move, end: end, cancel: end} );
               }

               else {
                  scope.swipe = false;
                  element.on( 'mousedown', mouseDown );
               }
            };

            var disable = function () {

               if (!_enabled)return;
               _enabled = false;

               if (_hasTouch) {

                  $swipe.unbind( element, {start: start, move: move, end: end, cancel: end} );
               }

               else {

                  element.off( 'mousedown', mouseDown );
                  element.off( 'mousemove', mouseMove );
                  element.off( 'mouseup', mouseEnd );
                  element.off( 'mouseout', mouseEnd );
               }
            };

            // model -> view
            ngModel.$render = function () {

               var max = (attrib.max == undefined) ? 100 : parseFloat( attrib.max );
               var min = (attrib.min == undefined) ? 0 : parseFloat( attrib.min );

               if (ngModel.$viewValue < min) {
                  ngModel.$viewValue = min;
               }

               else if (ngModel.$viewValue > max) {
                  ngModel.$viewValue = max;
               }

               var multiplier = (ngModel.$viewValue - min ) / (max - min);

               var p = (_width - _thumbWidth) * multiplier;

               _thumb.css( {
                  left: p + 'px'
               } );

               _fill.css( {
                  width: _width - (_width - p - _thumbWidth) + 'px'
               } );
            };

            // view -> model
            var forceApply = function ( value ) {
               if (scope.disabled)
                  return;
               scope.$apply( function () {
                  ngModel.$setViewValue( value );
               } );

            };


            function mouseDown( event ) {

               event.preventDefault();
               start( {x: event.clientX, y: event.clientY} );

               element.on( 'mousemove', mouseMove );
               element.on( 'mouseup', mouseEnd );
               element.on( 'mouseout', mouseEnd );

            }

            function mouseMove( event ) {
               move( {x: event.clientX, y: event.clientY} );
            }

            function mouseEnd() {
               element.off( 'mousemove', mouseMove );
               element.off( 'mouseup', mouseEnd );
               element.off( 'mouseout', mouseEnd );
               end()
            }

            function start( pos ) {
               _startX = _thumb.prop( 'offsetLeft' );
               _initialMouseX = pos.x;
            }

            function end( pos ) {


            }

            function move( pos ) {

               var dx = pos.x - _initialMouseX;
               var p = _startX + dx;

               if (p > (_width - _thumbWidth)) {
                  p = _width - _thumbWidth;
               }

               else if (p < 0) {
                  p = 0;
               }

               _thumb.css( {
                  left: p + 'px'
               } );

               _fill.css( {
                  width: _width - (_width - p - _thumbWidth ) + 'px'
               } );


               calculateValue( p )

            }

            function calculateValue( p ) {

               var max = (attrib.max == undefined) ? 100 : parseFloat( attrib.max );
               var min = (attrib.min == undefined) ? 0 : parseFloat( attrib.min );
               var increment = (attrib.increment == undefined) ? 1 : parseFloat( attrib.increment );

               var multiplier = p / (_width - _thumbWidth);
               var value = ((max - min) * multiplier) + min;
               var steppedValue = (value) - (value % increment);

               if (steppedValue != _previousSteppedValue) {
                  forceApply( steppedValue );
                  _previousSteppedValue = steppedValue
               }

            }


         }
      }
   } ])


})( window.angular );