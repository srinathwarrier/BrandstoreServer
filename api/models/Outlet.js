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
    }
  }
};
