/**
 * Brand.js
 *
 * @description :: brand controller imported from localhost MySql server at 25/6/2015 13:11:3.
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


module.exports = {
  myupdate: function (req, res) {
    var data =req.body;
    /*
     values in data :
     brandID : 20
     brandName:See N Take
     imageUrl:
     description:See N Take a one stop shop for all Women’s Fashion Accessories such as, bags, purses, belts, hats, scarves, Necklace, Bracelet, Earring Ring, Hair Accessories, and Jewelleryetc
     website:null

     outletIndex: 0
     outletID :
     floorNumber:-1
     floorZone:1
     phoneNumber: 080-67266582
     emailId:null

     */

    var brandDataToBeUpdated ={
      brandName :data.brandName ,
      imageUrl : data.imageUrl,
      description : data.description,
      website : data.website
    };
    Brand.update({brandID:data.brandID},brandDataToBeUpdated).exec(function afterwards(err, updated){
      if (err) {
        // handle error here- e.g. `res.serverError(err);`
        return;
      }
      return res.view('pages/brandupdateresult',{title:'Updated!'});
    });


    var outletDataToBeUpdated = {
      floorNumber : data.floorNumber,
      floorZoneID : data.floorZoneID,
      phoneNumber : data.phoneNumber,
      emailId     : data.emailId
    };
    console.log("Outlet updated:"+JSON.stringify(outletDataToBeUpdated));

    Outlet.update({outletID:data.outletID},outletDataToBeUpdated).exec(function afterwards(err, updated){
      if (err) {
        // handle error here- e.g. `res.serverError(err);`
        return;
      }
      //console.log("id:"+updated[0].outletID);
    });

    // Check the offer array which we receive
    console.log('data array : '+ JSON.stringify(data));

    // Split array into required JSON
    var offerToBeFoundArray=[];
    var offerDataToBeUpdated =[];

    var offerDataToBeAdded=[];

    for(var i=0;i<data.offers_count;i++)
    {
      var idname = "offer_"+(i)+"_id";
      var descname = "offer_"+(i)+"_desc";
      var activename = "offer_"+(i)+"_active";
      // if null, add offer, else if number, update the data
      if(data[idname]=="null"){
        var offerObjToBeAdded = {};
        offerObjToBeAdded.outletID =Number(data.outletID);
        offerObjToBeAdded.offerDesc = data[descname];
        offerObjToBeAdded.active =Number(data[activename]);
        offerObjToBeAdded.createdByUserID = 1;
        offerObjToBeAdded.modifiedByUserID = 1;
        //TODO:Add all the required data here !
        offerDataToBeAdded.push(offerObjToBeAdded);
      }
      else{
        offerToBeFoundArray.push({offerID:Number(data[idname])});
        console.log("id:"+data[idname] );

        var offerObjToBeUpdated = {};
        //offerObjToBeUpdated.offerID = data[idname];
        offerObjToBeUpdated.offerDesc = data[descname];
        offerObjToBeUpdated.active =Number(data[activename]);
        offerDataToBeUpdated.push(offerObjToBeUpdated);
      }
    }
    console.log("To be Found:"+JSON.stringify(offerToBeFoundArray));
    console.log("To be updated:"+JSON.stringify(offerDataToBeUpdated));
    console.log("To be added:"+JSON.stringify(offerDataToBeAdded));




    // Update in Offer table
    for(var i=0;i<offerToBeFoundArray.length;i++){
      Offer.update(offerToBeFoundArray[i],offerDataToBeUpdated[i]).exec(function afterwards(err, updated){
        if (err) {console.log("err:"+JSON.stringify(err));return;}console.log("updated values:"+JSON.stringify(updated));
      });
    }

    // Create in Offer table
    for(var i=0;i<offerDataToBeAdded.length;i++){
      Offer.create(offerDataToBeAdded[i]).exec(function afterwards(err, created){
        if (err) {
          console.log("err:"+JSON.stringify(err));return;
        }
        console.log("created values:"+JSON.stringify(created));
      });
    }





  },


  chooseBrand: function (req,res) {
    Brand.find()
      .then(function(brandArray){
        brandArray.sort(function(a, b){
          if(a.brandName < b.brandName) return -1;
          if(a.brandName > b.brandName) return 1;
          return 0;
        });
        return brandArray;
      })
      .then(function(brandArray){
        var brandTypes = BrandType.find()
          .then(function(brandTypeArray) {
            return brandTypeArray;
          });
        return [brandArray , brandTypes];
      })
      .spread(function(brandArray,brandTypes){
        return res.view('pages/choosebrand',{brandArray:brandArray, title :"Choose Brand"})
      })
      .catch(function(err) {
        if (err) {
          return res.serverError(err);
        }
      });
  },


  getupdatepage: function (req, res) {
    console.log("id:"+req.params.id);
    Brand
      .find({'brandId':req.params.id})


      .populateAll()



      .then(function(brand){
        var brandTypes = BrandType.find()
          .then(function(brandTypeArray) {
            return brandTypeArray;
          });

        // get outletID from brand
        console.log("inside BrandController 1: brand[0] : "+JSON.stringify(brand[0]));
        var outletId =0;
        if(brand[0].outlets !=undefined && brand[0].outlets.length > 0 ){       //TODO: Change if loop to for loop, when considering multiple outlets
          outletId = brand[0].outlets[0].outletID;
        }
        var offersArray = Offer
          .find({'outletID':outletId})  // get offers for specific outletID     //TODO: Change this when considering multiple outlets
          .then(function(offersArray){
            console.log("inside BrandController 5: offersArray : "+JSON.stringify(offersArray));
            return offersArray;
          });
        return [brand , brandTypes , offersArray];
      })

      .spread(function(brand,brandTypes , offersArray) {
        return res.view('pages/brandupdate',{brand:brand[0].toJSON(), offers:offersArray, title :"Update Brand"});
      })


      .catch(function(err) {
        if (err) {
          return res.serverError(err);
        }
      });


    //Outlet.find({'ownedByBrandID':req.params.id})
    //  .populate('ownedByBrandID')
    //  .exec(function(err, outlet) {
    //    console.log("outlet:"+outlet[0].toJSON());
    //    return res.view('pages/brandupdate',{brand:outlet[0].toJSON(), title :"Update Brand"});
    //  });
  }


};
