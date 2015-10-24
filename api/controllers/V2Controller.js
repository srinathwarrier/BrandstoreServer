/**
 * Temp
 *
 * @description :: hub controller imported from localhost MySql server at 25/6/2015 13:9:43.
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */



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


module.exports = {

  fillAllOutletIDsInStaticAvgPrices:function(req,res,connection){
    StaticAveragePrices
      .find( {select: ['brandID']})
      .exec(function (err,staticAvgPricesArray) {
        if(err){
          res.json(err);
          return;
        }
        var uniqueBrandIdArray = _.uniq(_.pluck(staticAvgPricesArray,'brandID'));
        Brand
          .find({brandID:uniqueBrandIdArray})
          .populate('outlets')
          .exec(function (err,brandObjectArray) {
            if(err){
              res.json(err);
              return;
            }
            var tempArray=[];
            var tempArray2=[];
            for(var i=0;i<brandObjectArray.length;i++){
              if(brandObjectArray[i].outlets!=undefined && brandObjectArray[i].outlets.length==1){
                tempArray.push(brandObjectArray[i]);
                StaticAveragePrices
                  .update({outletID:0,brandID:brandObjectArray[i].brandID},{outletID:brandObjectArray[i].outlets[0].outletID})
                  .exec(function (err, updated) {
                    if(err){
                      //res.json(err);
                      return;
                    }
                  })
                ;
              }
              else{
                tempArray2.push(brandObjectArray[i]);
              }
            }



            res.json(tempArray);

        });


      });
  },

  fillLeftOutletId : function (req,res,connection) {
    var updatedArray = [];
    Outlet.find().exec(function (err,outletArray) {
      var a = outletArray;
      //var outletIdArray = _.pluck(outletArray,'outletID');
      var outletId,leftId,rightId;

      for(var i=0;i<outletArray.length;i++){
        outletId = outletArray[i].outletID;
        leftIdObj = _.find(outletArray,
          {
            floorNumber:outletArray[i].floorNumber,
            pointerValue : ( outletArray[i].pointerValue > 0 ? outletArray[i].pointerValue-1 : outletArray[i].pointerValue + 1)
          });
        if(leftIdObj!=undefined){
          leftId = leftIdObj.outletID;
        }
        if(leftId == undefined){
          leftId ="";
        }

        rightIdObj = _.find(outletArray,
          {
            floorNumber:outletArray[i].floorNumber,
            pointerValue : ( outletArray[i].pointerValue > 0 ? outletArray[i].pointerValue +1 : outletArray[i].pointerValue - 1)
          });
        if(rightIdObj!=undefined){
          rightId= rightIdObj.outletID;
        }
        if(rightId == undefined){
          rightId ="";
        }

        Outlet.update({outletID:outletId},{leftOutletID:leftId , rightOutletID:rightId}).exec(function (err,updated) {
          if(err){res.json(err);return;}
          updatedArray.push(updated);
        });

      }


    });
  },

  fillPointerValues: function (req,res,connection) {

    /*
     Cases where Resetting of pointerValue and left+right outletIDs is needed.
     -> Store closes. No replacement.

     -> Store moves from X to Y.

     -> New store inserted.

     */

    Outlet
      .find()
      .exec(function (err,outletArray) {
        // For -> Floor f
        var floorArray = _.pluck(_.uniq(outletArray, function (obj) {
          return obj.floorNumber;
        }), 'floorNumber');
        for(var floorIndex = 0;floorIndex < floorArray.length;floorIndex++){
          // Find corner outletIDs
          var cornerOutletsArray = _.filter(outletArray,{floorNumber:floorArray[floorIndex] ,isCorner:true});
          var leftStartOutletID = _.find(cornerOutletsArray, function (obj) {
            return (obj.pointerValue <0 && obj.rightOutletID==0 )
          });
          var leftEndOutletID = _.find(cornerOutletsArray, function (obj) {
            return (obj.pointerValue <0 && obj.leftOutletID==0 )
          });
          var rightStartOutletID = _.find(cornerOutletsArray, function (obj) {
            return (obj.pointerValue >0 && obj.leftOutletID==0 )
          });
          var rightEndOutletID = _.find(cornerOutletsArray, function (obj) {
            return (obj.pointerValue >0 && obj.rightOutletID==0 )
          });

          if(leftStartOutletID != undefined && leftEndOutletID != undefined){
            // For left side
            var currentOutletId = leftStartOutletID.outletID;
            var leftPointerValue = -1;
            do{
              // Update the pointerValue of outletIdCounter
              Outlet
                .update({outletId:currentOutletId},{pointerValue : leftPointerValue})
                .exec(function(err,updated){
                  if(err){res.json(err); }
                });

              // move pointer to next outlet
              currentOutletId = _.find(outletArray,{outletID:currentOutletId}).leftOutletID;

              // Increment pointer Value (negative)
              leftPointerValue = leftPointerValue -1;

            }while(currentOutletId != 0);
          }

          if(rightStartOutletID != undefined && rightEndOutletID != undefined) {

            // For right side
            currentOutletId = rightStartOutletID.outletID;
            var rightPointerValue = 1;
            do{
              // Update the pointerValue of outletIdCounter
              Outlet
                .update({outletId:currentOutletId},{pointerValue : rightPointerValue})
                .exec(function(err,updated){
                  if(err){res.json(err); }
                });

              // move pointer to next outlet
              currentOutletId = _.find(outletArray,{outletID:currentOutletId}).rightOutletID;

              // Increment pointer Value (negative)
              rightPointerValue = rightPointerValue +1;

            }while(currentOutletId != 0)
          }

        }

        res.json(outletArray);
      })
  }



};
