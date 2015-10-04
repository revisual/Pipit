module.exports = function () {

   var db = new (require( '../scripts/db' ).DB )()
      , endPoint = process.env.IMAGE_END_POINT;

   var pad = function ( num, size ) {
      var s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
   };

   var parseBookImages = function ( data, size ) {

      var urls = [];

      for (var i = data.firstpage; i <= data.lastpage; i++) {
         var url = endPoint + data.project + "/" + data.id + "/" + size + "/" + pad( i, 5 ) + ".jpg";
         urls.push( url );
      }
      data.imageURLs = urls;

      return data
   };

   var parseProjectThumbs = function ( projects ) {

      projects.forEach( function ( item, i, a ) {
         item.thumb = endPoint + item.id + "/thumbs/768/" + item.id + ".jpg";
      } );


      return projects;
   };


   var parseBookThumbs = function ( project ) {

      project.content.forEach( function ( item, i, a ) {
         item.thumb = endPoint + project.id + "/" + item.id + "/768/" + pad( item.thumb, 5 ) + ".jpg";
      } );


      return project;
   };

   return {

      book: function ( req, res ) {

         db.getBookById( req.query.id )

            .then( function ( data ) {
               res.json(
                  {
                     success: true,
                     book: parseBookImages( data, req.query.size )
                  } );
            } )

            .catch( function ( error ) {
               console.log( "" )
            } );


      },

      project: function ( req, res ) {

         db.getProjectByID( req.query.id )

            .then( function ( data ) {
               res.json(
                  {
                     success: true,
                     project: parseBookThumbs( data )
                  } );
            } )

            .catch( function ( error ) {
               res.json(
                  {
                     success: false,
                     error: error
                  } );
            } );


      },

      presets: function ( req, res ) {

         db.getPresets(  )

            .then( function ( data ) {
               res.json(
                  {
                     success: true,
                     items: data
                  } );
            } )

            .catch( function ( error ) {
               res.json(
                  {
                     success: false,
                     error: error
                  } );
            } );


      },

      listProjects: function ( req, res ) {
         var projects = req.query.projects;

         db.getProjects( (projects == undefined) ? null : projects.split( "," ) )
            .then( function ( data ) {
               parseProjectThumbs( data );
               res.json( {success: true, projects: data, imageEndPoint: endPoint} );
            } )
            .catch( function ( error ) {
               res.json( {success: false, error: error} );
            } );

      }
   };
};



