/**
 * Created by Pip on 03/10/2014.
 */
module.exports = function () {
   var file = require( "./../scripts/file-access" )();
   return {
      index: function ( req, res ) {

         var path;

         if (process.env.DEPLOYMENT == 'debug') {
            path = "./views/index-debug.html"
         }
         else {
            path = "./views/index.html"
         }

         file.readUTF8( path )
            .then( function ( data ) {
               res.send( data )
            } )
            .catch( function ( error ) {
               res.send( error )
            } )

         /*  preprocessor.process( req.query )
          .then( function ( data ) {
          res.render( "index", data );
          } )
          .catch( function ( error ) {
          res.render( "error", {success: false, error: error} );
          } );*/

      }
   };
};
