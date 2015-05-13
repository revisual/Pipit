describe( 'Services', function () {

   describe( 'windowService', function () {

      var WIDTH = 200;
      var HEIGHT = 300;
      var window;
      beforeEach( angular.mock.module( "app.services" ) );

      beforeEach( function () {
         window = {innerWidth: WIDTH, innerHeight: HEIGHT};

         angular.mock.module( function ( $provide ) {
            $provide.value( '$window', window );
         } );

      } );

      it( 'should return the innerWidth value as its width', inject( function ( windowService ) {
         expect( windowService.width ).to.equal( WIDTH );
      } ) );

      it( 'should return the innerHeight value as its height', inject( function ( windowService ) {
         expect( windowService.height ).to.equal( HEIGHT );
      } ) );

      it( 'should return hasTouch false if ontouchstart is not defined', inject( function ( windowService ) {
         expect( windowService.hasTouch() ).to.be.false;
      } ) );

      it( 'should return hasTouch false if ontouchstart is not defined', inject( function ( windowService ) {
         window.ontouchstart = "";
         expect( windowService.hasTouch() ).to.be.true;
      } ) );

      it( 'should have a resize Signal', inject( function ( windowService ) {
         expect( windowService.resize ).to.be.instanceOf( signals.Signal );
      } ) );

      it( 'should dispatch changes of window dimensions', inject( function ( windowService ) {

         var NEW_WIDTH = 500;
         var NEW_HEIGHT = 600;

         windowService.resize.add(
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

   describe( 'imageSize', function () {

      var window;
      beforeEach( angular.mock.module( "app.services" ) );

      beforeEach( function () {
         window = {};

         angular.mock.module( function ( $provide ) {
            $provide.value( 'windowService', window );
         } );

      } );

      it( 'should return 768 if width less then 768', inject( function ( imageSize ) {
         window.width = 200;
         expect( imageSize.getValue() ).to.equal( 768 );
      } ) );

      it( 'should return 992 if width less then 992', inject( function ( imageSize ) {
         window.width = 800;
         expect( imageSize.getValue() ).to.equal( 992 );
      } ) );

      it( 'should return 1200 if width less then 1200', inject( function ( imageSize ) {
         window.width = 1000;
         expect( imageSize.getValue() ).to.equal( 1200 );
      } ) );

      it( 'should return 768 by default', inject( function ( imageSize ) {
         window.width = null;
         expect( imageSize.getValue() ).to.equal( 768 );
      } ) );


   } );

   describe( 'API', function () {

      beforeEach( angular.mock.module( "app.services" ) );

      var imageSize;
      beforeEach( function () {
         imageSize = {
            getValue: function () {
               return 100;
            }
         };

         angular.mock.module( function ( $provide ) {
            $provide.value( 'imageSize', imageSize );
         } );

      } );

      var $httpBackend;

      beforeEach( inject( function ( $injector ) {
         // Set up the mock http service responses
         $httpBackend = $injector.get( '$httpBackend' );
         $httpBackend.when( 'GET', '/api-book/myProject/myBook/' + imageSize.getValue() + '/' )
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
            API.getProject( {projects: "one,two", partial: "three"} )
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
            API.getProject( {projects: "one,two"} )
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
            API.getProject( {partial: "three"} )
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
