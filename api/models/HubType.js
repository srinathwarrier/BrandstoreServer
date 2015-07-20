/**
* HubType.js
*
* @description :: hubType model imported from localhost MySql server at 25/6/2015 21:59:21.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'HubType',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    hubTypeID : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    hubTypeName : {
      type: 'text'
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
