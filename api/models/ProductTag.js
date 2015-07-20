/**
* ProductTag.js
*
* @description :: productTag model imported from localhost MySql server at 25/6/2015 23:34:47.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'ProductTag',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    productTagID : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    productID : {
      type: 'integer',
      index: true
    },
    tagID : {
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
    }
  }
};
