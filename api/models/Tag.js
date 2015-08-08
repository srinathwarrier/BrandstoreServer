/**
* Tag.js
*
* @description :: tag model imported from localhost MySql server at 25/6/2015 23:34:47.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'Tag',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    tagID : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    tagTypeID : {
      type: 'integer',
      index: true
    },
    tagName : {
      type: 'string',
      size: 100
    },
    genderCode : {
      type: 'string',
      size: 2
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
    prominentTagOfBrand:{
      collection:'Outlet',
      via:'prominentTagID'
    }

  }
};
