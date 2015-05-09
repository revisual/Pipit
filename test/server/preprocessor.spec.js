'use strict';
var expect = require( 'chai' ).expect;
var Promise = require( 'promise' );
var Processmap = (require( "../../scripts/preprocessor" ).PreProcessor);
var mock = require( 'mock-fs' );


describe( 'preprocessor', function () {


   var processmap;

   beforeEach( function () {
      processmap = new Processmap();
   } );

   afterEach( function () {
      processmap = null;
   } );

   it( 'should return an instance of a Promise', function () {
      expect( processmap.process( {} ) ).to.instanceof( Promise );
   } );

   it( 'should execute callbacks in order and pass process data', function ( done ) {

      var d = {};
      processmap
         .map( function ( data ) {
            data.test = [];
         } )
         .then( function ( data ) {
            data.test.push( 0 );
         } )
         .then( function ( data ) {
            data.test.push( 1 );
         } )
         .then( function ( data ) {
            data.test.push( 2 );
         } );

      processmap.process( d )
         .then( function ( data ) {
            expect( data ).to.equal( d );
            expect( data.test ).to.to.instanceof( Array );
            expect( data.test.length ).to.equal( 3 );
            expect( data.test[0] ).to.equal( 0 );
            expect( data.test[1] ).to.equal( 1 );
            expect( data.test[2] ).to.equal( 2 );
            done();
         } )
         .catch( function ( error ) {
            done( error );
         } );

   } );

   it( 'should only execute callbacks with truthful guards', function ( done ) {

      var d = {};
      processmap
         .map( function ( data ) {
            data.test = [];

         } )
         .butOnlyIf( function ( data ) {
            data.guards = [];
            return true;
         } )

         .then( function ( data ) {
            data.test.push( 0 );
         } )
         .butOnlyIf( function ( data ) {
            data.guards.push( 0 );
            return true;
         } )

         .then( function ( data ) {
            data.test.push( 1 );
         } )
         .butOnlyIf( function ( data ) {
            data.guards.push( 1 );
            return false;
         } )

         .then( function ( data ) {
            data.test.push( 2 );
         } )
         .butOnlyIf( function ( data ) {
            data.guards.push( 2 );
            return true;
         } );

      processmap.process( d )
         .then( function ( data ) {
            expect( data ).to.equal( d );
            expect( data.test ).to.instanceof( Array );
            expect( data.test.length ).to.equal( 2 );
            expect( data.test[0] ).to.equal( 0 );
            expect( data.test[1] ).to.equal( 2 );

            expect( data.guards ).to.instanceof( Array );
            expect( data.guards.length ).to.equal( 3 );
            done();
         } )
         .catch( function ( error ) {
            done( error );
         } );

   } );

   it( 'should  execute asynch callbacks', function ( done ) {

      var d = {};
      processmap

         .map( function ( data, complete ) {
            data.test = [];
            complete();
         } )

         .then( function ( data ) {
            data.test.push( 0 );
         } )

         .then( function ( data, complete ) {
            data.test.push( 1 );
            complete()
         } );


      processmap.process( d )

         .then( function ( data ) {
            expect( data ).to.equal( d );
            expect( data.test ).to.instanceof( Array );
            expect( data.test.length ).to.equal( 2 );
            expect( data.test[0] ).to.equal( 0 );
            expect( data.test[0] ).to.equal( 0 );
            done();
         } )

         .catch( function ( error ) {
            done( error );
         } );

   } );

   it( 'should  execute asynch callbacks with positive guards', function ( done ) {

      var d = {};
      processmap

         .map( function ( data, complete ) {
            data.test = [];
            complete();
         } )
         .butOnlyIf( function ( data ) {
            data.guards = [];
            return true;
         } )

         .then( function ( data ) {
            data.test.push( 0 );
         } )
         .butOnlyIf( function ( data ) {
            data.guards.push( 0 );
            return true;
         } )

         .then( function ( data, complete ) {
            data.test.push( 1 );
            complete()
         } )
         .butOnlyIf( function ( data ) {
            data.guards.push( 1 );
            return true;
         } );


      processmap.process( d )

         .then( function ( data ) {
            expect( data ).to.equal( d );
            expect( data.test ).to.instanceof( Array );
            expect( data.test.length ).to.equal( 2 );
            expect( data.test[0] ).to.equal( 0 );
            expect( data.test[1] ).to.equal( 1 );
            done();
         } )

         .catch( function ( error ) {
            done( error );
         } );

   } );

   it( 'should not execute asynch callbacks with negative guards', function ( done ) {

      var d = {};
      processmap

         .map( function ( data, complete ) {
            data.test = [];
            complete();
         } )
         .butOnlyIf( function ( data ) {
            data.guards = [];
            return true;
         } )

         .then( function ( data, complete ) {
            data.test.push( 0 );
            complete();
         } )
         .butOnlyIf( function ( data ) {
            data.guards.push( 0 );
            return false;
         } )

         .then( function ( data, complete ) {
            data.test.push( 1 );
            complete()
         } )
         .butOnlyIf( function ( data ) {
            data.guards.push( 1 );
            return true;
         } );


      processmap.process( d )

         .then( function ( data ) {
            expect( data ).to.equal( d );
            expect( data.test ).to.instanceof( Array );
            expect( data.test.length ).to.equal( 1 );
            expect( data.test[0] ).to.equal( 1 );
            done();
         } )

         .catch( function ( error ) {
            done( error );
         } );

   } );


} );
