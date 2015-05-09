var router = require( 'express' ).Router();
var api = require( './api' )();
var home = require( './home' )();

/* GET home page. */
router.get( '/', home.index );
router.get( '/api-book/:project/:book/:size', api.book );
router.get( '/api-project/', api.projects );

module.exports = router;
