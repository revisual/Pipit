(function ( angular ) {

   'use strict';

   var app = angular.module( 'pipit-api', [] );

   app .factory( 'API', ['$http', function ( $http ) {

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
         getPresets: function ( hasTouch ) {
            //todo: add to db
            //mocks up db
            var o = {
               items: [
                  {
                     imagesize: 'auto',
                     maxVel: 0.51,
                     sensitivity: (hasTouch) ? 0.55 : 0.22,
                     drag: 0.088,
                     imageScale: 150,
                     interpolation: true,
                     killThreshold: 10,
                     deltaThrottle: 30,
                     fps: 33
                  }
               ],
               success: true
            };
            return Promise.resolve( o );
            /*return $http.get( '/api/presets' )
             .then( function ( result ) {
             return result.data;
             } );*/
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


})( window.angular );