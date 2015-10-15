/**
 * Created by I076324 on 9/23/2015.
 */


module.exports = {

  //getRecentAndPopularSuggestions - Pending to be converted to Sails
  getRecentAndPopularSuggestions :function(req,res,connection){
    var param = req.query.q;
    var userId = req.query.userid;
    if (userId == undefined) userId = 6;

    /*
     SELECT distinct x.tagName FROM (SELECT t.tagName
     FROM  `UserInteraction` AS ui
     INNER JOIN  `Tag` AS t ON ui.userInteractionLog = t.tagID
     WHERE ui.userInteractionTypeID =5
     AND ui.userID = 6
     AND ui.userInteractionLog NOT LIKE  '%,%'
     AND t.active =1
     ORDER BY ui.createdDate DESC ) AS x
     LIMIT 0 , 3;
     */
    UserInteraction
      .find({select:['userInteractionLog','createdDate','userInteractionTypeID']})
      .where({userID:userId,userInteractionTypeID:[5,7]})
      .sort('createdDate DESC')
      .then(function(userInteractionArray){
        // for UserInteractionTypeID = 5, fetch tagName
        var tagObjectArray = _.where(userInteractionArray,{'userInteractionTypeID':5});
        var uniqueTagObjectArray = _.uniq(tagObjectArray,'userInteractionLog');
        var slicedUniqueTagObjectArray = uniqueTagObjectArray.slice(0,10);
        var slicedUniqueTagIdArray = _.pluck(slicedUniqueTagObjectArray,'userInteractionLog');

        var sortedTagArray = Tag
          .find({select:['tagID','tagName']})
          .where({tagID:slicedUniqueTagIdArray,active:true})
          .then(function(tagArray){
            //sort tagArray based on userInteractionArray[i].createdDate
            var sortedTagArray = _.sortBy(tagArray,function(obj){
              obj.type="category";
              obj.name = obj.tagName;
              obj.Id = obj.tagID;
              obj.createdDate = new Date(_.result(_.find(slicedUniqueTagObjectArray,{'userInteractionLog':obj.tagID+""}),'createdDate'));
              var returnValue = _.indexOf(slicedUniqueTagIdArray,obj.tagID+"");
              delete obj.tagID;
              delete obj.tagName;
              return returnValue;
            });
            return sortedTagArray;
          });

        // for UserInteractionTypeID = 7, fetch outletName
        var outletObjectArray = _.where(userInteractionArray,{'userInteractionTypeID':7});
        var uniqueOutletObjectArray = _.uniq(outletObjectArray,'userInteractionLog');
        var slicedUniqueOutletObjectArray = uniqueOutletObjectArray.slice(0,10);
        var slicedUniqueOutletIdArray = _.pluck(slicedUniqueOutletObjectArray,'userInteractionLog');

        var sortedOutletArray = Outlet
          .find({select:['outletID','outletName']})
          .where({outletID:slicedUniqueOutletIdArray,active:true})
          .then(function (outletArray) {
            // sort and return
            var sortedOutletArray = _.sortBy(outletArray, function (obj) {
              obj.type="outlet";
              obj.name = obj.outletName;
              obj.Id = obj.outletID;
              obj.createdDate = new Date(_.result(_.find(slicedUniqueOutletObjectArray,{'userInteractionLog':obj.outletID+""}),'createdDate'));
              var returnValue = _.indexOf(slicedUniqueOutletIdArray,obj.outletID+"");
              delete obj.outletName;
              delete obj.outletID;
              return returnValue;
            });
            return sortedOutletArray;
          });

        return [userInteractionArray,sortedTagArray,sortedOutletArray];
      })
      .spread(function (userInteractionArray,tagArray,outletArray) {
        // Calculate final array and return
        // combine tagArray and outletArray. _.sortBy( createdDate)
        var resultArray = _.sortBy(tagArray.concat(outletArray),'createdDate').reverse();
        res.json(resultArray);
      })
      .catch(function (err) {
        if (err) {
          return res.serverError(err);
        }
      });


    /*

     SELECT ui.userID, COUNT(userInteractionLog) , t.tagName
     FROM  `UserInteraction` AS ui
     INNER JOIN `Tag` as t ON ui.userInteractionLog = t.tagID
     WHERE ui.userInteractionTypeID =5
     AND ui.userID = userId
     AND ui.userInteractionLog NOT LIKE  '%,%'
     GROUP BY userInteractionLog
     ORDER BY COUNT(userInteractionLog)  DESC
     LIMIT 0 , 10;


     */



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
      .find({select: ['outletID', 'outletName','active','floorNumber']})
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
