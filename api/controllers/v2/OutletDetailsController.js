/**
 * Created by I076324 on 9/23/2015.
 */


function getFloorNameFromFloorNumber(index) {
  var returnValue = "";
  switch (index) {
    case -1:
      returnValue = "Lower ground floor";
      break;
    case 0:
      returnValue = "Ground floor";
      break;
    case 1:
      returnValue = "First floor";
      break;
    case 2:
      returnValue = "Second floor";
      break;
    default :
      returnValue = "";
      break;
  }
  return returnValue;
}

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

    CollectionOutletAssignment
      .find()
      .then(function ( collectionOutletAssignmentArray) {

        var otherOutletsInCollectionArray;
        var collectionOutletAssignmentObject = _.find(collectionOutletAssignmentArray , {outletID : parseInt(id)});
        var collectionID, otherOutletIdsInCollectionArray ;
        if(collectionOutletAssignmentObject != undefined) { // this is to check if outlet is present in any collection at all
          collectionID = collectionOutletAssignmentObject.collectionID;
          otherOutletIdsInCollectionArray = _.pluck(_.filter(collectionOutletAssignmentArray, {collectionID: collectionID}), 'outletID');
          otherOutletsInCollectionArray = Outlet
            .find({outletID :otherOutletIdsInCollectionArray})
            .populateAll()
            .then(function (otherOutetsArray) {
              var result=[];
              for(var i=0;i<otherOutetsArray.length;i++){
                if(otherOutetsArray[i] && otherOutetsArray[i].ownedByBrandID ){
                  var obj = {
                    outletID: otherOutetsArray[i].outletID,
                    outletName : otherOutetsArray[i].outletName,
                    brandName : otherOutetsArray[i].outletName,
                    imageUrl : otherOutetsArray[i].ownedByBrandID.imageUrl
                  };
                  result.push(obj);
                }
              }
              return result;
            });
        }
        else{
          otherOutletsInCollectionArray = [];
        }


        var outletObject = Outlet
          .findOne({outletID:id})
          .populateAll()
          .then(function (outletObject) {
            if(outletObject == undefined){
              return {};
            }
            return outletObject;
          });

        return [outletObject,otherOutletsInCollectionArray];
      })
      .spread(function (outletObject,outletsInCollectionArray) {
        var resultObject = {};
        resultObject.outletID = outletObject.outletID;
        resultObject.outletName = outletObject.outletName;
        resultObject.floorNumber = getFloorNameFromFloorNumber(outletObject.floorNumber);
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
          if(_.find(outletObject.favoritedBy, {'userID':parseInt(userId)})){
            resultObject.isFavorite = true;
          }
        }



        var tagsArray=[];
        if(outletObject.staticAveragePrices ) {
          for (var index =0; index< outletObject.staticAveragePrices.length;index++) {
            tagsArray.push({
              tagName: outletObject.staticAveragePrices[index].tagName,
              avgPrice: outletObject.staticAveragePrices[index].avgPrice
            });
          }
        }
        resultObject.tagsArray= tagsArray;

        var offersArray=[];
        if(outletObject.offers ) {
          for (var index =0;index< outletObject.offers;index++) {
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

        var relatedBrandsArray = [];
        if(outletsInCollectionArray !=undefined && outletsInCollectionArray.length>0){
          relatedBrandsArray = _.filter(outletsInCollectionArray,function(obj){
            return (obj.outletID!=parseInt(id));
          });
        }
        resultObject.relatedBrandsArray=relatedBrandsArray;


        res.json(resultObject);
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
