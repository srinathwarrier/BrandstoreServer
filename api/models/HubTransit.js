/**
 * HubTransit.js
 *
 * @description :: hubtransit model imported from localhost MySql server at 25/6/2015 13:9:43.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */


module.exports = {

  tableName: 'HubTransit',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    transitID : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    transitType :{
      type : 'string',
      size:100
    },
    escalatorName : {
      type: 'integer',
      size: 100
    },
    hubID : {
      type: 'integer'
    },
    floorID: {
      type: 'integer',
      defaultsTo: '0'
    },
    floorZoneID : {
      type: 'integer',
      index: true,
      model:'FloorZone'
    },
    nearbyOutlet1ID: {
      type: 'integer',
      index: true,
      model:'Outlet'
    },
    nearbyOutlet2ID: {
      type: 'integer',
      index: true
    },
    nearbyOutlet3ID: {
      type: 'integer',
      index: true
    },
    nearbyOutlet4ID: {
      type: 'integer',
      index: true
    }
  }
};
