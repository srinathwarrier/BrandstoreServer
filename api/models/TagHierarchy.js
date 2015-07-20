/**
* TagHierarchy.js
*
* @description :: tagHierarchy model imported from localhost MySql server at 25/6/2015 23:35:27.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  tableName: 'TagHierarchy',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    tagHierarchyID : {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    childTagID : {
      type: 'integer',
      index: true
    },
    parentTagID : {
      type: 'integer',
      index: true
    },
    level : {
      type: 'integer'
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
    ancestorTagID : {
      type: 'integer',
      index: true
    }
  }
};
