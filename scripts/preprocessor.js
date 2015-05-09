module.exports.PreProcessor = function () {

   var Promise = require( 'promise' );
   var _this = this;
   var _processes = [];
   var _mapCount = 0;
   var _data;

   this.process = function ( data ) {
      _data = data;
      return new Promise( next );
   };

   var next = function ( resolve, reject ) {

      var mapping = _processes[_mapCount++];
      mapping.execute( _data, function () {

         if (_mapCount >= _processes.length) {
            resolve( _data );
            _data = null;
            _mapCount = 0;
         }

         else {
            next( resolve, reject );
         }
      } );


   };

   this.map = function ( process ) {
      var mapping = new PreProcessorMapping( process );
      _processes.push( mapping );
      return mapping;
   };

   argLenOf = function ( func ) {
      var s = func.toString();
      var first = s.indexOf( "(" );
      var last = s.indexOf( ")" );
      return s.slice( first + 1, last ).split( "," ).length;

   }


   var PreProcessorMapping = function ( process ) {

      this.process = process;
      this.guard = null;
      var _that = this;
      var _isAsync = ( argLenOf( process ) == 2 );

      this.butOnlyIf = function ( guard ) {
         _that.guard = guard;
         return _that;
      };

      this.then = function ( process ) {
         return _this.map( process );
      };

      this.execute = function ( data, next ) {

         if (_that.guard === null) {
            _that.process( data, (_isAsync) ? next : null );
         }

         else if (_that.guard( data )) {
            _that.process( data, ( _isAsync ) ? next : null );
         }

         else {
            next();
            return;
         }

         if (!_isAsync) {
            next();
         }


      }
   }

};
