module.exports.DB = function (db) {

   var format = require( 'pg-format' )
      , Promise = require( 'promise' )
      , pg = db;


   var _url = process.env.DATABASE_URL + "?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory"
      , that = this
      , PROJECT_TABLE = 'project'
      , BOOK_TABLE = 'book'
      , PRESETS_TABLE = 'presets'
      , QUERY_ALL = 'SELECT * FROM %I'
      , ORDER_BY = ' ORDER BY %I ASC'
      , QUERY_BY_VAL = 'SELECT * FROM %I WHERE %I=%L'
      , QUERY_BY_MULTIPLE_VAL = 'SELECT * FROM %I WHERE %I IN (%L)';


   this.getProjectByID = function ( projectID ) {
      var sql = format( QUERY_BY_VAL, PROJECT_TABLE, 'id', projectID )
         , project;
      console.log("[!] db::getProjectByID ");
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
         : format( QUERY_BY_MULTIPLE_VAL, PROJECT_TABLE, 'id', projectIDs );
      console.log("[!] db::getProjects ");
      return sendQuery( sql )
         .then( function ( data ) {
            return Promise.resolve( data.rows );
         } )
   };

   this.getPresets = function (name, isTouch) {
      var sql = format( QUERY_ALL + ORDER_BY, PRESETS_TABLE, "id");
      console.log("[!] db::getPresets ");
      return sendQuery( sql )
         .then( function ( data ) {
            return Promise.resolve( data.rows );
         } )


   };


   this.getBookById = function ( bookID ) {
      var sql = format( QUERY_BY_VAL, BOOK_TABLE, 'id', bookID );
      console.log("[!] db::getBookById ");
      return sendQuery( sql )
         .then( function ( data ) {
            return Promise.resolve( data.rows[0] );
         } );
   };

   this.getBooksByProject = function ( projectID ) {
      var sql = format( 'SELECT * FROM %I WHERE %I=%L', BOOK_TABLE, 'project', projectID );
      console.log("[!] db::getBooksByProject ");
      return sendQuery( sql )
         .then( function ( data ) {
            return Promise.resolve( data.rows );
         } );
   };


   var sendQuery = function ( sql ) {
      return new Promise( function ( resolve, reject ) {
         console.log("[!] db::sendQuery database_url =",_url);
         console.log("[!] db::sendQuery sql =",sql);
         pg.connect( _url, function ( err, client, done ) {

            var did_we_time_out = false;

            if (client === null) {
               console.error("[*] db::sendQuery client null: error =",err);
               reject( err );
               return;
            }

            var timeout_handle = setTimeout(function(){
               console.log("[!] db::sendQuery query timed out");
               did_we_time_out = true;
               done();
               reject( "sendQuery Timed out: " );
            }, 10000);
            
            client.query( sql, function ( err, result ) {

               clearTimeout(timeout_handle);

               if (err || did_we_time_out) {
                  console.error("[*] db::sendQuery query failed: error =",err);
                  reject( err )
               }
               else {
                  console.log("[!] db::sendQuery query succeeded");
                  resolve( result );
               }

               done();

            } );
         } );
      } );
   };


};


