/**
* ProductTag.js
*
* @description :: productTag model imported from localhost MySql server at 25/6/2015 23:34:47.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'CollectionOutletAssignment',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    collectionOutletID : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    collectionID  : {
      type: 'integer',
      index: true
    },
    outletID : {
      type: 'integer',
      index: true
    },
    sortOrderIndex : {
      type: 'integer',
      index: true
    },
    active : {
      type: 'integer',
      defaultsTo: '1'
    }
  }
};
