/**
* User.js
*
* @description :: user model imported from localhost MySql server at 25/6/2015 23:35:27.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'User',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    userID : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    userRoleID : {
      type: 'integer',
      index: true
    },
    userName : {
      type: 'text'
    },
    emailid : {
      type:'string',
      size:50
    },
    password :{
      type:'string',
      size:50
    },
    firstName : {
      type: 'text'
    },
    middleName : {
      type: 'text'
    },
    lastName : {
      type: 'text'
    },
    nickname : {
      type: 'text'
    },
    genderCode : {
      type: 'text'
    },
    regid:{
      type:'string',
      size:1000
    },
    active : {
      type: 'integer',
      defaultsTo: '1'
    },
    createdDate : {
      type: 'datetime'
    },
    modifiedDate : {
      type: 'datetime',
      required: true,
      defaultsTo: function() {return new Date();}
    },
    createdByUserID : {
      type: 'integer',
      index: true
    },
    modifiedByUserID : {
      type: 'integer',
      index: true
    },
    favorites:{
      collection:'UserFavorite',
      via:'userID'
    }
  }
};
