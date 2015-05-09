module.exports = function () {
   var bookPreprocessor = require( "./../scripts/pipit-book-preprocessor" )( process.env.JSON_END_POINT, process.env.IMAGE_END_POINT );
    var projectPreprocessor = require( "./../scripts/pipit-project-preprocessor" )( process.env.JSON_END_POINT, process.env.IMAGE_END_POINT );

   return {

      book: function ( req, res ) {
         bookPreprocessor.process( req.params )
            .then( function ( data ) {
               res.json( {success: true, project: data.project, book: data.book} );
            } )
            .catch( function ( error ) {
               res.json( {success: false, error: error} );
            } )

      },
      projects: function ( req, res ) {
         projectPreprocessor.process( req.query )
            .then( function ( data ) {
               res.json( {success: true, projects: data.files, imageEndPoint: data.imagePath} );
            } )
            .catch( function ( error ) {
               res.json( {success: false, error: error} );
            } );

      }
   };
};



