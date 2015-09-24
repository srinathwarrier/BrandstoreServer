/**
* Outlet.js
*
* @description :: outlet model imported from localhost MySql server at 25/6/2015 23:34:46.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'Collection',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    collectionID : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    collectionName : {
      type: 'string',
      size: 30
    },
    active : {
      type: 'integer',
      defaultsTo: '1'
    },
    outletAssignment:{
      collection:'CollectionOutletAssignment',
      via:'collectionID'
    }
  }
};
