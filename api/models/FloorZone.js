/**
* FloorZone.js
*
* @description :: floorZone model imported from localhost MySql server at 25/6/2015 21:59:20.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'FloorZone',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    floorZoneID : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    floorZoneName : {
      type: 'string',
      size: 5
    },
    outlets:{
      collection:'Outlet',
      via:'floorZoneID'
    }
  }
};
