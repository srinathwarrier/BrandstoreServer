/**
* User.js
*
* @description :: user model imported from localhost MySql server at 25/6/2015 23:35:27.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'UserFavorite',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    userFavoriteID : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    userID : {
      type: 'integer',
      index: true,
      "model":"User"
    },
    outletID : {
      type: 'integer',
      index: true,
      model:"Outlet"
    },
    createdDate : {
      type: 'datetime'
    }
  }
};
