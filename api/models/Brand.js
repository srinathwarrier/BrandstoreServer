/**
* Brand.js
*
* @description :: brand model imported from localhost MySql server at 25/6/2015 13:11:3.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'Brand',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    brandID : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    brandName : {
      type: 'string',
      size: 100
    },
    brandTypeID : {
      type: 'integer',
      index: true,
      model:'BrandType'
    },
    imageUrl : {
      type: 'string',
      size: 1000
    },
    bgHexCode : {
      type: 'string',
      size: 6,
      required: true,
      defaultsTo: 'FFFFFF'
    },
    isLegal : {
      type: 'integer'
    },
    oldImageUrl : {
      type: 'string',
      size: 1000
    },
    description : {
      type: 'text'
    },
    website : {
      type: 'string',
      size: 1000
    },
    jabongUrl : {
      type: 'string',
      size: 1000
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
      via:'ownedByBrandID'
    }
  }
};
