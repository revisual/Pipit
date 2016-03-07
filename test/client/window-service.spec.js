describe( 'Services', function () {

   describe( 'windowService', function () {

      var WIDTH = 200;
      var HEIGHT = 300;
      var window;
      beforeEach( angular.mock.module( "window-service" ) );

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



} )
;
