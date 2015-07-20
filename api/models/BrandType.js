/**
* BrandType.js
*
* @description :: brandType model imported from localhost MySql server at 25/6/2015 22:1:18.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'BrandType',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    brandTypeID : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    brandTypeName : {
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
    brands:{
      collection:'Brand',
      via:'brandTypeID'
    }
  }
};
