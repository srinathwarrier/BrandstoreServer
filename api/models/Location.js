/**
* Location.js
*
* @description :: location model imported from localhost MySql server at 25/6/2015 21:59:21.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'Location',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    locationID : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    locationName : {
      type: 'text'
    },
    locationLat : {
      type: 'float'
    },
    locationLong : {
      type: 'float'
    },
    pincode : {
      type: 'integer'
    },
    active : {
      type: 'integer',
      defaultsTo: '1'
    },
    createdDate : {
      type: 'datetime',
      required: true,
      defaultsTo: function() {return new Date();}
    }
  }
};
