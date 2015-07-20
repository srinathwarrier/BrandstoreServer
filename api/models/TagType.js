/**
* TagType.js
*
* @description :: tagType model imported from localhost MySql server at 25/6/2015 23:35:27.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'TagType',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    tagTypeID : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    tagTypeName : {
      type: 'text'
    },
    active : {
      type: 'integer',
      defaultsTo: '1'
    },
    createdDate : {
      type: 'datetime',
      required: true,
      defaultsTo: function() {return new Date();}
    }
  }
};
