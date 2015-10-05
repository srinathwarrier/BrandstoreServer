/**
 * Created by I076324 on 9/23/2015.
 */


module.exports = {

  //getRecentAndPopularSuggestions - Pending to be converted to Sails
  getRecentAndPopularSuggestions :function(req,res,connection){
    var param = req.query.q;
    var userId = req.query.userid;
    if (userId == undefined) userId = 6;

    res.send();


  },

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
          var returnValue="";
          switch (outletArray[outletIndex].floorNumber + "") {
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
          outletArray[outletIndex].floorNumber=returnValue;
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
          .where({tagName: {contains: param},active:true})
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

  }
};
