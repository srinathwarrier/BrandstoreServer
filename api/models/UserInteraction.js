/**
* User.js
*
* @description :: user model imported from localhost MySql server at 25/6/2015 23:35:27.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'UserInteraction',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    userInteractionID : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    userID : {
      type: 'integer'
    },
    userInteractionTypeID : {
      type: 'integer'
    },
    userInteractionLog : {
      type: 'text'
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
    }
  }
};
