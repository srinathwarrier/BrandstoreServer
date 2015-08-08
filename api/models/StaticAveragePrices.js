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
  "tableName": "StaticAveragePrices",
  autoPK: false,
  "attributes": {
    "brandID": {
      "type": "integer"
    },
    "tagID": {
      "type": "integer"
    },
    "tagName": {
      type: 'string',
      size: 100
    },
    "noOfProducts": {
      "type": "integer"
    },
    "minPrice": {
      "type": "integer"
    },
    "maxPrice": {
      "type": "integer"
    },
    "avgPrice": {
      "type": "float"
    }
  }
}
