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
    name : {
      type: 'string',
      size:50
    },
    emailid : {
      type:'string',
      size:50
    },
    password :{
      type:'string',
      size:50
    },
    genderCode : {
      type: 'text'
    },
    dob:{
      type:'date'
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
    },
    // Override toJSON method to remove password from API
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  }
};
