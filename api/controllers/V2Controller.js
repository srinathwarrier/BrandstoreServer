/**
 * Temp
 *
 * @description :: hub controller imported from localhost MySql server at 25/6/2015 13:9:43.
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


function getFloorNameFromFloorNumber(index){
  var returnValue = "";
  switch(index){
    case '-1': returnValue = "Lower ground floor"; break;
    case '0': returnValue = "Ground floor";break;
    case '1': returnValue = "First floor";break;
    case '2': returnValue = "Second floor";break;
    default : returnValue = "";break;
  }
  return returnValue;
}

function getMeaningfulObjectFromOutlet(outletObject){
  var returnObject = {};
  returnObject.floor = outletObject.floorNumber;
  returnObject.zone = outletObject.floorZoneID;
  returnObject.pointer = outletObject.pointerValue;
  returnObject.pointerSign = returnObject.pointer > 0 ? "plus" : "minus";
  returnObject.pointerWithoutSign = Math.abs(returnObject.pointer);
  return returnObject;
}

function isShorterDistanceToOutlet(outlet1, outlet2 , destOutlet){
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
                                              viaOutletName ,
                                              toOutletName ){
  return [
    'Exit "'+fromOutletname+'" and take a '+firstDirection+'.',
    'Reach the escalator near '+outletNameNearEscalator+'.',
    'Take the escalator '+escalatorUpwardsOrDownwards +' by '+escalatorFloorCount+' floor.',
    'Take the path via '+viaOutletName+'.',
    'Your destination : '+toOutletName+' would be on your '+firstDirection +'.'
  ];
}

function getSameFloorTemplateUsingValues(fromOutletname,
                                              firstDirection,
                                         numberOfOutletsInBetween,
                                              toOutletName ){
  return [
    'Exit "'+fromOutletname+'" and take a '+firstDirection+'.',
    'Walk in the same Direction and cross '+numberOfOutletsInBetween+' outlets ',
    'Your destination : '+toOutletName+' would be on your '+firstDirection+'.'
  ];
}

function getEscalatorIdUsingFromOutletID(hubTransitArray, floor1,zone1,pointer1){
  return _.find(hubTransitArray , {floorID : floor1, floorZoneID:zone1}); //TODO: Check if this escalator does go to floor2
}

module.exports = {

  //getRecentAndPopularSuggestions - Pending to be converted to Sails


  getSuggestions : function(req, res,connection) {
    // 1) /getSuggestions?q=zara&userid=6
    var param = req.query.q;
    var userId = req.query.userid;
    if(userId==undefined) userId = 6;

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
      .find({select:['outletID','outletName']})
      .where({outletName:{contains:param}})
      .where({active:true})
      .sort('outletName')
      .then(function (outletArray) {
        // prepare the outletArray
        for(var outletIndex in outletArray){
          outletArray[outletIndex].type="outlet";
          outletArray[outletIndex].name=outletArray[outletIndex].outletName;
          outletArray[outletIndex].Id=outletArray[outletIndex].outletID;
          delete outletArray[outletIndex].outletID;
          delete outletArray[outletIndex].outletName;
        }

        // get hubArray and prepare
        var hubArray = Hub.find({select:['hubID','hubName']})
          .where({hubName:{contains:param}})
          .then(function (hubArray) {
            for(var hubIndex in hubArray){
              hubArray[hubIndex].type="hub";
              hubArray[hubIndex].name=hubArray[hubIndex].hubName;
              hubArray[hubIndex].Id=hubArray[hubIndex].hubID;
              delete hubArray[hubIndex].hubID;
              delete hubArray[hubIndex].hubName;
            }
            return hubArray;
          });

        //get tagArray and prepare
        var tagArray = Tag.find({select:['tagID','tagName']})
          .where({tagName:{contains:param}})
          .then(function (tagArray) {
            for(var tagIndex in tagArray){
              tagArray[tagIndex].type="category";
              tagArray[tagIndex].name=tagArray[tagIndex].tagName;
              tagArray[tagIndex].Id=tagArray[tagIndex].tagID;
              delete tagArray[tagIndex].tagID;
              delete tagArray[tagIndex].tagName;
            }
            return tagArray;
          });
        return [outletArray , hubArray,tagArray];
      })
      .spread(function(outletArray , hubArray,tagArray){
        var resultArray = outletArray.concat(hubArray , tagArray);
        return res.json(resultArray);
      })
      .catch(function(err) {
        if (err) {
          return res.serverError(err);
        }
      });


    // Add to the user interaction table : 4 is the userInteractionTypeID for Suggestion
    UserInteraction.create({
      userID:userId,
      userInteractionTypeID:4,
      userInteractionLog:param
    }).exec(function(err,created){
      if(err){
        console.log('Error in creating interaction:' + JSON.stringify(err));
      }
      else{
        console.log('Created interaction:' + JSON.stringify(created));
      }
    });

  },



  getOutlets : function(req, res, connection) {
    // Required variables : [ (query) , (id,type=category) , (id[],type=category) ]
    // Optional variables : [ favorite=true , sale=true ,  ]
    // Currently optional should be required : [userid]

    var query = req.query.q,
      tagid = req.query.tagid ,
      type= req.query.type,
      userId = req.query.userid;
    if(userId==undefined) userId = 6;
    var callProcedureString = "";

    if(type=="tag"){
      if (tagid.indexOf(',') == -1)
      {
        callProcedureString= "CALL `getOutletsByTagId` ( '"+userId+"' , '"+tagid+"' );" ;
      }
      else
      {
        callProcedureString= " CALL `getOutletsByTagIdArray` ( '"+userId+"' , '"+tagid+"' );" ;
      }
    }else if (type=="query"){
      callProcedureString = "CALL `getOutletsByQuery` ( '"+userId+"' , '"+query+"'  );" ;
    }else{
      callProcedureString= " CALL `getOutletsByTagId` ( '"+userId+"' , 0 );" ;
    }

    Brand.query(callProcedureString, function(err, rows, fields) {
      console.log("returned");
      if (!err)
      {
        console.log('The solution is: ', rows[0]);

        // 1. Here you have the outlet list. Only values left are isOnSale and isFavorite
        // These values need to be fetched from the tables : Offer and UserFavorite.


        var result = rows[0];
        for (index = 0; index < result.length; ++index) {
          switch(result[index].floorNumber+"")
          {
            case '-1': result[index].floorNumber="Lower Ground Floor"; break;
            case '0':  result[index].floorNumber="Ground Floor";       break;
            case '1':  result[index].floorNumber="First Floor";        break;
            case '2':  result[index].floorNumber="Second Floor";       break;
            default: break;
          }
          //console.log("rows[index].floorNumber : "+rows[index].floorNumber);
        }
        UserFavorite
          .find({select:['userID','outletID']})
          .where({'userID':userId , 'outletID':_.pluck(result,'outletID')})// amongst these outlets , find the ones selected as Favourite by this user
          .then(function (userFavoriteArray) {

            var isOnSaleArray = Offer
              .find({select:['outletID','active','offerID']})
              .where({outletID:_.pluck(result,'outletID') , active:true})  // find active offers for these outlets
              .then(function (offerArray) {
                return offerArray;
              });
            return [userFavoriteArray,isOnSaleArray];
          })
          .spread(function (userFavoriteArray , isOnSaleArray) {

            function getResultObject(obj){
              // Check if isOnSaleArray has any objects for this outletID
              if( _.find(isOnSaleArray , { 'outletID' : obj.outletID}) ){  obj.isOnSale = true;}
              else{ obj.isOnSale = false;      }

              // Check if userFavoriteArray has any objects for this outletID
              if( _.find(userFavoriteArray , { 'outletID' : obj.outletID}) !=undefined ){   obj.isFavorite = true;   }
              else { obj.isFavorite = false;  }

              obj.outletName = obj.brandName;

              return obj;
            }
            console.log("userFavoriteArray:"+JSON.stringify (userFavoriteArray ));
            console.log("isOnSaleArray:"+JSON.stringify (isOnSaleArray));
            console.log("result:"+JSON.stringify (result));

            var resultArray = _.map(result , getResultObject );
            //var resultArray = outletArray;
            res.json(resultArray);

          })
          .catch(function(err){
            res.send(err);
          });
      }
      else{
        console.log('Error while performing Query.'+err);
        console.log('Query value:'+query + "and id : "+id);
        console.log('callProcedureString:'+callProcedureString);
        res.setHeader('Content-Type', 'text/html');
        res.send(err );
      }
    });
  },


  getOutletsForTagId : function(req, res, connection) {
    // Required variables : id , userid
    // Optional variables : [ favorite=true , sale=true ,  ]

    var query = req.query.q,
      id = req.query.id ,
      type= req.query.type,
      userId = req.query.userid;
    if(userId==undefined) userId = 6;
    var callProcedureString = "";
    console.log("values- query "+query+" id "+id+" type "+type);


    if(query!=undefined){
      callProcedureString = "CALL `getOutletsByQuery` ( '"+userId+"' , '"+query+"'  );" ;
    }
    else {            //2b ) /getOutlets?id=20&type=category
      if (id.indexOf(',') == -1)
      {
        callProcedureString= "CALL `getOutletsByTagId` ( '"+userId+"' , '"+id+"' );" ;
      }
      else
      {
        callProcedureString= " CALL `getOutletsByTagIdArray` ( '"+userId+"' , '"+id+"' );" ;
      }
    }
    Brand.query(callProcedureString, function(err, rows, fields) {
      if (!err)
      {
        //console.log('The solution is: ', rows[0]);

        // 1. Here you have the outlet list. Only values left are isOnSale and isFavorite
        // These values need to be fetched from the tables : Offer and UserFavorite.



        var result = rows[0];
        for (index = 0; index < result.length; ++index) {
          switch(result[index].floorNumber+"")
          {
            case '-1': result[index].floorNumber="Lower Ground Floor"; break;
            case '0':  result[index].floorNumber="Ground Floor";       break;
            case '1':  result[index].floorNumber="First Floor";        break;
            case '2':  result[index].floorNumber="Second Floor";       break;
            default: break;
          }
          //console.log("rows[index].floorNumber : "+rows[index].floorNumber);
        }

        UserFavorite
          .find({select:['userID','outletID']})
          .where({'userID':userId , 'outletID':_.pluck(result,'outletID')})// amongst these outlets , find the ones selected as Favourite by this user
          .then(function (userFavoriteArray) {

            var isOnSaleArray = Offer
              .find({select:['outletID','active','offerID']})
              .where({outletID:_.pluck(result,'outletID') , active:true})  // find active offers for these outlets
              .then(function (offerArray) {
                return offerArray;
              });
            return [userFavoriteArray,isOnSaleArray];
          })
          .spread(function (userFavoriteArray , isOnSaleArray) {

            function getResultObject(obj){
              // Check if isOnSaleArray has any objects for this outletID
              if( _.find(isOnSaleArray , { 'outletID' : obj.outletID}) ){  obj.isOnSale = true;}
              else{ obj.isOnSale = false;      }

              // Check if userFavoriteArray has any objects for this outletID
              if( _.find(userFavoriteArray , { 'outletID' : obj.outletID}) !=undefined ){   obj.isFavorite = true;   }
              else { obj.isFavorite = false;  }

              return obj;
            }
            console.log("userFavoriteArray:"+JSON.stringify (userFavoriteArray ));
            console.log("isOnSaleArray:"+JSON.stringify (isOnSaleArray));
            console.log("result:"+JSON.stringify (result));

            var resultArray = _.map(result , getResultObject );
            //var resultArray = outletArray;
            res.json(resultArray);

          })
          .catch(function(err){
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


              // delete old names from obj
              delete obj.ownedByBrandID;
              delete obj.hubID;






              return obj;
            }

            var resultArray = _.map(outletArray , getResultObject );

            res.json(resultArray);
          })
          .catch();
          */
      }
      else{
        console.log('Error while performing Query.'+err);
        console.log('Query value:'+query + "and id : "+id);
        console.log('callProcedureString:'+callProcedureString);
        res.setHeader('Content-Type', 'text/html');
        res.send(err );
      }
    });
  },


  getOutletDetails : function(req, res,connection) {
    // 3)  /getOutletDetails?id=100

    var id = req.query.id;
    var userId = req.query.userid;
    if(userId==undefined) userId = 6;
    var callProcedureString= "CALL `getOutletDetailsForOutletID` ( '"+userId+"' , '"+id+"' );" ;
    //var callFavoritesStrings = "CALL"
    Brand.query(callProcedureString, function(err, rows, fields) {
      if (!err)
      {
        console.log("rows:"+rows);
        var resultObj = rows[0][0];
        console.log("resultObj:"+JSON.stringify(resultObj));
        if(resultObj!=undefined && resultObj)
        {
          switch(resultObj.floorNumber+"")
          {
            case '-1': resultObj.floorNumber="Lower Ground Floor"; break;
            case '0':  resultObj.floorNumber="Ground Floor";       break;
            case '1':  resultObj.floorNumber="First Floor";        break;
            case '2':  resultObj.floorNumber="Second Floor";       break;
            default: break;
          }
        }

        if(resultObj!=undefined && resultObj)
        {

          if(rows[1]!=undefined){
            resultObj.tagsArray=rows[1];
          }
          if(rows[2]!=undefined){
            resultObj.relatedBrandsArray=rows[2];
          }
          if(rows[3]!=undefined){
            resultObj.offersArray=rows[3];
          }
          if(rows[4]!=undefined){
            resultObj.outletDetails=rows[4];
          }


        }
        else{
          resultObj={};
          resultObj=rows[4][0];
          resultObj.genderCodeString="";

          resultObj.tagsArray=[];
          resultObj.relatedBrandsArray=[];
          resultObj.offersArray=[];
          console.log("getOutletDetails : floorNumber "+resultObj.floorNumber);
          switch(resultObj.floorNumber+"")
          {
            case '-1': resultObj.floorNumber="Lower Ground Floor"; break;
            case '0':  resultObj.floorNumber="Ground Floor";       break;
            case '1':  resultObj.floorNumber="First Floor";        break;
            case '2':  resultObj.floorNumber="Second Floor";       break;
            default: break;
          }
        }
        console.log("getOutletDetails test : final "+JSON.stringify(resultObj));
        UserFavorite
          .find({select:['userID','outletID']})
          .where({'userID':userId , 'outletID':id})// amongst these outlets , find the ones selected as Favourite by this user
          .exec(function (err, userFavoriteArray) {
            //console.log("getOutletDetails test : final2 "+JSON.stringify(userFavoriteArray));
            if(userFavoriteArray.length >0)
              resultObj.isFavorite = true;
            else
              resultObj.isFavorite = false;
            res.json(resultObj);

          });


      }
      else{
        console.log('Error while performing Query.'+err);
        res.setHeader('Content-Type', 'text/html');
        res.send(err );
      }
    });
  },


  //getRelatedBrandOutlets

  getOutletsForQuery : function(req, res, connection) {
    // Required variables : [ query , userid ]
    // Optional variables : [ favorite=true , sale=true ,  ]
    // Currently optional should be required : []

    var query = req.query.q,
      userId = req.query.userid;
    if(userId==undefined) userId = 6;
    var callProcedureString = "";
    console.log("values- query "+query);


    if(query!=undefined){
      callProcedureString = "CALL `getOutletsByQuery` ( '"+userId+"' , '"+query+"'  );" ;
    }
    else {            //2b ) /getOutlets?id=20&type=category
      if(type=="category"){
        if (id.indexOf(',') == -1)
        {
          callProcedureString= "CALL `getOutletsByTagId` ( '"+userId+"' , '"+id+"' );" ;
        }
        else
        {
          callProcedureString= " CALL `getOutletsByTagIdArray` ( '"+userId+"' , '"+id+"' );" ;
        }
      }
      else{
        callProcedureString= " CALL `getOutletsByTagId` ( '"+userId+"' , 0 );" ;
      }
    }
    Brand.query(callProcedureString, function(err, rows, fields) {
      console.log("returned");
      if (!err)
      {
        console.log('The solution is: ', rows[0]);
        var result = rows[0];
        for (index = 0; index < result.length; ++index) {
          switch(result[index].floorNumber+"")
          {
            case '-1': result[index].floorNumber="Lower Ground Floor"; break;
            case '0':  result[index].floorNumber="Ground Floor";       break;
            case '1':  result[index].floorNumber="First Floor";        break;
            case '2':  result[index].floorNumber="Second Floor";       break;
            default: break;
          }
          //console.log("rows[index].floorNumber : "+rows[index].floorNumber);
        }
        res.json(result);
      }
      else{
        console.log('Error while performing Query.'+err);
        console.log('Query value:'+query + "and id : "+id);
        console.log('callProcedureString:'+callProcedureString);
        res.setHeader('Content-Type', 'text/html');
        res.send(err );
      }
    });
  },



  getTakeMeThereCommands:function(req,res,connection){
    var fromOutletID = parseInt(req.query.fromoutletid);
    var toOutletID = parseInt(req.query.tooutletid);

    // fetch all details from Outlet & HubTransit
    // floor1 , zone1 , pointer1 ,
    // floor2 , zone2 , pointer2 ,

    Outlet.find({'outletId':[fromOutletID ,toOutletID]})
      .then(function(outletArray){

        var allOutletsArray =     Outlet
          .find()
          .then(function(outletArray){
              return outletArray;
          });

        var hubTransitArray = HubTransit
          .find()
          .where({transitType: "escalator"})
          .then(function(hubTransitArray){
            return hubTransitArray;
        });
        return [outletArray,hubTransitArray , allOutletsArray];
      })
      .spread(function(outletArray,hubTransitArray , allOutletsArray){
        // All values are available here. Rename properly for easier use
        var fromIndex = _.findIndex(outletArray,{outletID:fromOutletID});
        var toIndex = _.findIndex(outletArray,{outletID:toOutletID});

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
        if(floor1 != floor2){
          // use different floor template

          // find exitDirection from outlet1
          var dir1 = outletArray[fromIndex].turnDirectionToZoneEscalator;
          console.log("dir1:"+dir1);
          //calculating directions



          // find isGoingUp  and floorDiff
          var diff = Math.abs(floor2 - floor1);
          var isGoingUp = (floor1 < floor2)?"up":"down";
          console.log("diff:"+diff + " and isGoingUp:"+isGoingUp);

          // Find which escalator to use on floor1
          var esc1= getEscalatorIdUsingFromOutletID(hubTransitArray, floor1, zone1, pointer1);

          console.log("Escalator 1:"+JSON.stringify(esc1));
          var esc1nearbyOutletName = _.find(allOutletsArray , {outletID : esc1.nearbyOutlet1ID}).outletName;
          var escName1 = esc1.escalatorName;


          var esc2 = _.find(hubTransitArray , { escalatorName:escName1,floorID:floor2 });
          console.log("Escalator 2:"+JSON.stringify(esc2));

          // find the via outlet
          // get pointer value of the toOutlet.

          var nearbyOutlet1 = _.find(allOutletsArray , {outletID:esc2.nearbyOutlet1ID});
          var nearbyOutlet2 = _.find(allOutletsArray , {outletID:esc2.nearbyOutlet2ID});
          var nearbyOutlet3 = _.find(allOutletsArray , {outletID:esc2.nearbyOutlet3ID});
          var nearbyOutlet4 = _.find(allOutletsArray , {outletID:esc2.nearbyOutlet4ID});
          console.log("pointer2 :"+pointer2);
          console.log("nearbyOutlet1pointer :"+nearbyOutlet1.pointerValue);
          console.log("nearbyOutlet2pointer :"+nearbyOutlet2.pointerValue);
          console.log("nearbyOutlet3pointer :"+nearbyOutlet3.pointerValue);
          console.log("nearbyOutlet4pointer :"+nearbyOutlet4.pointerValue);

          var viaOutletName="";
          if(pointer2 > 0){
            // on the side of nearbyOutlet1ID and nearbyOutlet2ID
            //if(distanceToOutlet1 == distanceToOutlet2){  //TODO: check
            viaOutletName = ( isShorterDistanceToOutlet(nearbyOutlet1 , nearbyOutlet2 ,outletArray[toIndex] )  )?(nearbyOutlet1.outletName):(nearbyOutlet2.outletName);

          }else{
            // on the side of nearbyOutlet3ID and nearbyOutlet4ID
            //if(distanceToOutlet1 == distanceToOutlet2){  //TODO: check
            viaOutletName = ( isShorterDistanceToOutlet(nearbyOutlet3 , nearbyOutlet4 ,outletArray[toIndex] )  )?(nearbyOutlet3.outletName):(nearbyOutlet4.outletName);
          }

          var returnValue = getDifferentFloorTemplateUsingValues(
            name1,dir1,esc1nearbyOutletName,isGoingUp,diff,viaOutletName , name2);

          console.log("returnValue:"+returnValue);
          res.json(returnValue);





        }
        else{
          // use same floor template

          //if shops are on the same side on the floor
          if((pointer1>0 && pointer2>0)|| (pointer1<0 && pointer2<0)) {
            if((pointer1>0 && pointer2>0))
            {
              //rights side of the mall
              if(pointer2 >pointer1)
                dir1 = "Right";
              else
                dir1 = "Left";
            }
            else
            {
              //left side of the mall
              if(pointer2 >pointer1)
                dir1 = "Left";
              else
                dir1 = "Right";
            }
            var diff2 = Math.abs(pointer1-pointer2)
            var returnValue = getSameFloorTemplateUsingValues(
              name1,dir1,diff2, name2);
          }
          else {
            //Opposite side of the mall

          }
          console.log("returnValue:"+returnValue);
          res.json(returnValue);
          //res.json({Error:"Still being developed"});
        }

        // 2. Call the template required with the input values
        // 3. Return the string array to the output

        // If floor1 == floor2




        return ;//res.json({outletArray:outletArray,hubTransitArray:hubTransitArray})
      })
      .catch(function(err) {
        if (err) {
          return res.serverError(err);
        }
      });




  },

  getAllFavoriteOutlets : function(req,res,connection){
    // input : userID
    var userid = req.query.userid;
    // output : outletArray
    // Logic : From UserFavorite table, fetch the whole list of outletIDs , inner join it with the outlet table

    UserFavorite
      .find({select:['outletID']})
      .where({userID : userid})
      .exec(function (err, outletIdObjectArray) {
        if(err){ console.log("Error:"+err);return;   }

        var outletIdArray=_.pluck(outletIdObjectArray,'outletID'); // using LoDash


        Outlet
          .find({outletID:outletIdArray})
          .populateAll()
          .then(function(outletArray){

            var staticAveragePricesArray = StaticAveragePrices
             .find({select:['brandID','tagID','avgPrice']})
             .where({brandID: _.pluck(_.pluck(outletArray,'ownedByBrandID'),'brandID')})
             .then(function (staticAveragePricesArray) {
                return staticAveragePricesArray;
             });

            return [outletArray , staticAveragePricesArray]
          })
          .spread(function(outletArray ,staticAveragePricesArray ){
            if(err){ console.log("Error inside"+err); res.json({error:err}); }

            console.log("outletArray:"+JSON.stringify(outletArray));
            console.log("staticAveragePricesArray:"+JSON.stringify(staticAveragePricesArray));

            function getResultObject(obj){
              // Condition to find "isOnSale"
              // 1. offers array should not be empty or undefined
              // 2. Every offer should be active . i.e. every offer object's active property should be 'true'


              // Calculate avgPrice for the prominentTagID if present
              // 1. Check if prominentTagID is present
              // 2. Check if this brandID and this tagID is present in staticAveragePricesArray
              var avgPrice="";
              if(obj.prominentTagID !=undefined) {
                avgPrice= _.result( _.find(staticAveragePricesArray , {'brandID':obj.ownedByBrandID.brandID , 'tagID':obj.prominentTagID.tagID}) , 'avgPrice');
              }
              var returnValue="";
              switch(obj.floorNumber+""){
                case '-1': returnValue = "Lower ground floor"; break;
                case '0': returnValue = "Ground floor";break;
                case '1': returnValue = "First floor";break;
                case '2': returnValue = "Second floor";break;
                default : returnValue = "";break;
              }
              obj.floorNumber = returnValue;


              return {
                outletName:obj.outletName,
                imageUrl : obj.ownedByBrandID.imageUrl,
                ratingValue : obj.ratingValue ,
                phoneNumber : obj.phoneNumber,
                emailId :obj.emailId,
                floorNumber : obj.floorNumber ,
                outletID: obj.outletID,
                tagName : (obj.prominentTagID !=undefined  ? obj.prominentTagID.tagName: ""),
                genderCodeString : obj.ownedByBrandID.genderCodeString ,
                hubName : obj.hubID.hubName ,
                isOnSale : ( (obj.offers.length!=0 && _.contains(_.pluck(obj.offers , 'active') ,true ) ) ? true :false ),
                isFavorite:true,
                avgPrice:avgPrice
              };
            }

            var resultArray = _.map(outletArray , getResultObject );
            console.log("result:"+JSON.stringify (resultArray ));

            res.json(resultArray);

          })
          .catch(function(err) {
            if (err) {
              return res.serverError(err);
            }
          });



      });

  },

  getAllOnSaleOutlets : function(req,res,connection){
    // input : userID
    var userid = req.query.userid;

    // output : outletArray
    // Logic : From Offer table, fetch the whole list of outletIDs , inner join it with the outlet table

    Offer
      .find({select:['outletID']})
      .where({active: true})
      .exec(function (err, outletIdObjectArray) {
        if(err){ console.log("Error:"+err);return;   }

        var outletIdArray=_.pluck(outletIdObjectArray,'outletID'); // using LoDash


        Outlet
          .find({outletID:outletIdArray})
          .populateAll()
          .then(function(outletArray){

            var staticAveragePricesArray = StaticAveragePrices
              .find({select:['brandID','tagID','avgPrice']})
              .where({brandID: _.pluck(_.pluck(outletArray,'ownedByBrandID'),'brandID')})
              .then(function (staticAveragePricesArray) {
                return staticAveragePricesArray;
              });
            var userFavoriteArray = UserFavorite
              .find({select:['userID','outletID']})
              .where({'userID':userid , 'outletID':outletIdArray})// amongst these outlets , find the ones selected as Favourite by this user
              .then(function (userFavoriteArray) {
                return userFavoriteArray;
              });

            return [outletArray , staticAveragePricesArray , userFavoriteArray]
          })
          .spread(function(outletArray ,staticAveragePricesArray , userFavoriteArray){
            if(err){ console.log("Error inside"+err); res.json({error:err}); }

            console.log("outletArray:"+JSON.stringify(outletArray));
            console.log("staticAveragePricesArray:"+JSON.stringify(staticAveragePricesArray));
            console.log("userFavoriteArray:"+JSON.stringify(userFavoriteArray));

            function getResultObject(obj){
              // Condition to find "isOnSale"
              // 1. offers array should not be empty or undefined
              // 2. Every offer should be active . i.e. every offer object's active property should be 'true'


              // Calculate avgPrice for the prominentTagID if present
              // 1. Check if prominentTagID is present
              // 2. Check if this brandID and this tagID is present in staticAveragePricesArray
              var avgPrice="";
              if(obj.prominentTagID !=undefined) {
                avgPrice= _.result( _.find(staticAveragePricesArray , {'brandID':obj.ownedByBrandID.brandID , 'tagID':obj.prominentTagID.tagID}) , 'avgPrice');
              }

              var isFavorite=false;
              if( _.find(userFavoriteArray , { 'outletID' : obj.outletID}) !=undefined ){   isFavorite = true;   }
              else { isFavorite = false;  }


              return {
                outletName:obj.outletName,
                imageUrl : obj.ownedByBrandID.imageUrl,
                ratingValue : obj.ratingValue ,
                phoneNumber : obj.phoneNumber,
                emailId :obj.emailId,
                floorNumber : obj.floorNumber ,
                outletID: obj.outletID,
                tagName : (obj.prominentTagID !=undefined  ? obj.prominentTagID.tagName: ""),
                genderCodeString : obj.ownedByBrandID.genderCodeString ,
                hubName : obj.hubID.hubName ,
                isOnSale : true,
                isFavorite:isFavorite,
                avgPrice:avgPrice
              };
            }

            var resultArray = _.map(outletArray , getResultObject );
            console.log("result:"+JSON.stringify (resultArray ));

            res.json(resultArray);

          })
          .catch(function(err) {
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



  setFavoriteOutlet : function(req,res,connection){
    // Required variables : [ (query) , (id,type=category) , (id[],type=category) ]
    // Optional variables : [ favorite=true , sale=true ,  ]
    // Currently optional should be required : [userid]

    var userID = req.query.userid ,
      outletID  = req.query.outletid,
      toBeSet = (req.query.set==='true');

    if(toBeSet == undefined){
      res.send({"Error":"The key 'set' is not sent as a parameter"});
    }

    if(toBeSet ==  true){
      UserFavorite
        .findOrCreate({'userID':userID,outletID:outletID})
        .exec(function (err,created) {
          if(err){res.send(err); return;}
          console.log("created:"+created);
          res.json(created);
        });
    }else if(toBeSet ==false){
      UserFavorite
        .destroy({'userID':userID,outletID:outletID})
        .exec(function (err,deleted) {
          if(err){res.send(err); return;}
          console.log("deleted:"+JSON.stringify(deleted[0]));
          res.json();
        });
    }


  },

  updateRegID : function(req,res,connection){
    //Required variables : userid , regid

    var userID = req.query.userid ,
      regID  = req.query.regid;

    User.update({userID:userID},{regid:regID}).exec(function (err,updated) {
      if(err){ console.log("Error"+err); res.send(err);     }
      console.log("Updated"+JSON.stringify(updated));
      res.json(updated);
    })

  },

  sendNotificationToAndroid : function (req,res,connection){
    var msgValue = req.query.msg;

    var gcm = require('node-gcm');

    var message = new gcm.Message();

    message.addData('key1', msgValue);

    var regIds = ['APA91bH9Rgc8JJIPL1Uh2URIO7qF3PjmRhi55zY2S5OTUzJhEI-4VidecoRud_Tdfu-1_bADTG05Nem1CXefc-zzxL2Lud6KKD6pdhjPFKmf2LjRWlUxxFPCAAr4sbi310npUAYyzS_2'];

// Set up the sender with you API key
    var sender = new gcm.Sender('AIzaSyB6HVQ6Axi_EOIk1R9j-gSplBJYeRX3pG0');

//Now the sender can be used to send messages
    sender.send(message, regIds, function (err, result) {
      if(err){
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


  }






};
