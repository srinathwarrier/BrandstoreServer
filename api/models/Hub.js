/**
* Hub.js
*
* @description :: hub model imported from localhost MySql server at 25/6/2015 13:9:43.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'Hub',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    hubID : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    hubName : {
      type: 'string',
      size: 100
    },
    numberOfFloors : {
      type: 'integer'
    },
    isCarParkingAvailable : {
      type: 'integer',
      defaultsTo: '0'
    },
    hubTypeID : {
      type: 'integer',
      index: true
    },
    locationID : {
      type: 'integer',
      index: true
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
    outlets:{
      collection:'Outlet',
      via:'hubID'
    }
  }
};
