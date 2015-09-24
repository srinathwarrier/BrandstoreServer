/**
 * Temp
 *
 * @description :: hub controller imported from localhost MySql server at 25/6/2015 13:9:43.
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

function testFunction(){

}

function getFloorNameFromFloorNumber(index) {
  var returnValue = "";
  switch (index) {
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
  return returnValue;
}

function calculateLeftRightClosestBridge(sourcePointer, pointer1, pointer2, pointer3, pointer4, bridgesArrayObject,outletArray,clBridgeOnLeft) {
  var closestBridgeOnLeft = "";
  var closestBridgeOnRight = "";
  console.log("source pointer "+sourcePointer );
  console.log(" pointer 1 "+pointer1 );
  console.log(" pointer 2 "+pointer2 );
  console.log(" pointer 3 "+pointer3 );
  console.log(" pointer 4 "+pointer4 );


  var clpointer1 = outletArray[_.findIndex(outletArray, {outletID: clBridgeOnLeft.nearbyOutlet1ID})].pointerValue;
  var clpointer2 = outletArray[_.findIndex(outletArray, {outletID: clBridgeOnLeft.nearbyOutlet2ID})].pointerValue;
  var clpointer3 = outletArray[_.findIndex(outletArray, {outletID: clBridgeOnLeft.nearbyOutlet3ID})].pointerValue;
  var clpointer4 = outletArray[_.findIndex(outletArray, {outletID: clBridgeOnLeft.nearbyOutlet4ID})].pointerValue;

  console.log("calculate left right method 1");
  console.log("bridge Object - "+JSON.stringify(bridgesArrayObject));
  var response ={};
  console.log("calculate left right method 2");
  if ((Math.abs(pointer2) >= Math.abs(sourcePointer) && Math.abs(pointer3) <= Math.abs(sourcePointer)) || (Math.abs(pointer1) >= Math.abs(sourcePointer) && Math.abs(pointer4) <= Math.abs(sourcePointer))) {// the outlet is in front of a bridge
    return bridgesArrayObject;
  }
  if (sourcePointer < 0) {
    if (pointer3 < sourcePointer) {
      if (Math.abs(clpointer3) - Math.abs(sourcePointer) > Math.abs(pointer3) - Math.abs(sourcePointer)) {
        closestBridgeOnLeft = bridgesArrayObject;
      }
    }
    if (pointer2 > sourcePointer) {
      if (Math.abs(clpointer2) - Math.abs(sourcePointer) > Math.abs(pointer2) - Math.abs(sourcePointer)) {
        closestBridgeOnRight = bridgesArrayObject;
      }
    }
  }
  else {
    if (pointer1 < sourcePointer) {
      if (Math.abs(clpointer1) - Math.abs(sourcePointer) > Math.abs(pointer1) - Math.abs(sourcePointer)) {
        closestBridgeOnLeft = bridgesArrayObject;
      }
    }
    if (pointer4 > sourcePointer) {
      if (Math.abs(clpointer4) - Math.abs(sourcePointer) > Math.abs(pointer4) - Math.abs(sourcePointer)) {
        closestBridgeOnRight = bridgesArrayObject;
      }
    }
  }
  response["closestRightBridge"] = closestBridgeOnRight;
  response["closestLeftBridge"] = closestBridgeOnLeft;
  console.log("calculate left right method exit");

  console.log("closest bridge on the left in method"+JSON.stringify(closestBridgeOnLeft));
  console.log("closest bridge on the right in method"+JSON.stringify(closestBridgeOnRight));

  console.log("response in method"+JSON.stringify(response));
  return response;
}

function findTheClosestBridge(bridgesArray, sourcePointer, destinationPointer, outletArray, hubArray) {
  var jsonData = {};
  var resp = null;


  if(bridgesArray.length>0) {
    var closestBridgeOnLeft = bridgesArray[0];
    var closestBridgeOnRight = bridgesArray[0];
    var pointer1 = outletArray[_.findIndex(outletArray, {outletID: bridgesArray[0].nearbyOutlet1ID})].pointerValue;
    var pointer2 = outletArray[_.findIndex(outletArray, {outletID: bridgesArray[0].nearbyOutlet2ID})].pointerValue;
    var pointer3 = outletArray[_.findIndex(outletArray, {outletID: bridgesArray[0].nearbyOutlet3ID})].pointerValue;
    var pointer4 = outletArray[_.findIndex(outletArray, {outletID: bridgesArray[0].nearbyOutlet4ID})].pointerValue;

    console.log("outlet array - " + JSON.stringify(outletArray));
    console.log("bridges array - " + JSON.stringify(bridgesArray));

    for (var x = 1; x < bridgesArray.length; x++) {

      pointer1 = outletArray[_.findIndex(outletArray, {outletID: bridgesArray[x].nearbyOutlet1ID})].pointerValue;
      pointer2 = outletArray[_.findIndex(outletArray, {outletID: bridgesArray[x].nearbyOutlet2ID})].pointerValue;
      pointer3 = outletArray[_.findIndex(outletArray, {outletID: bridgesArray[x].nearbyOutlet3ID})].pointerValue;
      pointer4 = outletArray[_.findIndex(outletArray, {outletID: bridgesArray[x].nearbyOutlet4ID})].pointerValue;

      var clpointer1 = outletArray[_.findIndex(outletArray, {outletID: closestBridgeOnLeft.nearbyOutlet1ID})].pointerValue;
      var clpointer2 = outletArray[_.findIndex(outletArray, {outletID: closestBridgeOnLeft.nearbyOutlet2ID})].pointerValue;
      var clpointer3 = outletArray[_.findIndex(outletArray, {outletID: closestBridgeOnLeft.nearbyOutlet3ID})].pointerValue;
      var clpointer4 = outletArray[_.findIndex(outletArray, {outletID: closestBridgeOnLeft.nearbyOutlet4ID})].pointerValue;

      /*var crpointer1 = outletArray[_.findIndex(outletArray, {outletID: closestBridgeOnRight.nearbyOutlet1ID})].pointerValue;
      var crpointer2 = outletArray[_.findIndex(outletArray, {outletID: closestBridgeOnRight.nearbyOutlet2ID})].pointerValue;
      var crpointer3 = outletArray[_.findIndex(outletArray, {outletID: closestBridgeOnRight.nearbyOutlet3ID})].pointerValue;
      var crpointer4 = outletArray[_.findIndex(outletArray, {outletID: closestBridgeOnRight.nearbyOutlet4ID})].pointerValue;*/

      /*if ((Math.abs(pointer2) >= Math.abs(sourcePointer) && Math.abs(pointer3) <= Math.abs(sourcePointer)) || (Math.abs(pointer1) >= Math.abs(sourcePointer) && Math.abs(pointer4) <= Math.abs(sourcePointer))) {// the outlet is in front of a bridge
        return bridgesArray[x];
      }

      if (sourcePointer < 0) {
        if (pointer3 < sourcePointer) {
          if (Math.abs(clpointer3) - Math.abs(sourcePointer) > Math.abs(pointer3) - Math.abs(sourcePointer)) {
            closestBridgeOnLeft = bridgesArray[x];
          }
        }
        if (pointer2 > sourcePointer) {
          if (Math.abs(clpointer2) - Math.abs(sourcePointer) > Math.abs(pointer2) - Math.abs(sourcePointer)) {
            closestBridgeOnRight = bridgesArray[x];
          }
        }
      }
      else {
        if (pointer1 < sourcePointer) {
          if (Math.abs(clpointer1) - Math.abs(sourcePointer) > Math.abs(pointer1) - Math.abs(sourcePointer)) {
            closestBridgeOnLeft = bridgesArray[x];
          }
        }
        if (pointer4 > sourcePointer) {
          if (Math.abs(clpointer4) - Math.abs(sourcePointer) > Math.abs(pointer4) - Math.abs(sourcePointer)) {
            closestBridgeOnRight = bridgesArray[x];
          }
        }
      }*/
      //console.log("calculate left right method base");
      resp = calculateLeftRightClosestBridge(sourcePointer,pointer1,pointer2,pointer3,pointer4,bridgesArray[x],outletArray,closestBridgeOnLeft);
    }
    if(bridgesArray.length == 1)
      resp = calculateLeftRightClosestBridge(sourcePointer,pointer1,pointer2,pointer3,pointer4,bridgesArray[0],outletArray);
    //var exitOutlet = outletArray[_.findIndex(outletArray, {outletID: resp.nearbyOutlet1ID})].pointerValue;
    //console.log("response - "+JSON.stringify(resp));
    if ((Math.abs(clpointer3) - Math.abs(sourcePointer)) < (Math.abs(clpointer2) - Math.abs(sourcePointer))) {
      //return closestBridgeOnLeft;
      //var exitOutlet = outletArray[_.findIndex(outletArray, {outletID: resp.closestLeftBridge.nearbyOutlet1ID})];
      console.log("exitOutlet"+JSON.stringify(closestBridgeOnLeft));
      jsonData["closestExit"] = closestBridgeOnLeft;
      jsonData["sourceExitDir"] = "left";
    }
    else {
      //return closestBridgeOnRight;
      //var exitOutlet = outletArray[_.findIndex(outletArray, {outletID: resp.closestRightBridge.nearbyOutlet1ID})];
      console.log("exitOutlet"+JSON.stringify(closestBridgeOnRight));
      jsonData["closestExit"] = closestBridgeOnRight;
      jsonData["sourceExitDir"] = "right";
    }
  }
  //if there are no bridges and only escalators
  if(bridgesArray == null ||bridgesArray.length == 0) {

    var fromIndex = _.findIndex(outletArray, {pointerValue: sourcePointer});
    var floor1 = outletArray[fromIndex].floorNumber;
    var zone1 = outletArray[fromIndex].floorZoneID;
    var esc1 = getEscalatorIdUsingFromOutletID(hubArray, floor1, zone1, sourcePointer);
    var esc1nearbyOutletName = _.find(outletArray, {outletID: esc1.nearbyOutlet1ID}).outletName;
    var escName1 = esc1.escalatorName;

    var escpointer1 = outletArray[_.findIndex(outletArray, {outletID: esc1.nearbyOutlet1ID})].pointerValue;
    var escpointer2 = outletArray[_.findIndex(outletArray, {outletID: esc1.nearbyOutlet2ID})].pointerValue;
    var escpointer3 = outletArray[_.findIndex(outletArray, {outletID: esc1.nearbyOutlet3ID})].pointerValue;
    var escpointer4 = outletArray[_.findIndex(outletArray, {outletID: esc1.nearbyOutlet4ID})].pointerValue;

    resp = calculateLeftRightClosestBridge(sourcePointer,escpointer1,escpointer2,escpointer3,escpointer4,esc1,outletArray);
    if(resp.closestBridgeOnLeft != "") {
      jsonData["closestExit"] = resp.closestLeftBridge;
      jsonData["sourceExitDir"] = "left";
    }
    else if(resp.closestBridgeOnRight != "") {
      jsonData["closestExit"] = resp.closestRightBridge;
      jsonData["sourceExitDir"] = "right";
    }
  }
  //console.log(close);

  return jsonData;
}

function getMeaningfulObjectFromOutlet(outletObject) {
  var returnObject = {};
  returnObject.floor = outletObject.floorNumber;
  returnObject.zone = outletObject.floorZoneID;
  returnObject.pointer = outletObject.pointerValue;
  returnObject.pointerSign = returnObject.pointer > 0 ? "plus" : "minus";
  returnObject.pointerWithoutSign = Math.abs(returnObject.pointer);
  return returnObject;
}

function isShorterDistanceToOutlet(outlet1, outlet2, destOutlet) {
  outlet1 = getMeaningfulObjectFromOutlet(outlet1),
    outlet2 = getMeaningfulObjectFromOutlet(outlet2),
    destOutlet = getMeaningfulObjectFromOutlet(destOutlet);

  //TODO : improve this algorithm with more information , currently uses only pointer

  var distanceToOutlet1 = Math.abs(outlet1.pointer - destOutlet.pointer);
  var distanceToOutlet2 = Math.abs(outlet2.pointer - destOutlet.pointer);
  var isShorter = (distanceToOutlet1 <= distanceToOutlet2);
}

function getDifferentFloorTemplateUsingValues(fromOutletname,
                                              firstDirection,
                                              outletNameNearEscalator,
                                              escalatorUpwardsOrDownwards,
                                              escalatorFloorCount,
                                              viaOutletName,
                                              toOutletName) {
  return [
    'Exit "' + fromOutletname + '" and take a ' + firstDirection + '.',
    'Reach the escalator near ' + outletNameNearEscalator + '.',
    'Take the escalator ' + escalatorUpwardsOrDownwards + ' by ' + escalatorFloorCount + ' floor.',
    'Take the path via ' + viaOutletName + '.',
    'Your destination : ' + toOutletName + ' would be on your ' + firstDirection + '.'
  ];

}

function getSameFloorTemplateUsingValues(fromOutletname,
                                         firstDirection,
                                         numberOfOutletsInBetween,
                                         toOutletName,
                                         destinationDirection) {
  return [
    'Exit "' + fromOutletname + '" and take a ' + firstDirection + '.',
    'Walk in the same Direction and continue for about ' + numberOfOutletsInBetween + ' outlets ',
    'Your destination : ' + toOutletName + ' would be on your ' + destinationDirection + '.'
  ];
}

function getSameFloorOppositeSidesTemplate1 (fromOutletname, exitBridgeDir, pendingOutletsToTravel, toOutletName, toOutletDir) {
  //the from outlet has a bridge right in front of it.
  return [
    'Exit "' + fromOutletname + '" and take a the bridge Ahead',
    'Cross the Bridge and Exit on your ' + exitBridgeDir + ' and continue straight ',
    'Your destination ' + toOutletName + ' would be on your ' + toOutletDir + '.'
  ];

}

function getSameFloorOppositeSidesTemplate2 (fromOutletname, toOutletName) {
  //the from outlet has a bridge right in front of it and the destination outlet is right on the other side of the bridge
  return [
    'Exit "' + fromOutletname + '" and take the bridge Ahead',
    'Cross the bridge and your destination ' + toOutletName + ' should be straight ahead '
  ];
}

function getSameFloorOppositeSidesTemplate3 (fromOutletname, exitDir, outletsBetweenFromAndBridge, exitBridgeDir, outletsBetweenBridgeAndTo, toOutletName, toOutletDir) {
  //the from outlet does not have a bridge in front of it.
  if (exitDir != null) {
    return [
      'Exit "' + fromOutletname + '" on your ' + exitDir + ' .',
      'Go ahead about ' + outletsBetweenFromAndBridge + ' outlets and take the bridge ahead.',
      'Cross the bridge and Exit on your ' + exitBridgeDir + ' and continue straight ',
      'Your destination ' + toOutletName + ' would be on your ' + toOutletDir + '.'
    ];
  }
  else {
    // destination is right in front of the bridge
    return [
      'Exit "' + fromOutletname + '" on your ' + exitDir + ' .',
      'Go ahead about ' + outletsBetweenFromAndBridge + ' outlets and take the bridge.',
      'Cross the bridge and your destination ' + toOutletName + ' shoule be stright ahead '];
  }
}


function getEscalatorIdUsingFromOutletID(hubTransitArray, floor1, zone1, pointer1) {
  return _.find(hubTransitArray, {floorID: floor1, floorZoneID: zone1}); //TODO: Check if this escalator does go to floor2
}

module.exports = {

  //getRecentAndPopularSuggestions - Pending to be converted to Sails


  getSuggestions: function (req, res, connection) {
    // 1) /getSuggestions?q=zara&userid=6
    var param = req.query.q;
    var userId = req.query.userid;
    if (userId == undefined) userId = 6;

    /*
     var queryString = "SELECT Outlet.outletID AS Id, Outlet.outletName AS name, \"outlet\" AS type FROM `Outlet` INNER JOIN `Brand` ON Outlet.ownedByBrandID = Brand.brandID INNER JOIN `BrandType` ON Brand.brandTypeID = BrandType.brandTypeID WHERE Brand.brandName LIKE CONCAT('%', '"+param+"' , '%') AND BrandType.active =1 AND Outlet.active = 1 "+
     "UNION ALL SELECT hubId, hubName, \"hub\" FROM `Hub` WHERE hubName LIKE CONCAT('%', '"+param+"', '%') "+
     "UNION ALL SELECT tagId, tagName, \"category\" FROM `Tag` WHERE tagName LIKE CONCAT('%', '"+param+"' , '%') AND Tag.active=1 ORDER BY type DESC;";
     console.log("query:"+queryString);
     Outlet.query(queryString, function (err,rows) {
     if (!err)
     {
     console.log("Success1"+JSON.stringify(rows));
     }
     else {
     console.log('Error1 while performing Query.' + err);
     }
     });
     */


    Outlet
      .find({select: ['outletID', 'outletName','active']})
      .where({outletName: {contains: param}})
      //.where({active: true})
      .sort('outletName')
      .then(function (outletArray) {
        // prepare the outletArray
        for (var outletIndex in outletArray) {
          if(outletArray[outletIndex].active){
            outletArray[outletIndex].type = "outlet";
          }
          else{
            outletArray[outletIndex].type = "others";
          }
          //outletArray[outletIndex].type = "outlet";
          outletArray[outletIndex].name = outletArray[outletIndex].outletName;
          outletArray[outletIndex].Id = outletArray[outletIndex].outletID;
          delete outletArray[outletIndex].outletID;
          delete outletArray[outletIndex].outletName;
          delete outletArray[outletIndex].active;
        }

        // get hubArray and prepare
        var hubArray = Hub.find({select: ['hubID', 'hubName']})
          .where({hubName: {contains: param}})
          .then(function (hubArray) {
            for (var hubIndex in hubArray) {
              hubArray[hubIndex].type = "hub";
              hubArray[hubIndex].name = hubArray[hubIndex].hubName;
              hubArray[hubIndex].Id = hubArray[hubIndex].hubID;
              delete hubArray[hubIndex].hubID;
              delete hubArray[hubIndex].hubName;
            }
            return hubArray;
          });

        //get tagArray and prepare
        var tagArray = Tag.find({select: ['tagID', 'tagName']})
          .where({tagName: {contains: param}})
          .then(function (tagArray) {
            for (var tagIndex in tagArray) {
              tagArray[tagIndex].type = "category";
              tagArray[tagIndex].name = tagArray[tagIndex].tagName;
              tagArray[tagIndex].Id = tagArray[tagIndex].tagID;
              delete tagArray[tagIndex].tagID;
              delete tagArray[tagIndex].tagName;
            }
            return tagArray;
          });
        return [outletArray, hubArray, tagArray];
      })
      .spread(function (outletArray, hubArray, tagArray) {
        var resultArray = outletArray.concat(hubArray, tagArray);
        return res.json(resultArray);
      })
      .catch(function (err) {
        if (err) {
          return res.serverError(err);
        }
      });


    // Add to the user interaction table : 4 is the userInteractionTypeID for Suggestion
    UserInteraction.create({
      userID: userId,
      userInteractionTypeID: 4,
      userInteractionLog: param
    }).exec(function (err, created) {
      if (err) {
        console.log('Error in creating interaction:' + JSON.stringify(err));
      }
      else {
        console.log('Created interaction:' + JSON.stringify(created));
      }
    });

  },


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

              obj.outletName = obj.brandName;

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


        /*        Outlet
         .find({outletID:_.pluck(rows[0],'outletID')})
         .populateAll()
         .then(function (outletArray) {
         console.log("inside");
         var userFavoriteArray = UserFavorite
         .find({select:['userID','outletID']})
         .where({'userID':userId , 'outletID':_.pluck(rows[0],'outletID')})// amongst these outlets , find the ones selected as Favourite by this user
         .then(function (userFavoriteArray) {
         return userFavoriteArray;
         });

         var isOnSaleArray = Offer
         .find({select:['outletID','active','offerID']})
         .where({outletID:_.pluck(rows[0],'outletID') , active:true})  // find active offers for these outlets
         .then(function (offerArray) {
         return offerArray;
         });
         return [outletArray, userFavoriteArray , isOnSaleArray];
         })
         .spread(function (outletArray , userFavoriteArray , isOnSaleArray) {
         console.log("userFavoriteArray:"+JSON.stringify (userFavoriteArray ));
         console.log("isOnSaleArray:"+JSON.stringify (isOnSaleArray ));

<<<<<<< HEAD
        /*        Outlet
         .find({outletID:_.pluck(rows[0],'outletID')})
         .populateAll()
         .then(function (outletArray) {
         console.log("inside");
         var userFavoriteArray = UserFavorite
         .find({select:['userID','outletID']})
         .where({'userID':userId , 'outletID':_.pluck(rows[0],'outletID')})// amongst these outlets , find the ones selected as Favourite by this user
         .then(function (userFavoriteArray) {
         return userFavoriteArray;
         });

         var isOnSaleArray = Offer
         .find({select:['outletID','active','offerID']})
         .where({outletID:_.pluck(rows[0],'outletID') , active:true})  // find active offers for these outlets
         .then(function (offerArray) {
         return offerArray;
         });
         return [outletArray, userFavoriteArray , isOnSaleArray];
         })
         .spread(function (outletArray , userFavoriteArray , isOnSaleArray) {
         console.log("userFavoriteArray:"+JSON.stringify (userFavoriteArray ));
         console.log("isOnSaleArray:"+JSON.stringify (isOnSaleArray ));

         // Add isFavorite to resultArray
         // Add isOnSale to resultArray

         function getResultObject(obj){

         // Change values

         var returnValue="";
         switch(obj.floorNumber){
         case '-1': returnValue = "Lower ground floor"; break;
         case '0': returnValue = "Ground floor";break;
         case '1': returnValue = "First floor";break;
         case '2': returnValue = "Second floor";break;
         default : returnValue = "";break;
         }
         obj.floorNumber = returnValue;
         obj.hubName = obj.hubID.hubName;

         // Check if isOnSaleArray has any objects for this outletID
         if( _.find(isOnSaleArray , { 'outletID' : obj.outletID}) ){
         obj.isOnSale = true;
         }else{
         obj.isOnSale = false;
         }

         console.log("outletID:"+obj.outletID +" and "+ (_.find(userFavoriteArray , { 'outletID' : obj.outletID})!=undefined) );
         // Check if userFavoriteArray has any objects for this outletID
         if( _.find(userFavoriteArray , { 'outletID' : obj.outletID}) !=undefined ){
         obj.isFavorite = true;
         }else{
         obj.isFavorite = false;
         }

         // Add new columns
=======
         // Add isFavorite to resultArray
         // Add isOnSale to resultArray

         function getResultObject(obj){

         // Change values

         var returnValue="";
         switch(obj.floorNumber){
         case '-1': returnValue = "Lower ground floor"; break;
         case '0': returnValue = "Ground floor";break;
         case '1': returnValue = "First floor";break;
         case '2': returnValue = "Second floor";break;
         default : returnValue = "";break;
         }
         obj.floorNumber = returnValue;
         obj.hubName = obj.hubID.hubName;

         // Check if isOnSaleArray has any objects for this outletID
         if( _.find(isOnSaleArray , { 'outletID' : obj.outletID}) ){
         obj.isOnSale = true;
         }else{
         obj.isOnSale = false;
         }

         console.log("outletID:"+obj.outletID +" and "+ (_.find(userFavoriteArray , { 'outletID' : obj.outletID})!=undefined) );
         // Check if userFavoriteArray has any objects for this outletID
         if( _.find(userFavoriteArray , { 'outletID' : obj.outletID}) !=undefined ){
         obj.isFavorite = true;
         }else{
         obj.isFavorite = false;
         }

         // Add new columns

>>>>>>> sumeetbranch

         // delete old names from obj
         delete obj.ownedByBrandID;
         delete obj.hubID;

<<<<<<< HEAD
         // delete old names from obj
         delete obj.ownedByBrandID;
         delete obj.hubID;
=======
>>>>>>> sumeetbranch





         return obj;
         }

<<<<<<< HEAD
         return obj;
         }

=======
>>>>>>> sumeetbranch
         var resultArray = _.map(outletArray , getResultObject );

         res.json(resultArray);
         })
         .catch();
         */
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


  getOutletDetails: function (req, res, connection) {
    // 3)  /getOutletDetails?id=100

    var id = req.query.id;
    var userId = req.query.userid;
    if (userId == undefined) userId = 6;
    var callProcedureString = "CALL `getOutletDetailsForOutletID` ( '" + userId + "' , '" + id + "' );";
    //var callFavoritesStrings = "CALL"
    Brand.query(callProcedureString, function (err, rows, fields) {
      if (!err) {
        console.log("rows:" + rows);
        var resultObj = rows[0][0];
        console.log("resultObj:" + JSON.stringify(resultObj));
        if (resultObj != undefined && resultObj) {
          switch (resultObj.floorNumber + "") {
            case '-1':
              resultObj.floorNumber = "Lower Ground Floor";
              break;
            case '0':
              resultObj.floorNumber = "Ground Floor";
              break;
            case '1':
              resultObj.floorNumber = "First Floor";
              break;
            case '2':
              resultObj.floorNumber = "Second Floor";
              break;
            default:
              break;
          }
        }

        if (resultObj != undefined && resultObj) {

          if (rows[1] != undefined) {
            resultObj.tagsArray = rows[1];
          }
          if (rows[2] != undefined) {
            resultObj.relatedBrandsArray = rows[2];
          }
          if (rows[3] != undefined) {
            resultObj.offersArray = rows[3];
          }
          if (rows[4] != undefined) {
            resultObj.outletDetails = rows[4];
          }


        }
        else {
          resultObj = {};
          resultObj = rows[4][0];
          resultObj.genderCodeString = "";

          resultObj.tagsArray = [];
          resultObj.relatedBrandsArray = [];
          resultObj.offersArray = [];
          console.log("getOutletDetails : floorNumber " + resultObj.floorNumber);
          switch (resultObj.floorNumber + "") {
            case '-1':
              resultObj.floorNumber = "Lower Ground Floor";
              break;
            case '0':
              resultObj.floorNumber = "Ground Floor";
              break;
            case '1':
              resultObj.floorNumber = "First Floor";
              break;
            case '2':
              resultObj.floorNumber = "Second Floor";
              break;
            default:
              break;
          }
        }
        console.log("getOutletDetails test : final " + JSON.stringify(resultObj));
        UserFavorite
          .find({select: ['userID', 'outletID']})
          .where({'userID': userId, 'outletID': id})// amongst these outlets , find the ones selected as Favourite by this user
          .exec(function (err, userFavoriteArray) {
            //console.log("getOutletDetails test : final2 "+JSON.stringify(userFavoriteArray));
            if (userFavoriteArray.length > 0)
              resultObj.isFavorite = true;
            else
              resultObj.isFavorite = false;
            res.json(resultObj);

          });


      }
      else {
        console.log('Error while performing Query.' + err);
        res.setHeader('Content-Type', 'text/html');
        res.send(err);
      }
    });
  },


  //getRelatedBrandOutlets

  getOutletsForQuery: function (req, res, connection) {
    // Required variables : [ query , userid ]
    // Optional variables : [ favorite=true , sale=true ,  ]
    // Currently optional should be required : []

    var query = req.query.q,
      userId = req.query.userid;
    if (userId == undefined) userId = 6;
    var callProcedureString = "";
    console.log("values- query " + query);


    if (query != undefined) {
      callProcedureString = "CALL `getOutletsByQuery` ( '" + userId + "' , '" + query + "'  );";
    }
    else {            //2b ) /getOutlets?id=20&type=category
      if (type == "category") {
        if (id.indexOf(',') == -1) {
          callProcedureString = "CALL `getOutletsByTagId` ( '" + userId + "' , '" + id + "' );";
        }
        else {
          callProcedureString = " CALL `getOutletsByTagIdArray` ( '" + userId + "' , '" + id + "' );";
        }
      }
      else {
        callProcedureString = " CALL `getOutletsByTagId` ( '" + userId + "' , 0 );";
      }
    }
    Brand.query(callProcedureString, function (err, rows, fields) {
      console.log("returned");
      if (!err) {
        console.log('The solution is: ', rows[0]);
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
        res.json(result);
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

  getTakeMeThereCommands: function (req, res, connection) {
    var fromOutletID = parseInt(req.query.fromoutletid);
    var toOutletID = parseInt(req.query.tooutletid);

    // fetch all details from Outlet & HubTransit
    // floor1 , zone1 , pointer1 ,
    // floor2 , zone2 , pointer2 ,

    Outlet.find({'outletId': [fromOutletID, toOutletID]})
      .then(function (outletArray) {

        var allOutletsArray = Outlet
          .find()
          .then(function (outletArray) {
            return outletArray;
          });

        var hubTransitArray = HubTransit
          .find()
          .where({transitType: "escalator"})
          .then(function (hubTransitArray) {
            return hubTransitArray;
          });
        return [outletArray, hubTransitArray, allOutletsArray];
      })
      .spread(function (outletArray, hubTransitArray, allOutletsArray) {
        // All values are available here. Rename properly for easier use
        var fromIndex = _.findIndex(outletArray, {outletID: fromOutletID});
        var toIndex = _.findIndex(outletArray, {outletID: toOutletID});

        var floor1 = outletArray[fromIndex].floorNumber,
          floor2 = outletArray[toIndex].floorNumber,
          zone1 = outletArray[fromIndex].floorZoneID,
          zone2 = outletArray[toIndex].floorZoneID,
          pointer1 = outletArray[fromIndex].pointerValue,
          pointer2 = outletArray[toIndex].pointerValue,
          name1 = outletArray[fromIndex].outletName,
          name2 = outletArray[toIndex].outletName
          ;


        // 1. Find out which template to use
        if (floor1 != floor2) {
          // use different floor template

          // find exitDirection from outlet1
          var dir1 = outletArray[fromIndex].turnDirectionToZoneEscalator;
          console.log("dir1:" + dir1);
          //calculating directions


          // find isGoingUp  and floorDiff
          var diff = Math.abs(floor2 - floor1);
          var isGoingUp = (floor1 < floor2) ? "up" : "down";
          console.log("diff:" + diff + " and isGoingUp:" + isGoingUp);

          // Find which escalator to use on floor1
          var esc1 = getEscalatorIdUsingFromOutletID(hubTransitArray, floor1, zone1, pointer1);

          console.log("Escalator 1:" + JSON.stringify(esc1));
          var esc1nearbyOutletName = _.find(allOutletsArray, {outletID: esc1.nearbyOutlet1ID}).outletName;
          var escName1 = esc1.escalatorName;

          var esc2 = _.find(hubTransitArray, {escalatorName: escName1, floorID: floor2});
          console.log("Escalator 2:" + JSON.stringify(esc2));

          // find the via outlet
          // get pointer value of the toOutlet.

          var nearbyOutlet1 = _.find(allOutletsArray, {outletID: esc2.nearbyOutlet1ID});
          var nearbyOutlet2 = _.find(allOutletsArray, {outletID: esc2.nearbyOutlet2ID});
          var nearbyOutlet3 = _.find(allOutletsArray, {outletID: esc2.nearbyOutlet3ID});
          var nearbyOutlet4 = _.find(allOutletsArray, {outletID: esc2.nearbyOutlet4ID});
          console.log("pointer2 :" + pointer2);
          console.log("nearbyOutlet1pointer :" + nearbyOutlet1.pointerValue);
          console.log("nearbyOutlet2pointer :" + nearbyOutlet2.pointerValue);
          console.log("nearbyOutlet3pointer :" + nearbyOutlet3.pointerValue);
          console.log("nearbyOutlet4pointer :" + nearbyOutlet4.pointerValue);

          var viaOutletName = "";
          if (pointer2 > 0) {
            // on the side of nearbyOutlet1ID and nearbyOutlet2ID
            //if(distanceToOutlet1 == distanceToOutlet2){  //TODO: check
            viaOutletName = ( isShorterDistanceToOutlet(nearbyOutlet1, nearbyOutlet2, outletArray[toIndex])  ) ? (nearbyOutlet1.outletName) : (nearbyOutlet2.outletName);

          } else {
            // on the side of nearbyOutlet3ID and nearbyOutlet4ID
            //if(distanceToOutlet1 == distanceToOutlet2){  //TODO: check
            viaOutletName = ( isShorterDistanceToOutlet(nearbyOutlet3, nearbyOutlet4, outletArray[toIndex])  ) ? (nearbyOutlet3.outletName) : (nearbyOutlet4.outletName);
          }

          var response = findTheClosestBridge(hubTransitArray, pointer1, pointer2,allOutletsArray,hubTransitArray);
          console.log("response of closest bridge - "+JSON.stringify(response));
          closestBridge = response.closestExit;
          var exitDir = response.sourceExitDir;
          console.log("1 id - "+closestBridge.nearbyOutlet1ID);

          var returnValue = getDifferentFloorTemplateUsingValues(
            name1, exitDir, esc1nearbyOutletName, isGoingUp, diff, viaOutletName, name2);

          console.log("returnValue:" + returnValue);
          res.json(returnValue);


        }
        else {
          // use same floor template
          var returnValue;
          //if shops are on the same side on the floor
          if ((pointer1 > 0 && pointer2 > 0) || (pointer1 < 0 && pointer2 < 0)) {
            if ((pointer1 > 0 && pointer2 > 0)) {
              //rights side of the mall
              if (pointer2 > pointer1)
                dir1 = "Right";
              else
                dir1 = "Left";
            }
            else {
              //left side of the mall
              if (pointer2 < pointer1)
                dir1 = "Left";
              else
                dir1 = "Right";
            }
            var diff2 = Math.abs(pointer1 - pointer2)
            returnValue = getSameFloorTemplateUsingValues(
              name1, dir1, diff2, name2, dir1);
            //console.log("returnValue:"+returnValue);
            res.json(returnValue);
          }
          else {
            //Opposite side of the mall
            HubTransit
              .find()
              .where({transitType: "bridge", floorID: floor1, floorZoneID: zone1})
              .then(function (hubTransitArray2) {
                //return hubTransitArray2;


                console.log("hub transit array:" + hubTransitArray2);

                var closestBridge;
                if (hubTransitArray2 == undefined || hubTransitArray2 == null || hubTransitArray2.length == 0) {
                  // there are no bridges so the user can directly go across
                  console.log("no bridges found");
                  var exitFromSourceDir;
                  var destinationDir;
                  if (Math.abs(pointer2) > Math.abs(pointer1)) {
                    exitFromSourceDir = "left";
                    destinationDir = "right";
                  }
                  else {
                    exitFromSourceDir = "right";
                    destinationDir = "left";
                  }
                  returnValue = getSameFloorTemplateUsingValues(
                    name1, exitFromSourceDir, Math.abs(pointer1 - pointer2), name2, destinationDir);
                }
                else {
                  // there are bridges in that zone hence user needs to take the bridge
                  var response = findTheClosestBridge(hubTransitArray2, pointer1, pointer2,allOutletsArray,hubTransitArray);
                  console.log("response of closest bridge - "+JSON.stringify(response));
                  closestBridge = response.closestExit;
                  console.log("1 id - "+closestBridge.nearbyOutlet1ID);

                  var cbpointer1 = allOutletsArray[_.findIndex(allOutletsArray, {outletID: closestBridge.nearbyOutlet1ID})].pointerValue;
                  var cbpointer2 = allOutletsArray[_.findIndex(allOutletsArray, {outletID: closestBridge.nearbyOutlet2ID})].pointerValue;
                  var cbpointer3 = allOutletsArray[_.findIndex(allOutletsArray, {outletID: closestBridge.nearbyOutlet3ID})].pointerValue;
                  var cbpointer4 = allOutletsArray[_.findIndex(allOutletsArray, {outletID: closestBridge.nearbyOutlet4ID})].pointerValue;

                  console.log("pointer1 - "+pointer1);
                  console.log("pointer2 - "+pointer2);
                  console.log("cbpointer1 - "+cbpointer1);
                  console.log("cbpointer2 - "+cbpointer2);
                  console.log("cbpointer3 - "+cbpointer3);
                  console.log("cbpointer4 - "+cbpointer4);


                  if (pointer1 == cbpointer1
                    || pointer1 == cbpointer2
                    || pointer1 == cbpointer3
                    || pointer1 == cbpointer4
                    || (Math.abs(pointer1) < Math.abs(cbpointer2) && Math.abs(pointer1) > Math.abs(cbpointer3))
                    || (Math.abs(pointer1) < Math.abs(cbpointer1) && Math.abs(pointer1) > Math.abs(cbpointer4))) {
                    console.log("source on the bridge");
                    // if the outlet is on the bridge or in between a bridge we can directly ask the user to go to the other side.
                    if(pointer1<0 && pointer2>0) {
                      console.log("source on the left and dest on the right");
                      var leftPointer = Math.abs(cbpointer1);
                      var rightPointer = Math.abs(cbpointer4);
                    }
                    else {
                      var leftPointer = Math.abs(cbpointer3);
                      var rightPointer = Math.abs(cbpointer2);
                    }
                      // var exitBridgeDirection;

                      if (leftPointer < pointer2) {
                        //the destination outlet is on the left after exiting the bridge
                        // exitBridgeDirection = "left"
                        returnValue = getSameFloorOppositeSidesTemplate1(
                          name1, "left", Math.abs(leftPointer - Math.abs(pointer2)), name2,"right");
                      }
                      else if (rightPointer > pointer2) {
                        //the destination outlet is on the right after exiting the bridge
                        //exitBridgeDirection = "right"
                        returnValue = getSameFloorOppositeSidesTemplate1(
                          name1, "right", Math.abs(Math.abs(pointer2) - rightPointer), name2,"left");
                      }
                      else if ((pointer2 < leftPointer && pointer2 > rightPointer)||pointer2 == leftPointer || pointer2 < rightPointer) {
                        //the destination is on the opposite end of the bridge
                        console.log("destination on the opposite side of bridge- source - " + name1+" destination - "+name2);
                        returnValue = getSameFloorOppositeSidesTemplate2(
                          name1, name2);
                      }


                  }
                  else {
                    // if from outlet is not in front of a bridge
                    var exitDir;
                    var outletsBetweenFromAndBridge;
                    var outletsBetweenBridgeAndTo;
                    var exitBridgeDir;
                    var destinationDir;
                    if (pointer1 < 0) {
                      //from outlet of the right side of the mall
                      if (Math.abs(cbpointer3) > Math.abs(pointer1)) {
                        exitDir = "left";
                        outletsBetweenFromAndBridge = Math.abs(cbpointer3) - Math.abs(pointer1);
                        console.log("outlets between the bridge and source - "+outletsBetweenFromAndBridge);
                        //if destination outlet is on the other end of the bridge
                        if ((Math.abs(pointer2) == Math.abs(cbpointer2))
                          || (Math.abs(pointer2) == Math.abs(cbpointer3))
                          || (Math.abs(pointer2) > Math.abs(cbpointer2) && (Math.abs(pointer2) < Math.abs(cbpointer3))))
                          exitBridgeDir = null;
                        else {
                          if (Math.abs(pointer2) < Math.abs(cbpointer2)) {
                            exitBridgeDir = "right";
                            outletsBetweenBridgeAndTo = Math.abs(cbpointer2) - Math.abs(pointer2);
                            destinationDir = "left";
                          }
                          else {
                            exitBridgeDir = "left";
                            outletsBetweenBridgeAndTo = Math.abs(cbpointer3) - Math.abs(pointer2);
                            destinationDir = "right";
                          }
                        }
                      }
                      else {
                        exitDir = "right";
                        outletsBetweenFromAndBridge = Math.abs(cbpointer4) - Math.abs(pointer1);
                        if ((Math.abs(pointer2) == Math.abs(cbpointer2))
                          || (Math.abs(pointer2) == Math.abs(cbpointer3))
                          || (Math.abs(pointer2) > Math.abs(cbpointer2) && (Math.abs(pointer2) < Math.abs(cbpointer3))))
                          exitBridgeDir = null;
                        else {
                          if (Math.abs(pointer2) < Math.abs(cbpointer2)) {
                            exitBridgeDir = "right";
                            outletsBetweenBridgeAndTo = Math.abs(cbpointer2) - Math.abs(pointer2);
                            destinationDir = "left";
                          }
                          else {
                            exitBridgeDir = "left";
                            outletsBetweenBridgeAndTo = Math.abs(cbpointer3) - Math.abs(pointer2);
                            destinationDir = "right";
                          }
                        }
                      }
                    }
                    else {
                      //from outlet on the left side of te mall
                      if (Math.abs(cbpointer4) > Math.abs(pointer1)) {
                        exitDir = "right";
                        outletsBetweenFromAndBridge = Math.abs(cbpointer2) - Math.abs(pointer1);
                        if ((Math.abs(pointer2) == Math.abs(cbpointer2))
                          || (Math.abs(pointer2) == Math.abs(cbpointer3))
                          || (Math.abs(pointer2) > Math.abs(cbpointer2) && (Math.abs(pointer2) < Math.abs(cbpointer3))))
                          exitBridgeDir = null;
                        else {
                          if (Math.abs(pointer2) < Math.abs(cbpointer1)) {
                            exitBridgeDir = "left";
                            outletsBetweenBridgeAndTo = Math.abs(cbpointer1) - Math.abs(pointer2);
                            destinationDir = "right";
                          }
                          else {
                            exitBridgeDir = "right";
                            outletsBetweenBridgeAndTo = Math.abs(cbpointer4) - Math.abs(pointer2);
                            destinationDir = "left";
                          }
                        }
                      }
                      else {
                        exitDir = "left";
                        outletsBetweenFromAndBridge = Math.abs(cbpointer3) - Math.abs(pointer1);
                        if ((Math.abs(pointer2) == Math.abs(cbpointer2))
                          || (Math.abs(pointer2) == Math.abs(cbpointer3))
                          || (Math.abs(pointer2) > Math.abs(cbpointer2) && (Math.abs(pointer2) < Math.abs(cbpointer3))))
                          exitBridgeDir = null;
                        else {
                          if (Math.abs(pointer2) < Math.abs(cbpointer1)) {
                            exitBridgeDir = "left";
                            outletsBetweenBridgeAndTo = Math.abs(cbpointer1) - Math.abs(pointer2);
                            destinationDir = "right";
                          }
                          else {
                            exitBridgeDir = "right";
                            outletsBetweenBridgeAndTo = Math.abs(cbpointer4) - Math.abs(pointer2);
                            destinationDir = "left";
                          }
                        }
                      }
                    }
                    returnValue = getSameFloorOppositeSidesTemplate3(
                      name1, exitDir, Math.abs(outletsBetweenFromAndBridge), exitBridgeDir, Math.abs(outletsBetweenBridgeAndTo), name2, destinationDir);
                  }
                }
                console.log("returnValue:" + returnValue);
                res.json(returnValue);
              });

          }

          //res.json({Error:"Still being developed"});
        }

        // 2. Call the template required with the input values
        // 3. Return the string array to the output

        // If floor1 == floor2


        return;//res.json({outletArray:outletArray,hubTransitArray:hubTransitArray})
      })
      .catch(function (err) {
        if (err) {
          return res.serverError(err);
        }
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


  /*


   // create the result array
   // Outlet > outletID,  outletName, ratingValue, phoneNumber , emailID , floorNumber
   // Offer > isOnSale
   // Brand > imageUrl , genderCodeString , , isOnSale ,
   // Hub > hubName
   // Tag > tagName
   // StaticAveragePrice > avgPrice.
   // .

   SELECT
   Brand.brandName, Brand.imageUrl,
   Outlet.ratingValue, Outlet.phoneNumber,
   Outlet.emailId , Outlet.floorNumber, Outlet.outletID ,
   avg.tagName, avg.avgPrice, Brand.genderCodeString,
   Hub.hubName ,
   floor(rand() * 10) % 2 AS isOnSale,
   floor(rand() * 10) % 2 AS isFavorite
   FROM Outlet
   INNER JOIN Hub ON Outlet.hubID = Hub.hubId
   INNER JOIN Brand ON Outlet.ownedByBrandID = Brand.brandID
   INNER JOIN StaticAveragePrices AS avg ON (Brand.brandID = avg.brandID )
   WHERE avg.tagID = tagID;
   */



  setFavoriteOutlet: function (req, res, connection) {
    // Required variables : [ (query) , (id,type=category) , (id[],type=category) ]
    // Optional variables : [ favorite=true , sale=true ,  ]
    // Currently optional should be required : [userid]

    var userID = req.query.userid,
      outletID = req.query.outletid,
      toBeSet = (req.query.set === 'true');

    if (toBeSet == undefined) {
      res.send({"Error": "The key 'set' is not sent as a parameter"});
    }

    if (toBeSet == true) {
      UserFavorite
        .findOrCreate({'userID': userID, outletID: outletID})
        .exec(function (err, created) {
          if (err) {
            res.send(err);
            return;
          }
          console.log("created:" + created);
          res.json(created);
        });
    } else if (toBeSet == false) {
      UserFavorite
        .destroy({'userID': userID, outletID: outletID})
        .exec(function (err, deleted) {
          if (err) {
            res.send(err);
            return;
          }
          console.log("deleted:" + JSON.stringify(deleted[0]));
          res.json();
        });
    }


  },

  updateRegID: function (req, res, connection) {
    //Required variables : userid , regid

    var userID = req.query.userid,
      regID = req.query.regid;

    User.update({userID: userID}, {regid: regID}).exec(function (err, updated) {
      if (err) {
        console.log("Error" + err);
        res.send(err);
      }
      console.log("Updated" + JSON.stringify(updated));
      res.json(updated);
    })

  },

  sendNotificationToAndroid: function (req, res, connection) {
    var msgValue = req.query.msg;

    var gcm = require('node-gcm');

    var message = new gcm.Message();

    message.addData('key1', msgValue);

    var regIds = ['APA91bH9Rgc8JJIPL1Uh2URIO7qF3PjmRhi55zY2S5OTUzJhEI-4VidecoRud_Tdfu-1_bADTG05Nem1CXefc-zzxL2Lud6KKD6pdhjPFKmf2LjRWlUxxFPCAAr4sbi310npUAYyzS_2'];

// Set up the sender with you API key
    var sender = new gcm.Sender('AIzaSyB6HVQ6Axi_EOIk1R9j-gSplBJYeRX3pG0');

//Now the sender can be used to send messages
    sender.send(message, regIds, function (err, result) {
      if (err) {
        console.error(err);
        res.send(err);
        return;
      }
      console.log(result);
      UserInteraction.create({
        userID:6,
        userInteractionTypeID:9, // 9 is gcmNotification
        userInteractionLog:JSON.stringify(result)
      }).exec(function(err,created){
        if(err){
          console.log('Error in creating interaction:' + JSON.stringify(err));
        }
        else{
          console.log('Created interaction:' + JSON.stringify(created));
        }
      });
      res.json(result);
    });

    //sender.sendNoRetry(message, regIds, function (err, result) {
    //  if(err) console.error(err);
    //  else    { console.log(result); res.json(result);}
    //});


  },

  forgotPassword : function(req,res,connection){

  },

  signup :function (req,res, connection){

    //"firstName="+firstName+"&emailid="+emailId+"&password="+password,

    var name = req.query.name,
      emailId  = req.query.emailid,
      password  = req.query.password,
      genderCode = req.query.gendercode,
      dob = req.query.dob;

    // validate details
    // valid Email
    // password min length
    // genderCode is M or F
    // .


    // Check if User with emailId exists.
    User
      .find({emailid:emailId})
      .exec(function(err,found){
        if(err){
          res.json({"responseState":"error","responseDetails":err});
        }
        if(found!=undefined && found.length && found.length > 0){
          res.json({"responseState":"error","responseDetails":"Email already exists."});
        }
        else{
          User
            .create({
              userRoleID : 1,
              name:name,
              emailid:emailId,
              password:password,
              genderCode : genderCode,
              dob:dob
            }).exec(function(err,created){
              if(err){
                console.log('Error in creating interaction:' + JSON.stringify(err));
                res.json({"responseState":"error","responseDetails":err});
              }
              else{
                console.log('Created interaction:' + JSON.stringify(created));
                res.json({"responseState":"created","responseDetails":created});
              }
            });
        }

    });






  },

  test:function(req,res,connection){

  }


};
