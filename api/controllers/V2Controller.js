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
  }
};
