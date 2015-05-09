ImageListLoader = function () {

   var Signal = signals.Signal;

   this.on = {
      progress: new Signal(),
      complete: new Signal(),
      resolve: new Signal(),
      removeAll: function () {
         this.progress.removeAll();
         this.complete.removeAll();
         this.resolve.removeAll();
      }
   };

   this.images = [];
   this.numberLoadedImages = 0;
   this.totalNumberImages = 0;

   var _files = [];
   var _filesWorking = [];

   var _errors = [];
   var _that = this;

   this.getImage = function () {
      return new Image();
   };

   this.add = function ( url ) {

      var type = typeof url;
      if (type === "string") {
         _files.push( url );
      }

      else if (type === "object" && url instanceof Array) {
         _files = _files.concat( url );
      }

      this.totalNumberImages = _files.length;
   };

   this.start = function () {
      _filesWorking = _files.slice();
      loadNext();
   };

   this.resetWith = function ( url ) {
      this.reset();
      this.add( url );
   };

   this.reset = function () {
      _filesWorking.length = 0;
      _files.length = 0;
      _that.images.length = 0;
      _errors.length = 0;
   }

   function loadNext() {

      var image = _that.getImage();

      var onload = function () {
         handleImageResult( image );
      }

      var onerror = function ( error ) {

         if (_errors === undefined) {
            _errors = [error];
         }
         else {
            _errors.push( error );
         }

         handleImageResult( image );
      }

      image.onload = onload;
      image.onerror = onerror;
      image.src = _filesWorking.shift();

   }

   function handleImageResult( image ) {
      image.onload = null;
      image.onerror = null;
      _that.images.push( image );

      _that.numberLoadedImages = _that.images.length;
      _that.on.resolve.dispatch( image, _that.numberLoadedImages - 1 );
      _that.on.progress.dispatch( _that.numberLoadedImages, _that.totalNumberImages );

      if (_filesWorking.length === 0) {
         _that.on.complete.dispatch();
      }

      else if (_filesWorking.length > 0) {
         loadNext();
      }
   }


}



