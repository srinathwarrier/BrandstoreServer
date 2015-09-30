/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {view:'blank'},

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  '/home':'BrandController.chooseBrand',
  '/about':{ view:'pages/about'   },


  'get /choosebrand':'BrandController.chooseBrand',
  'get /brandupdate/:id':'BrandController.getupdatepage',
  'post /brandupdate': 'BrandController.myupdate',
  'get /getRecentAndPopularSuggestions':'TempController.getRecentAndPopularSuggestions',
  'get /getSuggestions':'TempController.getSuggestions',
  'get /getOutlets':'TempController.getOutlets',
  'get /getOutletDetails':'TempController.getOutletDetails',
  'get /getRelatedBrandOutlets':'TempController.getRelatedBrandOutlets',
  'get /admin': 'NgAdminController.index',


  /* Search Suggestions Routes */
  //'get /v2/getRecentAndPopularSuggestions':'V2Controller.getRecentAndPopularSuggestions',
  'get /v2/getSuggestions':'v2/SuggestionsController.getSuggestions',

  /* Outlet list Routes */
  'get /v2/getOutlets':'v2/OutletListController.getOutlets',
  'get /v2/getAllFavoriteOutlets' : 'v2/OutletListController.getAllFavoriteOutlets',
  'get /v2/getAllOnSaleOutlets' : 'v2/OutletListController.getAllOnSaleOutlets',
  'get /v2/getOutletsForTagId' : 'v2/OutletListController.getOutletsForTagId',
  'get /v2/getOutletsForCollectionId' : 'v2/OutletListController.getOutletsForCollectionId',

  /* Outlet details Routes*/
  'get /v2/getOutletDetails':'v2/OutletDetailsController.getOutletDetails',
  'get /v2/setFavoriteOutlet' : 'v2/OutletDetailsController.setFavoriteOutlet',
  //'get /v2/getRelatedBrandOutlets':'v2/OutletDetailsController.getRelatedBrandOutlets',

  /* TMT Routes */
  'get /v2/getTakeMeThereCommands' :'v2/TakeMeThereController.getTakeMeThereCommands',

  /* GCM Routes */
  'get /v2/updateRegID' : 'v2/NotificationsController.updateRegID',
  'get /v2/sendNotificationToAndroid' : 'v2/NotificationsController.sendNotificationToAndroid',

  /* Authentication Routes */
  'get /v2/forgotPassword' : 'v2/AuthController.forgotPassword',
  'get /v2/reset':'v2/AuthController.reset',
  'post /v2/setnewpassword' : 'v2/AuthController.setnewpassword',
  'get /v2/signup' : 'v2/AuthController.signup'






};
