describe( 'Services', function () {

   describe( 'WindowService', function () {

      var WIDTH = 200;
      var HEIGHT = 300;
      var window;
      beforeEach( module( "app.services" ) );

      beforeEach( function () {
         window = {innerWidth: WIDTH, innerHeight: HEIGHT};

         module( function ( $provide ) {
            $provide.value( '$window', window );
         } );

      } );

      it( 'should return the innerWidth value as its width', inject( function ( WindowService ) {
         expect( WindowService.width ).to.equal( WIDTH );
      } ) );

      it( 'should return the innerHeight value as its height', inject( function ( WindowService ) {
         expect( WindowService.height ).to.equal( HEIGHT );
      } ) );

      it( 'should return hasTouch false if ontouchstart is not defined', inject( function ( WindowService ) {
         expect( WindowService.hasTouch() ).to.be.false;
      } ) );

      it( 'should return hasTouch false if ontouchstart is not defined', inject( function ( WindowService ) {
         window.ontouchstart = "";
         expect( WindowService.hasTouch() ).to.be.true;
      } ) );

      it( 'should have a resize Signal', inject( function ( WindowService ) {
         expect( WindowService.resize ).to.be.instanceOf( signals.Signal );
      } ) );

      it( 'should dispatch changes of window dimensions', inject( function ( WindowService ) {

         var NEW_WIDTH = 500;
         var NEW_HEIGHT = 600;

         WindowService.resize.add(
            function ( w, h ) {
               expect( w ).to.equal( NEW_WIDTH );
               expect( h ).to.equal( NEW_HEIGHT );
            }
         );
         window.innerWidth = NEW_WIDTH;
         window.innerHeight = NEW_HEIGHT;
         window.onresize();

      } ) );


   } );

   describe( 'ImageSize', function () {

      var window;
      beforeEach( module( "app.services" ) );

      beforeEach( function () {
         window = {};

         module( function ( $provide ) {
            $provide.value( 'WindowService', window );
         } );

      } );

      it( 'should return 768 if width less then 768', inject( function ( ImageSize ) {
         window.width = 200;
         expect( ImageSize.getValue() ).to.equal( 768 );
      } ) );

      it( 'should return 992 if width less then 992', inject( function ( ImageSize ) {
         window.width = 800;
         expect( ImageSize.getValue() ).to.equal( 992 );
      } ) );

      it( 'should return 1200 if width less then 1200', inject( function ( ImageSize ) {
         window.width = 1000;
         expect( ImageSize.getValue() ).to.equal( 1200 );
      } ) );

      it( 'should return 768 by default', inject( function ( ImageSize ) {
         window.width = null;
         expect( ImageSize.getValue() ).to.equal( 768 );
      } ) );


   } );

   describe( 'API', function () {

      beforeEach( module( "app.services" ) );

      var $httpBackend;

      beforeEach( inject( function ( $injector ) {
         // Set up the mock http service responses
         $httpBackend = $injector.get( '$httpBackend' );
         $httpBackend.when( 'GET', '/api-book/myProject/myBook/768/' )
            .respond( {
               "success": true
            } );

         $httpBackend.when( 'GET', '/api-project/?projects=one,two&partial=three' )
            .respond( {
               "success": true
            } );

         $httpBackend.when( 'GET', '/api-project/?projects=one,two' )
            .respond( {
               "success": true
            } );

         $httpBackend.when( 'GET', '/api-project/?partial=three' )
            .respond( {
               "success": true
            } );

         $httpBackend.when( 'GET', '/api-project/' )
            .respond( {
               "success": true
            } );

      } ) );


      afterEach( function () {
         $httpBackend.verifyNoOutstandingExpectation();
         $httpBackend.verifyNoOutstandingRequest();
      } );


      it( 'should build the correct url, execute a GET and receive the response for getBook', inject( function ( API ) {

            var results;
            API.getBook( 'myProject', 'myBook' )
               .then( function ( data ) {
                  results = data;
               }
            );
            $httpBackend.flush();

            expect( results.success ).to.be.true;
         } )
      );

      it( 'should build the correct url, from params execute a GET and receive the response for getProject', inject( function ( API ) {

            var results;
            API.getProject( {projects:"one,two",partial:"three"} )
               .then( function ( data ) {
                  results = data;
               }
            );
            $httpBackend.flush();

            expect( results.success ).to.be.true;
         } )
      );

      it( 'should build the correct url, from just projects query', inject( function ( API ) {

            var results;
            API.getProject( {projects:"one,two"} )
               .then( function ( data ) {
                  results = data;
               }
            );
            $httpBackend.flush();

            expect( results.success ).to.be.true;
         } )
      );

      it( 'should build the correct url from just partial query', inject( function ( API ) {

            var results;
            API.getProject( {partial:"three"} )
               .then( function ( data ) {
                  results = data;
               }
            );
            $httpBackend.flush();

            expect( results.success ).to.be.true;
         } )
      );

      it( 'should build the correct url from empty query', inject( function ( API ) {

            var results;
            API.getProject( {} )
               .then( function ( data ) {
                  results = data;
               }
            );
            $httpBackend.flush();

            expect( results.success ).to.be.true;
         } )
      );

   } );


} )
;
