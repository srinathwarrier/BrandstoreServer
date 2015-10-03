/**
 * Created by I076324 on 9/23/2015.
 */

function calculateLeftRightClosestBridge(sourcePointer, pointer1, pointer2, pointer3, pointer4, bridgesArrayObject,outletArray,clBridgeOnLeft) {
  var closestBridgeOnLeft = clBridgeOnLeft;
  var closestBridgeOnRight = clBridgeOnLeft;
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

    response["closestRightBridge"] = bridgesArrayObject;
    response["closestLeftBridge"] = bridgesArrayObject;
    return response;
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
      resp = calculateLeftRightClosestBridge(sourcePointer,pointer1,pointer2,pointer3,pointer4,bridgesArray[0],outletArray,closestBridgeOnLeft);
    //var exitOutlet = outletArray[_.findIndex(outletArray, {outletID: resp.nearbyOutlet1ID})].pointerValue;
    //console.log("response - "+JSON.stringify(resp));
    if ((Math.abs(clpointer3) - Math.abs(sourcePointer)) < (Math.abs(clpointer2) - Math.abs(sourcePointer))) {
      //return closestBridgeOnLeft;
      //var exitOutlet = outletArray[_.findIndex(outletArray, {outletID: resp.closestLeftBridge.nearbyOutlet1ID})];
      console.log("exitOutlet"+JSON.stringify(resp.closestLeftBridge));
      jsonData["closestExit"] = resp.closestLeftBridge;
      jsonData["sourceExitDir"] = "left";
    }
    else {
      //return closestBridgeOnRight;
      //var exitOutlet = outletArray[_.findIndex(outletArray, {outletID: resp.closestRightBridge.nearbyOutlet1ID})];
      console.log("exitOutlet"+JSON.stringify(resp.closestRightBridge));
      jsonData["closestExit"] = resp.closestRightBridge;
      jsonData["sourceExitDir"] = "right";
    }
    console.log("response-"+JSON.stringify(resp));
    console.log("response-"+JSON.stringify(resp.closestRightBridge));
    console.log("response-"+JSON.stringify(jsonData));
    jsonData["bridgeIndexInBridgesArray"] = _.findIndex(bridgesArray, {outletID: jsonData.closestExit.transitID});
  }
  //if there are no bridges and only escalators
  if(bridgesArray == null ||bridgesArray.length == 0) {
  concole.log("there are no bridges and only escalators");
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

    resp = calculateLeftRightClosestBridge(sourcePointer,escpointer1,escpointer2,escpointer3,escpointer4,esc1,outletArray,closestBridgeOnLeft);
    if(resp.closestBridgeOnLeft != "") {
      jsonData["closestExit"] = resp.closestLeftBridge;
      jsonData["sourceExitDir"] = "left";
    }
    else if(resp.closestBridgeOnRight != "") {
      jsonData["closestExit"] = resp.closestRightBridge;
      jsonData["sourceExitDir"] = "right";
    }
    jsonData["bridgeIndexInBridgesArray"] = 0;
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
  if(firstDirection == destinationDirection) {
    return [
      'Exit "' + fromOutletname + '" and take a ' + firstDirection + '.',
      'Walk in the same Direction and continue for about ' + numberOfOutletsInBetween + ' outlets ',
      'Your destination : ' + toOutletName + ' would be on your ' + destinationDirection + '.'
    ];
  }
  else {
    return [
      'Exit "' + fromOutletname + '" go on the opposite Side of the mall .',
      'Take a ' + firstDirection + ' and continue in that Direction.  ',
      'Your destination : ' + toOutletName + ' would be on your ' + destinationDirection + '.'
    ];
  }
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

function getSameFloorOppositeSidesTemplate3 (fromOutletname, exitDir, outletsBetweenFromAndBridge, exitBridgeDir, outletsBetweenBridgeAndTo, toOutletName, toOutletDir,outletOppositeBridgeName) {
  //the from outlet does not have a bridge in front of it.
  if (exitDir != null) {
    return [
      'Exit "' + fromOutletname + '" on your ' + exitDir + ' .',
      'Go ahead about ' + outletsBetweenFromAndBridge + ' outlets and take the bridge near '+outletOppositeBridgeName+'.',
      'Cross the bridge and Exit on your ' + exitBridgeDir + ' and continue straight ',
      'Your destination ' + toOutletName + ' would be on your ' + toOutletDir + '.'
    ];
  }
  else {
    // destination is right in front of the bridge
    return [
      'Exit "' + fromOutletname + '" on your ' + exitDir + ' .',
      'Go ahead about ' + outletsBetweenFromAndBridge + ' outlets and take the bridge near '+outletOppositeBridgeName+'.',
      'Cross the bridge and your destination ' + toOutletName + ' shoule be stright ahead '];
  }
}


function getEscalatorIdUsingFromOutletID(hubTransitArray, floor1, zone1, pointer1) {
  console.log("in the method");
  if(zone1 != null)
    return _.find(hubTransitArray, {floorID: floor1, floorZoneID: zone1}); //TODO: Check if this escalator does go to floor2
  else
    return _.filter(hubTransitArray, {floorID: floor1});
}


module.exports = {

  getTakeMeThereCommands: function (req, res, connection) {
    var fromOutletID = parseInt(req.query.fromoutletid);
    var toOutletID = parseInt(req.query.tooutletid);
    if(fromOutletID != toOutletID) {
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
          //console.log("dir1:" + dir1);
          //calculating directions


          // find isGoingUp  and floorDiff
          var diff = Math.abs(floor2 - floor1);
          var isGoingUp = (floor1 < floor2) ? "up" : "down";
          console.log("diff:" + diff + " and isGoingUp:" + isGoingUp);
          console.log("1 more");
          // Find which escalator to use on floor1
          var esc1 = getEscalatorIdUsingFromOutletID(hubTransitArray, floor1, zone1, pointer1);

          console.log("Escalator 1:" + JSON.stringify(esc1));
          var esc1nearbyOutletName = _.find(allOutletsArray, {outletID: esc1.nearbyOutlet1ID}).outletName;
          var escName1 = esc1.escalatorName;

          var esc2 = _.find(hubTransitArray, {escalatorName: escName1, floorID: floor2});

          var response;

          if(esc2 != undefined || esc2 != null) {
          //the selected escalator goes to the destination floor
            console.log("Escalator 2:" + JSON.stringify(esc2));
            response = findTheClosestBridge(hubTransitArray, pointer1, pointer2,allOutletsArray,hubTransitArray);
          }
           else {
           //the given escalator <esc1> in that zone does not go to the destination floor.
           //iterate through all the escalators until you find the closest escalator <esc2> that goes to the destination floor.
            console.log("the escalator in that zone does not go to the destination floor");
            var allEscalatorsOnThatFloor =  getEscalatorIdUsingFromOutletID(hubTransitArray, floor1, null, pointer1);
            do {
              response = findTheClosestBridge(allEscalatorsOnThatFloor,pointer1,pointer2,allOutletsArray,null);
              escName1 = response.closestExit.escalatorName;
              esc2 = _.find(hubTransitArray, {escalatorName: escName1, floorID: floor2});
              console.log("all escalators - "+allEscalatorsOnThatFloor);
              //allEscalatorsOnThatFloor.splice(temp.bridgeIndexInBridgesArray,1);
              console.log("escalator index - "+response.bridgeIndexInBridgesArray);
              delete allEscalatorsOnThatFloor[response.bridgeIndexInBridgesArray];
            }
            while(esc2 == undefined || esc2 == null);
           }

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

                /* var response = findTheClosestBridge(hubTransitArray2, pointer1, pointer2,allOutletsArray,hubTransitArray);*/

                var closestBridge;
                /*if (response.closestExit == undefined || response.closestExit == null || response.closestExit.length == 0) {*/
                if (hubTransitArray2 == undefined || hubTransitArray2 == null || hubTransitArray2.length == 0) {
                  // there are no bridges so the user can directly go across
                  console.log("no bridges found");
                  var exitFromSourceDir;
                  var destinationDir;
                  if(pointer1 < 0 ) {
                    if (Math.abs(pointer2) > Math.abs(pointer1)) {
                      exitFromSourceDir = "left";
                      destinationDir = "right";
                    }
                    else {
                      exitFromSourceDir = "right";
                      destinationDir = "left";
                    }
                  }
                  else {
                    if (Math.abs(pointer2) > Math.abs(pointer1)) {
                      exitFromSourceDir = "right";
                      destinationDir = "left";
                    }
                    else {
                      exitFromSourceDir = "left";
                      destinationDir = "right";
                    }
                  }
                  returnValue = getSameFloorTemplateUsingValues(
                    name1, exitFromSourceDir, Math.abs(pointer1 - pointer2), name2, destinationDir);
                }
                else {
                  // there are bridges in that zone hence user needs to take the bridge
                  var outletOppositeBridgeName = null;
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
                        outletOppositeBridgeName = _.find(allOutletsArray, {outletID: closestBridge.nearbyOutlet3ID}).outletName;
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
                        outletOppositeBridgeName = _.find(allOutletsArray, {outletID: closestBridge.nearbyOutlet2ID}).outletName;
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
                        outletOppositeBridgeName = _.find(allOutletsArray, {outletID: closestBridge.nearbyOutlet4ID}).outletName;
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
                        outletOppositeBridgeName = _.find(allOutletsArray, {outletID: closestBridge.nearbyOutlet1ID}).outletName;
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
                      name1, exitDir, Math.abs(outletsBetweenFromAndBridge), exitBridgeDir, Math.abs(outletsBetweenBridgeAndTo), name2, destinationDir,outletOppositeBridgeName);
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
    }
    else {
      console.log("source and destination are same");
      res.json("Please choose a different Destination");
      return;
    }

  },


};
