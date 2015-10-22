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
  }



};
