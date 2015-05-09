'use strict';
var expect = require( 'chai' ).expect;
var mock = require( 'mock-fs' );

var PARTIAL_PATH = "partial/";


describe( 'pipit index preprocessor', function () {


   var preprocessor;
   var data;

   beforeEach( function () {
      preprocessor = require( "./../../scripts/pipit-index-preprocessor" )( PARTIAL_PATH );
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


} );
