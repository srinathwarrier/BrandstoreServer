/**
 * Created by I076324 on 9/23/2015.
 */

function getFinalOutletArray(outletArray, theStaticAveragePricesArray, theUserFavoriteArray, isAllOnSale, isAllFavorite){
  var staticAveragePricesArray = theStaticAveragePricesArray;
  var userFavoriteArray = theUserFavoriteArray;

  function getResultObject(obj) {
    // Condition to find "isOnSale"
    // 1. offers array should not be empty or undefined
    // 2. Every offer should be active . i.e. every offer object's active property should be 'true'


    // Calculate avgPrice for the prominentTagID if present
    // 1. Check if prominentTagID is present
    // 2. Check if this brandID and this tagID is present in staticAveragePricesArray
    var avgPrice = "";
    if (obj.prominentTagID != undefined) {
      avgPrice = _.result(_.find(staticAveragePricesArray, {
        'brandID': obj.ownedByBrandID.brandID,
        'tagID': obj.prominentTagID.tagID
      }), 'avgPrice');
      if(avgPrice==undefined){
        avgPrice="";
      }
    }

    var returnValue = "";
    switch (obj.floorNumber + "") {
      case '-1':
        returnValue = "Lower ground floor";
        break;
      case '0':
        returnValue = "Ground floor";
        break;
      case '1':
        returnValue = "First floor";
        break;
      case '2':
        returnValue = "Second floor";
        break;
      default :
        returnValue = "";
        break;
    }
    obj.floorNumber = returnValue;

    var isFavorite = false;
    if(isAllFavorite){
      isFavorite = true;
    }
    else{
      if(_.find(userFavoriteArray, {'outletID': obj.outletID}) != undefined) { isFavorite = true;  }
      else {  isFavorite = false; }
    }

    var isOnSale = false;
    if(isAllOnSale){
      isOnSale = true;
    }
    else{
      isOnSale =( (obj.offers.length != 0 && _.contains(_.pluck(obj.offers, 'active'), true) ) ? true : false );
    }

    return {
      outletName: obj.outletName,
      imageUrl: obj.ownedByBrandID.imageUrl,
      ratingValue: obj.ratingValue,
      phoneNumber: obj.phoneNumber,
      emailId: obj.emailId,
      floorNumber: obj.floorNumber,
      outletID: obj.outletID,
      tagName: (obj.prominentTagID != undefined ? obj.prominentTagID.tagName : ""),
      genderCodeString: obj.ownedByBrandID.genderCodeString,
      hubName: obj.hubID.hubName,
      isOnSale: isOnSale,
      isFavorite: isFavorite,
      avgPrice: avgPrice
    };
  }

  return _.map(outletArray, getResultObject);

}

module.exports = {

  getOutlets: function (req, res, connection) {
    // Required variables : [ (query) , (id,type=category) , (id[],type=category) ]
    // Optional variables : [ favorite=true , sale=true ,  ]
    // Currently optional should be required : [userid]

    var query = req.query.q,
      tagid = req.query.tagid,
      type = req.query.type,
      userId = req.query.userid;
    if (userId == undefined) userId = 6;
    var callProcedureString = "";

    if (type == "tag") {
      if (tagid.indexOf(',') == -1) {
        callProcedureString = "CALL `getOutletsByTagId` ( '" + userId + "' , '" + tagid + "' );";
      }
      else {
        callProcedureString = " CALL `getOutletsByTagIdArray` ( '" + userId + "' , '" + tagid + "' );";
      }
    } else if (type == "query") {
      callProcedureString = "CALL `getOutletsByQuery` ( '" + userId + "' , '" + query + "'  );";
    } else {
      callProcedureString = " CALL `getOutletsByTagId` ( '" + userId + "' , 0 );";
    }

    Brand.query(callProcedureString, function (err, rows, fields) {
      console.log("returned");
      if (!err) {
        console.log('The solution is: ', rows[0]);

        // 1. Here you have the outlet list. Only values left are isOnSale and isFavorite
        // These values need to be fetched from the tables : Offer and UserFavorite.


        var result = rows[0];
        for (index = 0; index < result.length; ++index) {
          switch (result[index].floorNumber + "") {
            case '-1':
              result[index].floorNumber = "Lower Ground Floor";
              break;
            case '0':
              result[index].floorNumber = "Ground Floor";
              break;
            case '1':
              result[index].floorNumber = "First Floor";
              break;
            case '2':
              result[index].floorNumber = "Second Floor";
              break;
            default:
              break;
          }
          //console.log("rows[index].floorNumber : "+rows[index].floorNumber);
        }
        UserFavorite
          .find({select: ['userID', 'outletID']})
          .where({'userID': userId, 'outletID': _.pluck(result, 'outletID')})// amongst these outlets , find the ones selected as Favourite by this user
          .then(function (userFavoriteArray) {

            var isOnSaleArray = Offer
              .find({select: ['outletID', 'active', 'offerID']})
              .where({outletID: _.pluck(result, 'outletID'), active: true})  // find active offers for these outlets
              .then(function (offerArray) {
                return offerArray;
              });
            return [userFavoriteArray, isOnSaleArray];
          })
          .spread(function (userFavoriteArray, isOnSaleArray) {

            function getResultObject(obj) {
              // Check if isOnSaleArray has any objects for this outletID
              if (_.find(isOnSaleArray, {'outletID': obj.outletID})) {
                obj.isOnSale = true;
              }
              else {
                obj.isOnSale = false;
              }

              // Check if userFavoriteArray has any objects for this outletID
              if (_.find(userFavoriteArray, {'outletID': obj.outletID}) != undefined) {
                obj.isFavorite = true;
              }
              else {
                obj.isFavorite = false;
              }

              //obj.outletName = obj.brandName;

              return obj;
            }

            console.log("userFavoriteArray:" + JSON.stringify(userFavoriteArray));
            console.log("isOnSaleArray:" + JSON.stringify(isOnSaleArray));
            console.log("result:" + JSON.stringify(result));

            var resultArray = _.map(result, getResultObject);
            //var resultArray = outletArray;
            res.json(resultArray);

          })
          .catch(function (err) {
            res.send(err);
          });
      }
      else {
        console.log('Error while performing Query.' + err);
        console.log('Query value:' + query + "and id : " + id);
        console.log('callProcedureString:' + callProcedureString);
        res.setHeader('Content-Type', 'text/html');
        res.send(err);
      }
    });
  },


  getOutletsForCollectionId: function (req, res, connection) {
    // Required variables : id , userid
    // Optional variables : [ favorite=true , sale=true ,  ]

    var collectionid = req.query.collectionid,
      userId = req.query.userid;
    if (userId == undefined) userId = 6;

    Collection
      .find()
      .where({collectionID:collectionid})
      .populateAll()
      .exec(function (err, collectionArray) {
        if (err) {
          res.json(err);
          return;
        }
        if(collectionArray.length==0){
          res.json({Error:"Invalid collectionid"});
          return;
        }
        var outletIdArray = _.pluck(_.sortBy(collectionArray[0].outletAssignment, 'sortOrderIndex'), 'outletID');

        Outlet
          .find({outletID: outletIdArray})
          .populateAll()
          .then(function (outletArray) {

            var staticAveragePricesArray = StaticAveragePrices
              .find({select: ['brandID', 'tagID', 'avgPrice']})
              .where({brandID: _.pluck(_.pluck(outletArray, 'ownedByBrandID'), 'brandID')})
              .then(function (staticAveragePricesArray) {
                return staticAveragePricesArray;
              });
            var userFavoriteArray = UserFavorite
              .find({select: ['userID', 'outletID']})
              .where({'userID': userId, 'outletID': outletIdArray})// amongst these outlets , find the ones selected as Favourite by this user
              .then(function (userFavoriteArray) {
                return userFavoriteArray;
              });

            return [outletArray, staticAveragePricesArray, userFavoriteArray]
          })
          .spread(function (outletArray, staticAveragePricesArray, userFavoriteArray) {
            var resultArray = getFinalOutletArray(outletArray, staticAveragePricesArray , userFavoriteArray , false , false);

            var resultArraySorted = _.sortBy(resultArray , function(obj){
              return _.indexOf(outletIdArray, obj.outletID )
            });
            res.json(resultArraySorted);
          });

      });

  },


  getAllFavoriteOutlets: function (req, res, connection) {
    // input : userID
    var userid = req.query.userid;
    // output : outletArray
    // Logic : From UserFavorite table, fetch the whole list of outletIDs , inner join it with the outlet table

    UserFavorite
      .find({select: ['outletID']})
      .where({userID: userid})
      .exec(function (err, outletIdObjectArray) {
        if (err) {
          console.log("Error:" + err);
          return;
        }

        var outletIdArray = _.pluck(outletIdObjectArray, 'outletID'); // using LoDash


        Outlet
          .find({outletID: outletIdArray})
          .populateAll()
          .then(function (outletArray) {

            var staticAveragePricesArray = StaticAveragePrices
              .find({select:['brandID','tagID','avgPrice']})
              .where({brandID: _.pluck(_.pluck(outletArray,'ownedByBrandID'),'brandID')})
              .then(function (staticAveragePricesArray) {
                return staticAveragePricesArray;
              });

            return [outletArray, staticAveragePricesArray]
          })
          .spread(function (outletArray, staticAveragePricesArray) {
            if (err) {
              console.log("Error inside" + err);
              res.json({error: err});
            }

            console.log("outletArray:" + JSON.stringify(outletArray));
            console.log("staticAveragePricesArray:" + JSON.stringify(staticAveragePricesArray));

            function getResultObject(obj) {
              // Condition to find "isOnSale"
              // 1. offers array should not be empty or undefined
              // 2. Every offer should be active . i.e. every offer object's active property should be 'true'


              // Calculate avgPrice for the prominentTagID if present
              // 1. Check if prominentTagID is present
              // 2. Check if this brandID and this tagID is present in staticAveragePricesArray
              var avgPrice = "";
              if (obj.prominentTagID != undefined) {
                avgPrice = _.result(_.find(staticAveragePricesArray, {
                  'brandID': obj.ownedByBrandID.brandID,
                  'tagID': obj.prominentTagID.tagID
                }), 'avgPrice');
                if(avgPrice == undefined){
                  avgPrice = "";
                }
              }
              var returnValue = "";
              switch (obj.floorNumber + "") {
                case '-1':
                  returnValue = "Lower ground floor";
                  break;
                case '0':
                  returnValue = "Ground floor";
                  break;
                case '1':
                  returnValue = "First floor";
                  break;
                case '2':
                  returnValue = "Second floor";
                  break;
                default :
                  returnValue = "";
                  break;
              }
              obj.floorNumber = returnValue;


              return {
                outletName: obj.outletName,
                imageUrl: obj.ownedByBrandID.imageUrl,
                ratingValue: obj.ratingValue,
                phoneNumber: obj.phoneNumber,
                emailId: obj.emailId,
                floorNumber: obj.floorNumber,
                outletID: obj.outletID,
                tagName: (obj.prominentTagID != undefined ? obj.prominentTagID.tagName : ""),
                genderCodeString: obj.ownedByBrandID.genderCodeString,
                hubName: obj.hubID.hubName,
                isOnSale: ( (obj.offers.length != 0 && _.contains(_.pluck(obj.offers, 'active'), true) ) ? true : false ),
                isFavorite: true,
                avgPrice: avgPrice
              };
            }

            var resultArray = _.map(outletArray, getResultObject);
            console.log("result:" + JSON.stringify(resultArray));

            res.json(resultArray);

          })
          .catch(function (err) {
            if (err) {
              return res.serverError(err);
            }
          });


      });

  },

  getAllOnSaleOutlets: function (req, res, connection) {
    // input : userID
    var userid = req.query.userid;

    // output : outletArray
    // Logic : From Offer table, fetch the whole list of outletIDs , inner join it with the outlet table

    Offer
      .find({select: ['outletID']})
      .where({active: true})
      .exec(function (err, outletIdObjectArray) {
        if (err) {
          console.log("Error:" + err);
          return;
        }

        var outletIdArray = _.pluck(outletIdObjectArray, 'outletID'); // using LoDash


        Outlet
          .find({outletID: outletIdArray})
          .populateAll()
          .then(function (outletArray) {

            var staticAveragePricesArray = StaticAveragePrices
              .find({select: ['brandID', 'tagID', 'avgPrice']})
              .where({brandID: _.pluck(_.pluck(outletArray, 'ownedByBrandID'), 'brandID')})
              .then(function (staticAveragePricesArray) {
                return staticAveragePricesArray;
              });
            var userFavoriteArray = UserFavorite
              .find({select: ['userID', 'outletID']})
              .where({'userID': userid, 'outletID': outletIdArray})// amongst these outlets , find the ones selected as Favourite by this user
              .then(function (userFavoriteArray) {
                return userFavoriteArray;
              });

            return [outletArray, staticAveragePricesArray, userFavoriteArray]
          })
          .spread(function (outletArray, staticAveragePricesArray, userFavoriteArray) {
            if (err) {
              console.log("Error inside" + err);
              res.json({error: err});
            }

            console.log("outletArray:" + JSON.stringify(outletArray));
            console.log("staticAveragePricesArray:" + JSON.stringify(staticAveragePricesArray));
            console.log("userFavoriteArray:" + JSON.stringify(userFavoriteArray));

            function getResultObject(obj) {
              // Condition to find "isOnSale"
              // 1. offers array should not be empty or undefined
              // 2. Every offer should be active . i.e. every offer object's active property should be 'true'


              // Calculate avgPrice for the prominentTagID if present
              // 1. Check if prominentTagID is present
              // 2. Check if this brandID and this tagID is present in staticAveragePricesArray
              var avgPrice = "";
              if (obj.prominentTagID != undefined) {
                avgPrice = _.result(_.find(staticAveragePricesArray, {
                  'brandID': obj.ownedByBrandID.brandID,
                  'tagID': obj.prominentTagID.tagID
                }), 'avgPrice');
                if(avgPrice==undefined){
                  avgPrice="";
                }
              }

              var isFavorite = false;
              if (_.find(userFavoriteArray, {'outletID': obj.outletID}) != undefined) {
                isFavorite = true;
              }
              else {
                isFavorite = false;
              }

              var returnValue = "";
              switch (obj.floorNumber + "") {
                case '-1':
                  returnValue = "Lower ground floor";
                  break;
                case '0':
                  returnValue = "Ground floor";
                  break;
                case '1':
                  returnValue = "First floor";
                  break;
                case '2':
                  returnValue = "Second floor";
                  break;
                default :
                  returnValue = "";
                  break;
              }
              obj.floorNumber = returnValue;


              return {
                outletName: obj.outletName,
                imageUrl: obj.ownedByBrandID.imageUrl,
                ratingValue: obj.ratingValue,
                phoneNumber: obj.phoneNumber,
                emailId: obj.emailId,
                floorNumber: obj.floorNumber,
                outletID: obj.outletID,
                tagName: (obj.prominentTagID != undefined ? obj.prominentTagID.tagName : ""),
                genderCodeString: obj.ownedByBrandID.genderCodeString,
                hubName: obj.hubID.hubName,
                isOnSale: true,
                isFavorite: isFavorite,
                avgPrice: avgPrice
              };
            }

            var resultArray = _.map(outletArray, getResultObject);
            console.log("result:" + JSON.stringify(resultArray));

            res.json(resultArray);

          })
          .catch(function (err) {
            if (err) {
              return res.serverError(err);
            }
          });


      });

  },

  getOutletsForTagId: function (req, res, connection) {
    // Required variables : id , userid
    // Optional variables : [ favorite=true , sale=true ,  ]

    var query = req.query.q,
      id = req.query.id,
      type = req.query.type,
      userId = req.query.userid;
    if (userId == undefined) userId = 6;
    var callProcedureString = "";
    console.log("values- query " + query + " id " + id + " type " + type);


    if (query != undefined) {
      callProcedureString = "CALL `getOutletsByQuery` ( '" + userId + "' , '" + query + "'  );";
    }
    else {            //2b ) /getOutlets?id=20&type=category
      if (id.indexOf(',') == -1) {
        callProcedureString = "CALL `getOutletsByTagId` ( '" + userId + "' , '" + id + "' );";
      }
      else {
        callProcedureString = " CALL `getOutletsByTagIdArray` ( '" + userId + "' , '" + id + "' );";
      }
    }
    Brand.query(callProcedureString, function (err, rows, fields) {
      if (!err) {
        //console.log('The solution is: ', rows[0]);

        // 1. Here you have the outlet list. Only values left are isOnSale and isFavorite
        // These values need to be fetched from the tables : Offer and UserFavorite.


        var result = rows[0];
        for (index = 0; index < result.length; ++index) {
          switch (result[index].floorNumber + "") {
            case '-1':
              result[index].floorNumber = "Lower Ground Floor";
              break;
            case '0':
              result[index].floorNumber = "Ground Floor";
              break;
            case '1':
              result[index].floorNumber = "First Floor";
              break;
            case '2':
              result[index].floorNumber = "Second Floor";
              break;
            default:
              break;
          }
          //console.log("rows[index].floorNumber : "+rows[index].floorNumber);
        }

        UserFavorite
          .find({select: ['userID', 'outletID']})
          .where({'userID': userId, 'outletID': _.pluck(result, 'outletID')})// amongst these outlets , find the ones selected as Favourite by this user
          .then(function (userFavoriteArray) {

            var isOnSaleArray = Offer
              .find({select: ['outletID', 'active', 'offerID']})
              .where({outletID: _.pluck(result, 'outletID'), active: true})  // find active offers for these outlets
              .then(function (offerArray) {
                return offerArray;
              });
            return [userFavoriteArray, isOnSaleArray];
          })
          .spread(function (userFavoriteArray, isOnSaleArray) {

            function getResultObject(obj) {
              // Check if isOnSaleArray has any objects for this outletID
              if (_.find(isOnSaleArray, {'outletID': obj.outletID})) {
                obj.isOnSale = true;
              }
              else {
                obj.isOnSale = false;
              }

              // Check if userFavoriteArray has any objects for this outletID
              if (_.find(userFavoriteArray, {'outletID': obj.outletID}) != undefined) {
                obj.isFavorite = true;
              }
              else {
                obj.isFavorite = false;
              }

              return obj;
            }

            console.log("userFavoriteArray:" + JSON.stringify(userFavoriteArray));
            console.log("isOnSaleArray:" + JSON.stringify(isOnSaleArray));
            console.log("result:" + JSON.stringify(result));

            var resultArray = _.map(result, getResultObject);
            //var resultArray = outletArray;
            res.json(resultArray);

          })
          .catch(function (err) {
            res.send(err);
          });

      }
      else {
        console.log('Error while performing Query.' + err);
        console.log('Query value:' + query + "and id : " + id);
        console.log('callProcedureString:' + callProcedureString);
        res.setHeader('Content-Type', 'text/html');
        res.send(err);
      }
    });
  },

  test2:function(req,res,connection){
    return "from test2";
  },

  test3:function(){
    return "from test3";
  },


};
