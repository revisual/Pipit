describe( 'Services', function () {

   describe( 'API', function () {

      beforeEach( angular.mock.module( "pipit-api" ) );


      var $httpBackend;

      beforeEach( inject( function ( $injector ) {
         // Set up the mock http service responses
         $httpBackend = $injector.get( '$httpBackend' );
         $httpBackend.when( 'GET', '/api/book?id=myBook&size=imageSize' )
            .respond( {
               "success": true
            } );

         $httpBackend.when( 'GET', '/api/project?id=projectID' )
            .respond( {
               "success": true
            } );

         $httpBackend.when( 'GET', '/api/presets' )
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
            API.getBook( 'myBook', 'imageSize' )
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
            API.getProject( 'projectID' )
               .then( function ( data ) {
                     results = data;
                  }
               );
            $httpBackend.flush();

            expect( results.success ).to.be.true;
         } )
      );

      it( 'should request the correct url, execute a GET and receive the response for getPresets', inject( function ( API ) {
             // note this service is mocked up at the mo and does not call the db
            var results;
            API.getPresets( true )
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
