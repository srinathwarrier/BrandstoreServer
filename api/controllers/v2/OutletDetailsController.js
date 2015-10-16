/**
 * Created by I076324 on 9/23/2015.
 */


module.exports = {

  getOutletDetails: function (req, res, connection) {
    // 3)  /getOutletDetails?id=100
    // Call Outlet.findOne(outletID) -> populateAll() //outletName , floorNumber , ownedByBrandID , hubID


    /*
     // Hub and Brand Details
     // outlet.ownedByBrandID -> imageUrl, description , genderCodeString
     // outlet.hubID -> hubName
     SELECT
     Outlet.outletName AS brandName, Brand.imageUrl,
     Outlet.ratingValue, Outlet.phoneNumber,
     Outlet.emailId , Outlet.floorNumber, Outlet.outletID ,
     Brand.description,
     Outlet.outletName,
     Brand.genderCodeString,
     Hub.hubName
     FROM Outlet
     INNER JOIN Hub ON Outlet.hubID = Hub.hubId
     INNER JOIN Brand ON Outlet.ownedByBrandID = Brand.brandID
     WHERE Outlet.outletID = outletIdNumber
     GROUP by OutletID
     LIMIT 0,1;

     // Average prices
     // outlet.staticAveragePrices -> (lodash) : [ tagname, avgPrice ]
     SELECT Outlet.outletID, avg.tagName, avg.avgPrice
     FROM Outlet
     INNER JOIN StaticAveragePrices AS avg ON ( Outlet.outletID = avg.outletID )
     WHERE Outlet.outletID = outletIdNumber;

     // Related Brands
     // Call query first. Then switch to Sails js
     // var relatedBrandsArray =
     1. Check for other outletIDs in Collection table
     var collectionArray = Collection.find(outletID) -> [ outletID ,
     2.

     SELECT * FROM
     (select @rn:=@rn+1 as srNo, outletID from ( SELECT DISTINCT x.outletID FROM ( SELECT a2 . outletID AS outletID , ROUND(( a1.noOfProducts + a2.noOfProducts )/2 ) AS diffInNoOfProducts FROM (select `p`.`brandID` AS `brandID`, `pt`.`tagID` AS `tagID`, `t`.`tagTypeID` AS `tagTypeId`, count(`p`.`productID`) AS `noOfProducts` , `o`.`outletID` from ( (`Product` `p` join `ProductTag` `pt` on((`p`.`productID` = `pt`.`productID`))) join `Tag` `t` on((`pt`.`tagID` = `t`.`tagID`) and (`t`.`tagTypeID` <> 6)) join `Outlet` `o` on (`p`.`brandID` = `o`.`ownedByBrandID`))where ((`p`.`active` = 1) and (`pt`.`active` = 1) and (`t`.`active` = 1)) group by `o`.`outletID`,`t`.`tagID`) AS a1 INNER JOIN (select `p`.`brandID` AS `brandID`, `pt`.`tagID` AS `tagID`, `t`.`tagTypeID` AS `tagTypeId`, count(`p`.`productID`) AS `noOfProducts` , `o`.`outletID` from ( (`Product` `p` join `ProductTag` `pt` on((`p`.`productID` = `pt`.`productID`))) join `Tag` `t` on((`pt`.`tagID` = `t`.`tagID`) and (`t`.`tagTypeID` <> 6)) join `Outlet` `o` on (`p`.`brandID` = `o`.`ownedByBrandID`))where ((`p`.`active` = 1) and (`pt`.`active` = 1) and (`t`.`active` = 1)) group by `o`.`outletID`,`t`.`tagID`) AS a2 ON a1.tagID = a2.tagID WHERE a1.tagTypeID <>1 AND a1.outletID =outletIdNumber AND a2.outletID !=outletIdNumber ORDER BY diffInNoOfProducts DESC ) AS x ) AS y,(select @rn:=0) as r order by srNo) AS p
     INNER JOIN
     (SELECT Brand.brandName, Brand.brandID,  Brand.imageUrl, Outlet.ratingValue, Outlet.phoneNumber, Outlet.emailId , Outlet.floorNumber, Outlet.outletID ,Brand.description, g.genderCodeString, Hub.hubName FROM Outlet INNER JOIN Hub ON Outlet.hubID = Hub.hubId INNER JOIN Brand ON Outlet.ownedByBrandID = Brand.brandID INNER JOIN AllGenderCodesForBrands AS g ON Brand.brandID = g.brandID GROUP by brandID) AS q
     WHERE p.outletID = q.outletID ORDER BY p.srNo;

     // Offers
     // outlet.offers -> (lodash) : [ offerID, offerDesc , startDate, endDate]
     SELECT offerID , offerDesc, startDate, endDate, createdDate, modifiedDate
     FROM Offer
     WHERE Offer.outletID = outletIdNumber AND Offer.active = 1;

     // Fallback Details
     // TODO: Remove. Doesn't make sense.
     SELECT
     Outlet.outletName AS brandName, Brand.imageUrl, Brand.description,
     Outlet.ratingValue, Outlet.phoneNumber,
     Outlet.emailId , Outlet.floorNumber, Outlet.outletID ,
     Outlet.outletName,
     Hub.hubName
     FROM Outlet
     INNER JOIN Hub ON Outlet.hubID = Hub.hubId
     INNER JOIN Brand ON Outlet.ownedByBrandID = Brand.brandID
     WHERE Outlet.outletID = outletIdNumber
     GROUP by OutletID
     LIMIT 0,1;


     */

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

    Outlet
      .findOne({outletID:id})
      .populateAll()
      .then(function (outletObject) {

        var outletsInCollectionArray= [];
        var allOutletsInCollectionArray =[];
        if(outletObject.collectionAssignment){
          outletsInCollectionArray = Collection
            .find({collectionID:outletObject.collectionAssignment[0].collectionID})
            .populateAll()
            .then(function (collectionObject) {
              // get outletsArray from collectionObject
              //var outletsInCollectionArray = _.map(collectionObject.outletAssignment, function(obj) {return _.pick(obj, ["outletID", "outletName"]);});
              var outletsInCollectionArray = _.pluck(collectionObject.outletAssignment, 'outletID');
              return outletsInCollectionArray;
            })
            .spread(function (outletsInCollectionArray) {
              return outletsInCollectionArray;
            });

          allOutletsInCollectionArray = CollectionOutletAssignment
            .find({collectionID:outletObject.collectionAssignment[0].collectionID})
            .then(function(outlets){
            if(!outlets) return (new Error('outlets not found'));
            var outletIdArray = _.pluck(outlets,'outletID');
            Outlet
              .find({outletID:outletIdArray})
              .populateAll()
              .then(function (outletDetails) {
                if(!outletDetails) return cb(new Error('outlet details not found'));
                var resultArray=[];
                for(var index in outletDetails){
                  var outletID = outletDetails[index].outletID;
                  var imageUrl = outletDetails[index].ownedByBrandID.imageUrl;
                  var outletName = outletDetails[index].outletName;
                  var brandName = outletDetails[index].brandName;
                  var obj={
                    outletID:outletID,
                    imageUrl:imageUrl,
                    outletName :outletName,
                    brandName :brandName
                  };
                  resultArray.push(obj);
                }
                return (resultArray);
              });
          });
        }




        return [outletObject,allOutletsInCollectionArray];
      })
      .spread(function (outletObject,outletsInCollectionArray) {
        var resultObject = {};
        resultObject.outletID = outletObject.outletID;
        resultObject.outletName = outletObject.outletName;
        resultObject.floorNumber = outletObject.floorNumber;
        resultObject.ratingValue = outletObject.ratingValue;
        resultObject.phoneNumber = outletObject.phoneNumber;
        resultObject.emailId = outletObject.emailId;


        if(outletObject.ownedByBrandID){
          resultObject.brandName = outletObject.ownedByBrandID.brandName;
          resultObject.imageUrl = outletObject.ownedByBrandID.imageUrl;
          resultObject.description = outletObject.ownedByBrandID.description;
          resultObject.genderCodeString = outletObject.ownedByBrandID.genderCodeString;
        }
        else{
          resultObject.brandName = outletObject.outletName;
          resultObject.imageUrl = "";
          resultObject.description = "";
          resultObject.genderCodeString = "";
        }

        if(outletObject.hubID ){
          resultObject.hubName = outletObject.hubID.hubName;
        }
        else{
          resultObject.hubName = "";
        }

        resultObject.isFavorite = false;
        if(outletObject.favoritedBy ){
          if(_.find(outletObject.favoritedBy, {'userID':userId})){
            resultObject.isFavorite = true;
          }
        }



        var tagsArray=[];
        if(outletObject.staticAveragePrices ) {
          for (index in outletObject.staticAveragePrices) {
            tagsArray.push({
              tagName: outletObject.staticAveragePrices[index].tagName,
              avgPrice: outletObject.staticAveragePrices[index].avgPrice
            });
          }
        }
        resultObject.tagsArray= tagsArray;

        var offersArray=[];
        if(outletObject.offers ) {
          for (index in outletObject.offers) {
            offersArray.push({
              offerID: outletObject.offers[index].offerID,
              offerDesc: outletObject.offers[index].offerDesc,
              startDate: outletObject.offers[index].startDate,
              endDate: outletObject.offers[index].endDate,
              createdDate: outletObject.offers[index].createdDate,
              modifiedDate: outletObject.offers[index].modifiedDate
            });
          }
        }
        resultObject.offersArray= offersArray;





        var test=outletObject;
      })
      .catch(function (err) {
        if (err) {
          return res.serverError(err);
        }
      });
  },

  setFavoriteOutlet: function (req, res, connection) {
    // Required variables : [ (query) , (id,type=category) , (id[],type=category) ]
    // Optional variables : [ favorite=true , sale=true ,  ]
    // Currently optional should be required : [userid]

    var userID = req.query.userid,
      outletID = req.query.outletid,
      toBeSet = ( (req.query.set === 'true')?true : (req.query.set === 'false')?false:undefined );

    if (toBeSet == undefined) {
      res.json({responseState:"error","error": "The key 'set' is not sent as a parameter"});
      return;
    }
    else if (toBeSet == true) {
      UserFavorite
        .findOrCreate({'userID': userID, outletID: outletID})
        .exec(function (err, created) {
          if (err) {
            res.json({responseState:"error",error:err});
            return;
          }
          console.log("created:" + created);
          res.json({responseState:"success",created:created});
        });
    } else if (toBeSet == false) {
      UserFavorite
        .destroy({'userID': userID, outletID: outletID})
        .exec(function (err, deleted) {
          if (err) {
            res.json({responseState:"error",error:err});
            return;
          }
          console.log("deleted:" + JSON.stringify(deleted[0]));
          res.json({responseState:"success",deleted:deleted});
        });
    }


  },

  //getRelatedBrandOutlets


};
