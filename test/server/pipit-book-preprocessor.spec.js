'use strict';
var expect = require( 'chai' ).expect;
var mock = require( 'mock-fs' );

var JSON_PATH = "json/";
var IMAGE_PATH = "images/";


describe( 'pipit book preprocessor', function () {

   describe( 'first iteration - project data loaded', function () {

      var preprocessor;
      var data;

      beforeEach( function () {
         preprocessor = require( "./../../scripts/pipit-book-preprocessor" )( JSON_PATH, IMAGE_PATH );
         data = {};
         mock( {
            'json/': {
               'one.json': '{"id":"one","content":[{"range": "0-79"},{"range": "0-30]}',
               'two.json': '{"id":"two"}',
               'three.json': '{"id":three"}',
               'default.json': '{"id":"default"}',
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

      it( 'should load in json data from project', function ( done ) {

         data.project = "two";
         preprocessor.process( data )
            .then( function ( data ) {
               expect( data.project.id ).to.equal( "two" );
               done();
            } )
            .catch( function ( error ) {
               done( error );
            } )
      } );

      it( 'should load in default json data if project not provided', function ( done ) {

         preprocessor.process( data )

            .then( function ( data ) {
               expect( data.project.id ).to.equal( "default" );
               done();
            } )

            .catch( function ( error ) {
               done( error );
            } )

      } );

   } );

   describe( 'second iteration - loading book data', function () {

      var preprocessor;
      var data;

      beforeEach( function () {
         preprocessor = require( "./../../scripts/pipit-book-preprocessor" )( JSON_PATH, IMAGE_PATH );
         data = {size: "large"};
         mock( {
            'json/': {
               'one.json': '{"id": "one","content": [{"id": "hello","range": "0-79"},{"id": "goodbye","range": "0-30"}]}',
               'two.json': '{"id":"two"}',
               'three.json': '{"id":three"}',
               'default.json': '{"id":"default"}',
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

      it( 'should load in json data from project', function ( done ) {

         data.project = "one";
         data.book = "hello";
         preprocessor.process( data )
            .then( function ( data ) {
               expect( data.book.range ).to.equal( "0-79" );
               done();
            } )
            .catch( function ( error ) {
               done( error );
            } )
      } );

      it( 'should add the image end point', function ( done ) {

         data.project = "one";
         data.book = "hello";
         preprocessor.process( data )
            .then( function ( data ) {
               expect( data.imagePath ).to.equal( IMAGE_PATH );
               done();
            } )
            .catch( function ( error ) {
               done( error );
            } )

      } );
      it( 'should build the image paths from the range data', function ( done ) {

         data.project = "one";
         data.book = "hello";
         preprocessor.process( data )
            .then( function ( data ) {
               expect( data.book.imageURLs ).to.instanceOf( Array );
               expect( data.book.imageURLs.length ).to.equal( 80 );
               expect( data.book.imageURLs[0] ).to.equal( "images/one/hello/large/00000.jpg" );
               expect( data.book.imageURLs[50] ).to.equal( "images/one/hello/large/00050.jpg" );
               done();
            } )
            .catch( function ( error ) {
               done( error );
            } )

      } );


   } );

} );
