/**
* Product.js
*
* @description :: product model imported from localhost MySql server at 25/6/2015 23:34:47.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'Product',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    productID : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    brandID : {
      type: 'integer',
      index: true
    },
    productName : {
      type: 'text'
    },
    websiteUrl : {
      type: 'string',
      size: 2000
    },
    websiteProductId : {
      type: 'string',
      size: 100
    },
    productUrl : {
      type: 'string',
      size: 2000
    },
    imageUrl : {
      type: 'string',
      size: 2000
    },
    price : {
      type: 'integer'
    },
    discountedPrice : {
      type: 'integer'
    },
    discountPercentage : {
      type: 'integer'
    },
    active : {
      type: 'integer',
      required: true,
      defaultsTo: '1'
    },
    createdDate : {
      type: 'datetime',
      required: true,
      defaultsTo: function() {return new Date();}
    }
  }
};
