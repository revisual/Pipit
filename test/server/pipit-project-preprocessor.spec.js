'use strict';
var expect = require( 'chai' ).expect;
var mock = require( 'mock-fs' );

var JSON_PATH = "json/";
var IMAGE_PATH = "image/";


describe( 'pipit project preprocessor', function () {

   describe( 'first iteration - projects provided', function () {



      var preprocessor;
      var data;

      beforeEach( function () {
         preprocessor = require( "./../../scripts/pipit-project-preprocessor" )( JSON_PATH, IMAGE_PATH );
         data = {projects: "one,two,three"};
         mock( {
            'json/': {
               'one.json': '{"test":"one"}',
               'two.json': '{"test":"two"}',
               'three.json': '{"test":three"}',
               'empty': {/** empty directory */}
            },
            'partial/': {
               'one.html': '<p>hello</p>',
               'default.html': '<p>goodbye</p>'
            }
         } );
      } );

      afterEach( function () {
         preprocessor = null;
         mock.restore();
         data = null;
      } );

      it( 'should format the data properties to full paths', function ( done ) {
         preprocessor.process( data )
            .then( function ( data ) {
               expect( data.projects ).to.instanceOf( Array );
               expect( data.projects.length ).to.equal( 3 );
               expect( data.projects[0] ).to.equal( "json\\one.json" );
               expect( data.projects[1] ).to.equal( "json\\two.json" );
               done();
            } )
            .catch( function ( error ) {
               done( error );
            } )
      } );

      it( 'should load the file contents', function ( done ) {
         preprocessor.process( data )
            .then( function ( data ) {
               expect( data.files ).to.instanceOf( Array );
               expect( data.files.length ).to.equal( 3 );
               expect( data.files[0].test ).to.equal( "one" );
               expect( data.files[1].test ).to.equal( "two" );
               done();
            } )
            .catch( function ( error ) {
               done( error );
            } )
      } );

      it( 'should include errors loading the file contents', function ( done ) {
         preprocessor.process( data )
            .then( function ( data ) {
               expect( data.files ).to.instanceOf( Array );
               expect( data.files.length ).to.equal( 3 );
               expect( data.files[2] ).to.instanceOf( Error );
               done();
            } )
            .catch( function ( error ) {
               done( error );
            } )
      } );
   } );

   describe( 'second iteration - projects undefined', function () {


      var preprocessor;
      var data;

      beforeEach( function () {
         preprocessor = require( "./../../scripts/pipit-project-preprocessor" )( JSON_PATH, IMAGE_PATH );
         data = {};
         mock( {
            'json/': {
               'one.json': '{"id":"one","index":"1","content":[{"id":"A"}]}',
               'two.json': '{"id":"two","index":"2"}',
               'three.json': '{"id":"three","private":"true","index":"3"}',
               'four.json': '{"id":"four","index":"4"',
               'empty': {/** empty directory */}
            },
            'partial/': {
               'one.html': '<p>hello</p>',
               'default.html': '<p>goodbye</p>'
            }
         } );
      } );

      afterEach( function () {
         preprocessor = null;
         mock.restore();
         data = null;
      } );

      it( 'should sort by index property, filter out private items and include errors', function ( done ) {
         preprocessor.process( data )
            .then( function ( data ) {
               expect( data.files ).to.instanceOf( Array );
               expect( data.files.length ).to.equal( 3 );
               expect( data.files[0] ).to.instanceOf( Error );
               expect( data.files[1].id ).to.equal( "one" );
               expect( data.files[2].id ).to.equal( "two" );
               done();
            } )
            .catch( function ( error ) {
               done( error );
            } )
      } );

      it( 'should create thumbs', function ( done ) {
         preprocessor.process( data )
            .then( function ( data ) {
               expect( data.files[1].thumb ).to.equal( IMAGE_PATH + 'one/thumbs/one.jpg' );
               expect( data.files[1].content[0].thumb ).to.equal( IMAGE_PATH + 'one/thumbs/A.jpg' );
               expect( data.files[2].thumb ).to.equal( IMAGE_PATH + 'two/thumbs/two.jpg' );

               done();
            } )
            .catch( function ( error ) {
               done( error );
            } )
      } );


   } );

  /* describe( 'third iteration - copy provided', function () {



      var preprocessor;
      var data;

      beforeEach( function () {
         preprocessor = require( "./../../scripts/pipit-project-preprocessor" )( JSON_PATH, IMAGE_PATH );
         data = {};
         mock( {
            'partial/': {
               'one.html': '<p>hello</p>',
               'default.html': '<p>goodbye</p>'
            }
         } );
      } );

      afterEach( function () {
         preprocessor = null;
         mock.restore();
         data = null;
      } );

      it( 'should open up provided partial', function ( done ) {
         data.partial = "one";
         preprocessor.process( data )
            .then( function ( data ) {
               expect( data.partial ).to.equal( '<p>hello</p>' );
               done();
            } )
            .catch( function ( error ) {
               done( error );
            } )
      } );

      it( 'should open up default partial if not provided', function ( done ) {
         preprocessor.process( data )
            .then( function ( data ) {
               expect( data.partial ).to.equal( '<p>goodbye</p>' );
               done();
            } )
            .catch( function ( error ) {
               done( error );
            } )
      } );


   } );*/


} );
