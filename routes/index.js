var router = require( 'express' ).Router();
var api = require( './api' )();
var home = require( './home' )();

/* GET home page. */
router.get( '/', home.index );
router.get( '/api/book/', api.book );
router.get( '/api/listProject/', api.listProjects );
router.get( '/api/project/', api.project );

module.exports = router;
