describe( 'Directives', function () {

   describe( 'ImageOverlay', function () {

      var $compile,
         $rootScope,
         element;

      // Load the myApp module, which contains the directive
      beforeEach( module( 'app.directives' ) );

      // Store references to $rootScope and $compile
      // so they are available to all tests in this describe block
      beforeEach( inject( function ( _$compile_, _$rootScope_ ) {
         // The injector unwraps the underscores (_) from around the parameter names when matching
         $compile = _$compile_;
         $rootScope = _$rootScope_;
         element = $compile( "<image-overlay id='test'></image-overlay>" )( $rootScope );
         $rootScope.$digest();
      } ) );

      it( 'Adds setImage Method to scope', function () {
         expect( $rootScope.imageOverlay["setTestImage"] ).to.be.instanceOf( Function );
      } );

      it( 'Executing setImage Method applies url to background-image', function () {
         var URL = "myImage.jpg";
         $rootScope.imageOverlay["setTestImage"]( URL );
         expect( element.css( 'background-image' ) ).contains( URL );
         expect( element.css( 'opacity' ) ).to.equal( "" );
      } );

      it( 'Executing setImage Method with just opacity does not affect element', function () {
         var OPACITY = "0.5";
         $rootScope.imageOverlay["setTestImage"]( null, OPACITY );
         expect( element.css( 'background-image' ) ).to.equal( '' );
         expect( element.css( 'opacity' ) ).to.equal( OPACITY );
      } );

      it( 'Executing setImage Method with both values applys them', function () {
         var URL = "myImage.jpg";
         var OPACITY = "0.5";
         $rootScope.imageOverlay["setTestImage"]( URL,OPACITY );
         expect( element.css( 'background-image' ) ).contains( URL );
         expect( element.css( 'opacity' ) ).to.equal( OPACITY );
      } );

   } );

   /*  describe( 'flick-book', function () {

    var $compile,
    $rootScope,
    element;

    // Load the myApp module, which contains the directive
    beforeEach( module( 'app.directives' ) );

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach( inject( function ( _$compile_, _$rootScope_ ) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    element = $compile( "<flick-book base='bottom' overlay='top'><image-overlay id='bottom'></image-overlay><image-overlay id='top'></image-overlay></flick-book>" )( $rootScope );
    $rootScope.$digest();
    } ) );

    it( 'Adds setImage Method to scope', function () {
    expect( $rootScope["top"] ).to.be.instanceOf( Function );
    } );



    } );*/


} )
;
