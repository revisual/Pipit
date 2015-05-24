(function ( angular ) {

   'use strict';

   var app = angular.module( 'angular-scroll-indicator', [] );

   app.directive( 'scrollIndicator', [function () {

      return {
         restrict: "E",
         require: '?ngModel',
         template: '<div id="thumb" class="thumb"></div>',
         link: function ( scope, element, attrib, ngModel ) {

            var _thumb = element.children().eq( 0 );
            _thumb.css( {position: 'absolute', height: 'inherit'} );


            // model -> view
            ngModel.$render = function () {

               var prop = ngModel.$viewValue;
               var ratio = prop.ratio;
               var position = prop.position;
               var width = element[0].offsetWidth;
               var thumbWidth = width * ratio;


               _thumb.css( {
                  left: (width - thumbWidth) * position + 'px',
                  width: thumbWidth + 'px'
               } );


            };


         }
      }
   }] )


})( window.angular );