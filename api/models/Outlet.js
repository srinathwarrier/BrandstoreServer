/**
* Outlet.js
*
* @description :: outlet model imported from localhost MySql server at 25/6/2015 23:34:46.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'Outlet',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    outletID : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    outletName : {
      type: 'string',
      size: 20
    },
    ownedByBrandID : {
      type: 'integer',
      index: true,
      model:'Brand'
    },
    hubID : {
      type: 'integer',
      index: true,
      model:'Hub'
    },
    floorNumber : {
      type: 'integer'
    },
    floorZoneID : {
      type: 'integer',
      index: true,
      model:'FloorZone'
    },
    pointerValue :{
      type : 'integer'
    },
    leftOutletID:{
      type:'integer'
    },
    rightOutletID:{
      type:'integer'
    },
    turnDirectionToZoneEscalator:{
      type:'string',
      size:10
    },
    ratingValue : {
      type: 'integer'
    },
    phoneNumber : {
      type: 'string',
      size: 20
    },
    emailId : {
      type: 'string',
      size: 100
    },
    prominentTagID:{
      type: 'integer',
      model:'Tag'
    },
    active : {
      type: 'integer',
      defaultsTo: '1'
    },
    createdDate : {
      type: 'datetime',
      required: true,
      defaultsTo: function() {return new Date();}
    },
    offers:{
      collection:'Offer',
      via:'outletID'
    },
    favoritedBy:{
      collection:'UserFavorite',
      via:'outletID'
    },
    collectionAssignment:{
      collection:'CollectionOutletAssignment',
      via:'outletID'
    },
    staticAveragePrices:{
      collection:'StaticAveragePrices',
      via:'outletID'
    },
    findOtherOutletsInCollection:function(opts,cb){
      CollectionOutletAssignment.find({collectionID:opts.collectionID}).exec(function(err,outlets){
          if(err) return cb(err);
          if(!outlets) return cb(new Error('outlets not found'));
          var outletIdArray = _.pluck(outlets,'outletID');
          Outlet
            .find({outletID:outletIdArray})
            .populateAll()
            .exec(function (err2,outletDetails) {
              if(err2) return cb(err2);
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
              return cb(resultArray);
            });
        });
    }
  }
};
