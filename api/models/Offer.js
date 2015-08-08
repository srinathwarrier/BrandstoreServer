/**
* offer.js
*
* @description :: TODO: Write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  "schema": true,
  autoCreatedAt: false,
  autoUpdatedAt: false,
  "attributes": {
    "offerID": {
      //"required": true,
      "type": "integer",
      "autoIncrement": true,
      "primaryKey": true
    },
    "outletID": {
      "type": "integer",
      "model":"Outlet"
    },
    "offerDesc": {
      type: 'string',
      size: 100
    },
    "startDate": {
      "type": "datetime"
    },
    "endDate": {
      "type": "datetime"
    },
    "active": {
      "defaultsTo": "true",
      "type": "boolean"
    },
    "createdDate": {
      "type": "datetime",
      "defaultsTo": function() {return new Date();}
    },
    "modifiedDate": {
      //"required": true,
      "defaultsTo": function() {return new Date();},
      "type": "datetime"
    },
    "createdByUserID": {
      "type": "integer"
    },
    "modifiedByUserID": {
      "type": "integer"
    }
  },
  "tableName": "Offer",
  autoPK: false
}
