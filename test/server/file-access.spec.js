'use strict';
var expect = require( 'chai' ).expect;
var Promise = require( 'promise' );
var file = require( "./../../scripts/file-access" )();
var mock = require( 'mock-fs' );


describe( 'file system access', function () {

   describe( 'readUTF8', function () {

      it( 'should return an instance of a Promise', function () {
         expect( file.readUTF8() ).to.instanceof( Promise );
      } );

      it( 'should return content if file exists', function () {

         mock( {
            'path/test.txt': 'testing testing 123'
         } );

         file.readUTF8( 'path/test.txt' )

            .then( function ( value ) {
               mock.restore();
               expect( value ).to.equal( "testing testing 123" );
               done();
            } )

            .catch( function ( error ) {
               done( error );
            } );
      } );

      it( 'should error if file does not exist', function ( done ) {
         file.readUTF8( "does/not/exist.txt" )

            .catch( function ( error ) {
               expect( error.errno ).to.equal( -4058 );
               done();
            } )

            .catch( function ( error ) {
               done( error );
            } );

      } );
   } );

   describe( 'readJSON', function () {

      it( 'should return an instance of a Promise', function () {
         expect( file.readJSON() ).to.instanceof( Promise );
      } );

      it( 'should return JSON content if file exists', function ( done ) {

         mock( {
            'path/test.json': '{"test":"testing testing 123"}'
         } );

         file.readJSON( 'path/test.json' )

            .then( function ( data ) {
               mock.restore();
               expect( data.test ).to.equal( "testing testing 123" );
               done();
            } )

            .catch( function ( error ) {
               done( error );
            } );
      } );

      it( 'should error if file does not exist', function ( done ) {

         file.readJSON( "does/not/exist.json" )

            .catch( function ( error ) {
               expect( error.errno ).to.equal( -4058 );
               done();
            } )

            .catch( function ( error ) {
               done( error );
            } );

      } );

      it( 'should error is json is malformed', function ( done ) {

         mock( {
            'path/test.json': '{"test:"testing testing 123"}'
         } );

         file.readJSON( 'path/test.json' )

            .catch( function ( error ) {
               mock.restore();
               expect( error.message ).to.include( "Unexpected token" );
               done();
            } )

            .catch( function ( error ) {
               done( error );
            } );

      } );

   } );

   describe( 'readFolderListing', function () {

      beforeEach( function () {
         mock( {
            'path/': {
               'one.txt': 'file content here',
               'two.json': 'file content here',
               'three.json': 'file content here',
               'empty': {/** empty directory */}
            }
         } );
      } );

      afterEach( function () {
         mock.restore();
      } );

      it( 'should return an instance of a Promise', function () {
         expect( file.readFolderListing() ).to.instanceof( Promise );
      } );

      it( 'should return data with path and contents props', function ( done ) {

         file.readFolderListing( 'path/' )

            .then( function ( data ) {
               expect( data.path ).to.equal( "path/" );
               expect( data.contents ).to.instanceOf( Array );
               expect( data.contents.length ).to.equal( 4 );
               done();
            } )

            .catch( function ( error ) {
               done( error );
            } );
      } );

      it( 'should filter files by name', function ( done ) {

         file.readFolderListing( 'path/',
            function ( name, ext, isFolder ) {
               return (name == "three")
            } )

            .then( function ( data ) {
               expect( data.path ).to.equal( "path/" );
               expect( data.contents ).to.instanceOf( Array );
               expect( data.contents.length ).to.equal( 1 );
               expect( data.contents[0] ).to.equal( "three.json" );
               done();
            } )

            .catch( function ( error ) {
               done( error );
            } );
      } );

      it( 'should filter files by extension', function ( done ) {

         file.readFolderListing( 'path/',
            function ( name, ext, isFolder ) {
               return (ext == "json")
            } )

            .then( function ( data ) {
               expect( data.path ).to.equal( "path/" );
               expect( data.contents ).to.instanceOf( Array );
               expect( data.contents.length ).to.equal( 2 );
               expect( data.contents ).to.include( "two.json" );
               expect( data.contents ).to.include( "three.json" );
               done();
            } )

            .catch( function ( error ) {
               done( error );
            } );
      } );

      it( 'should filter files if it is a folder', function ( done ) {

         file.readFolderListing( 'path/',
            function ( name, ext, isFolder ) {
               return isFolder
            } )

            .then( function ( data ) {
               expect( data.path ).to.equal( "path/" );
               expect( data.contents ).to.instanceOf( Array );
               expect( data.contents.length ).to.equal( 1 );
               expect( data.contents ).to.include( "empty" );
               done();
            } )

            .catch( function ( error ) {
               done( error );
            } );
      } );

      it( 'should error if path does not exist', function ( done ) {

         file.readFolderListing( 'path/fail/',
            function ( name, ext, isFolder ) {
               return isFolder
            } )

            .catch( function ( error ) {
               expect( error.errno ).to.equal( 34 );
               done();
            } )

            .catch( function ( error ) {
               done( error );
            } );
      } );


   } );

   describe( 'readJSONFromFolder', function () {

      beforeEach( function () {
         mock( {
            'path/': {
               'one.txt': 'file content here',
               'two.json': '{"test":"hello"}',
               'three.json': '{"test":"goodbye"}',
               'empty': {/** empty directory */}
            },
            'malformed/': {
               'one.txt': 'file content here',
               'two.json': '{"test:"hello"}',
               'empty': {/** empty directory */}
            }
         } );
      } );

      afterEach( function () {
         mock.restore();
      } );

      it( 'should return an instance of a Promise', function () {
         expect( file.readJSONFromFolder() ).to.instanceof( Promise );
      } );

      it( 'should return JSON content if file exists', function ( done ) {


         file.readJSONFromFolder( 'path/' )
            .then( function ( data ) {
               expect( data ).to.instanceof( Array );
               expect( data.length ).to.equal( 2 );
               done();
            } )

            .catch( function ( error ) {
               done( error );
            } )
      } );

      it( 'should error if folder does not exist', function ( done ) {

         file.readJSONFromFolder( "does/not/exist/" )
            .catch( function ( error ) {

               expect( error.errno ).to.equal( 34 );

               done();
            } )

            .catch( function ( error ) {
               done( error );
            } )

      } );

      it( 'should set an error on return array if json is malformed', function ( done ) {

         file.readJSONFromFolder( 'malformed/' )
            .then( function ( data ) {

               expect( data.length ).to.equal( 1 );
               expect( data[0] ).to.instanceOf( Error );

               done();
            } )

            .catch( function ( error ) {
               done( error );
            } )
      } );

   } );

   describe( 'readFilesFromlist', function () {

      var loadList = ["path/one.txt", "path/two.json", "path/three.html"];

      beforeEach( function () {
         mock( {
            'path/': {
               'one.txt': 'file content here',
               'two.json': '{"test":"hello"}',
               'three.html': '<html/>',
               'empty': {/** empty directory */}
            },
            'malformed/': {
               'one.txt': 'file content here',
               'two.json': '{"test:"hello"}',
               'empty': {/** empty directory */}
            }
         } );
      } );

      afterEach( function () {
         mock.restore();
      } );

      it( 'should return an instance of a Promise', function () {
         expect( file.readFilesFromList( loadList ) ).to.instanceof( Promise );
      } );

      it( 'should return valid content if file exists', function ( done ) {


         file.readFilesFromList( loadList )
            .then( function ( data ) {
               expect( data ).to.instanceof( Array );
               expect( data.length ).to.equal( 3 );
               expect( data[0] ).to.equal( 'file content here' );
               expect( data[1].test ).to.equal( 'hello' );
               expect( data[2] ).to.equal( '<html/>' );
               done();
            } )

            .catch( function ( error ) {
               done( error );
            } )
      } );
      /*
       it( 'should error if folder does not exist', function ( done ) {

       file.readJSONFromFolder( "does/not/exist/" )
       .catch( function ( error ) {

       expect( error.errno ).to.equal( 34 );

       done();
       } )

       .catch( function ( error ) {
       done( error );
       } )

       } );

       it( 'should set an error on return array if json is malformed', function ( done ) {

       file.readJSONFromFolder( 'malformed/' )
       .then( function ( data ) {

       expect( data.length ).to.equal( 1 );
       expect( data[0] ).to.instanceOf( Error );

       done();
       } )

       .catch( function ( error ) {
       done( error );
       } )
       } );*/

   } );

} );
