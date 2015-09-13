module.exports.DB = function () {

   var format = require( 'pg-format' )
      , Promise = require( 'promise' )
      , pg = require( 'pg' );


   var _url = process.env.DATABASE_URL
      , that = this
      , PROJECT_TABLE = 'project'
      , BOOK_TABLE = 'book'

      , QUERY_BY_VAL = 'SELECT * FROM %I WHERE %I=%L'
      , QUERY_BY_MULTIPLE_VAL = 'SELECT * FROM %I WHERE %I IN (%L)';


   this.getProjectByID = function ( projectID ) {
      var sql = format( QUERY_BY_VAL, PROJECT_TABLE, 'id', projectID )
         , project;

      return sendQuery( sql )

         .then( function ( data ) {
            project = data.rows[0];
            return that.getBooksByProject( projectID );
         } )

         .then( function ( data ) {
            project.content = data;
            return Promise.resolve( project );
         } );
   };

   this.getProjects = function ( projectIDs ) {

      var sql = ( projectIDs == null)
         ? format( QUERY_BY_VAL, PROJECT_TABLE, 'private', false )
         :format( QUERY_BY_MULTIPLE_VAL, PROJECT_TABLE, 'id', projectIDs );

      return sendQuery( sql )
         .then( function ( data ) {
            return Promise.resolve( data.rows );
         } )
   };


   this.getBookById = function ( bookID ) {
      var sql = format( QUERY_BY_VAL, BOOK_TABLE, 'id', bookID );
      return sendQuery( sql )
         .then( function ( data ) {
            return Promise.resolve( data.rows[0] );
         } );
   };

   this.getBooksByProject = function ( projectID ) {
      var sql = format( 'SELECT * FROM %I WHERE %I=%L', BOOK_TABLE, 'project', projectID );
      return sendQuery( sql )
         .then( function ( data ) {
            return Promise.resolve( data.rows );
         } );
   };


   var sendQuery = function ( sql ) {
      return new Promise( function ( resolve, reject ) {
         pg.connect( _url, function ( err, client, done ) {

            if (client == null) {
               reject( err );
               return;
            }

            client.query( sql, function ( err, result ) {

               done();

               if (err) {
                  reject( err )
               }
               else {

                  resolve( result );
               }
            } );
         } );
      } );
   };


};


