/**
 * Created by Pip on 29/03/2015.
 */
module.exports = function ( jsonPath, imagePath ) {

   var path = require( "path" );
   var file = require( "./../scripts/file-access" )();

   var Processmap = (require( "../scripts/preprocessor" ).PreProcessor);
   var processor = new Processmap();

   processor
      .map( function ( data, done ) {

         var project = data.project || "default";
         var filepath = path.join( jsonPath, project + '.json' );

         file.readJSON( filepath )
            .then( function ( json ) {
               data.project = json;
               done();
            } )
            .catch( function ( error ) {
               data.project = error;
               done();
            } )

      } )
      .then( function ( data ) {
         data.book = getBook( data.book, data.project.content );
         data.book.imageURLs = buildImageURLs( data );
         data.imagePath = imagePath;
         data.success = true;

      } )
      .butOnlyIf( function ( data ) {
         return (data.project.content != undefined && data.book != undefined);
      } );

   var buildImageURLs = function ( data ) {

      var urls = [];
      var range = data.book.range;

      var start = parseInt( range.split( "-" )[0] );
      var end = parseInt( range.split( "-" )[1] );

      for (var i = start; i <= end; i++) {
         var url =  imagePath +  data.project.id + "/" +  data.book.id +"/"+ data.size + "/"+ pad( i, 5 ) + ".jpg" ;
         urls.push( url );
      }

      return urls;
   };

   var pad = function ( num, size ) {
      var s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
   };

   var getBook = function ( book, content ) {
      var len = content.length;
      for (var i = 0; i < len; i++) {
         if (content[i].id == book) {
            return content[i];
         }
      }
      throw  "Book id " + book + " not found";
   };


   return processor;
};