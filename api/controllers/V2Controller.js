/**
 * Temp
 *
 * @description :: hub controller imported from localhost MySql server at 25/6/2015 13:9:43.
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


module.exports = {

  getRecentAndPopularSuggestions: function (req,res) {
    Brand.find().exec(function(err, brandArray) {
      var userId = req.params.id;
      if(userId==undefined) userId = 6;

      //var callProcedureString = "SET @p0 =  '"+userId+"'; CALL `getRecentAndPopularSuggestions` ( @p0 );" ;
      var callProcedureString = "CALL `getRecentAndPopularSuggestions`("+userId+");" ;
      Brand.query(callProcedureString, function(err, rows) {
        if (!err)
        {
          console.log('The recent items are: ', rows[1]);
          console.log('The popular items are: ', rows[2]);
          var resultObj = {"recent":rows[1] , "popular":rows[2]};
          res.json(resultObj);
        }
        else{
          console.log('Error while performing Query.'+err);
          console.log('callProcedureString:'+callProcedureString);
          res.setHeader('Content-Type', 'text/html');
          res.send(err);
        }
      });
    });
  },


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


  getOutletDetails : function(req, res,connection) {
    // 3)  /getOutletDetails?id=100

    var id = req.query.id;
    var userId = req.query.userid;
    if(userId==undefined) userId = 6;
    var callProcedureString= "CALL `getOutletDetailsForOutletID` ( '"+userId+"' , '"+id+"' );" ;

    Brand.query(callProcedureString, function(err, rows, fields) {
      if (!err)
      {
        console.log("rows:"+rows);
        var resultObj = rows[0][0];
        if(resultObj!=undefined && resultObj && resultObj.floorNumber)
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
            resultObj.nullArray=rows[4];
          }
        }
        console.log("resultObj:"+resultObj);
        res.json(resultObj);
      }
      else{
        console.log('Error while performing Query.'+err);
        res.setHeader('Content-Type', 'text/html');
        res.send(err );
      }
    });
  },


  getRelatedBrandOutlets : function(req, res,connection) {
    // 1) /getRelatedBrandOutlets?brandid=6
    var brandId = req.query.brandid;
    if(brandId==undefined) brandId = 12;

    var callProcedureString = "CALL `getRelatedBrandOutlets` ( '"+brandId+"' );" ;
    Brand.query(callProcedureString, function(err, rows, fields) {
      if (!err)
      {
        console.log('rows length is: ',rows.length);
        console.log('rows[0] length is: ',rows[0].length);
        console.log('rows[1] length is: ',rows[1].length);
        console.log('The solution is: ', JSON.stringify(rows));
        console.log('The solution is: ', rows[0]);
        res.json(rows);
      }
      else{
        console.log('Error while performing Query.'+err);
        console.log('Param value:'+param);
        console.log('callProcedureString:'+callProcedureString);
        res.setHeader('Content-Type', 'text/html');
        res.send(err );
      }
    });

  },

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

  getTemplateUsingValues:function(fromOutletname,
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
      'You have reached your destination : '+toOutletName+'.'
    ];
  },

  getTakeMeThereCommands:function(req,res,connection){
    var fromOutletID = req.query.fromoutletid;
    var toOutletID = req.query.tooutletid;

    // fetch all details from
    // floor1 , zone1 , pointer1 ,
    // floor2 , zone2 , pointer2 ,

    Outlet.find([{'outletId':fromOutletID},{'outletId':toOutletID}])
      .populateAll()
      .then(function(outletArray){
        var hubTransitArray = HubTransit.find().then(function(hubTransitArray){
          return hubTransitArray;
        });
        return [outletArray,hubTransitArray];
      })
      .spread(function(outletArray,hubTransitArray){
        return res.json({outletArray:outletArray,hubTransitArray:hubTransitArray})
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

  }



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






};
