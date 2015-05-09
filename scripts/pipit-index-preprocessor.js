/**
 * Created by Pip on 29/03/2015.
 */
module.exports = function ( partialPath ) {

   var path = require( "path" );
   var file = require( "./../scripts/file-access" )();

   var Processmap = (require( "../scripts/preprocessor" ).PreProcessor);
   var processor = new Processmap();


   processor
      .map( function ( data, done ) {

         //grab either provided partial name, or the default
         var name = data.partial || "default";

         // read in partial and attach to data
         file.readUTF8( path.join( partialPath, name + ".html" ) )
            .then( function ( text ) {
               data.partial = text;
               done();
            } )

            .catch( function ( error ) {
               data.partial = error;
               done()
            } );
      } );

   return processor;
};