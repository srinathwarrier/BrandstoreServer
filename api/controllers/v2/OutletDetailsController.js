/**
 * Created by I076324 on 9/23/2015.
 */


module.exports = {

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

  //getRelatedBrandOutlets


};
