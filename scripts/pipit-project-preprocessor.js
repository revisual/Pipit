/**
 * Created by Pip on 29/03/2015.
 */
module.exports = function ( jsonPath, imagePath ) {

   var path = require( "path" );
   var file = require( "./../scripts/file-access" )();

   var Processmap = (require( "../scripts/preprocessor" ).PreProcessor);
   var processor = new Processmap();

   var addThumbs = function ( project ) {
      project.thumb = imagePath + project.id + "/thumbs/" + project.id + ".jpg";
      if (project.content != undefined) {
         project.content.forEach( function ( book, i, a ) {
            book.thumb = imagePath + project.id + "/thumbs/" + book.id + ".jpg";
         } );
      }
   };

   processor
      .map( function ( data, done ) {

         // create paths
         data.projects = data.projects.split( "," )
            .map( function ( item ) {
               return path.join( jsonPath, item + ".json" )
            } );

         // load in file content
         file.readFilesFromList( data.projects )
            .then( function ( files ) {
               data.files = files;
               done();
            } )
            .catch( function ( error ) {
               data.files = error;
               done()
            } );

      } )
      .butOnlyIf( function ( data ) {
         return data.projects != undefined
      } )

      .then( function ( data, done ) {

         // read in content from json folder
         file.readJSONFromFolder( jsonPath )
            .then( function ( files ) {

               // filter out items marked as private
               files = files.filter( function ( item, i, a ) {
                  var returnVal = (item.private == undefined || item.private == false);
                  if (returnVal && !(item instanceof Error)) {
                     // add thumbs
                     addThumbs( item );

                  }
                  return returnVal;
               } );

               // sort by item index
               files.sort( function ( a, b ) {
                  a = parseInt( a.index );
                  b = parseInt( b.index );
                  if (a > b)    return 1;
                  if (a < b)return -1;
                  return 0;
               } );

               // attach to data
               data.files = files;

               done();
            } )
            .catch( function ( error ) {
               data.files = error;
               done()
            } );
      } )
      .butOnlyIf( function ( data ) {
         return data.projects == undefined;
      } );

   /* .then( function ( data, done ) {

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
    } );*/


   return processor;
};