/**
 * Controller for ng-admin.  Generates the config settings for the ng-admin Angular app, using model definitions from
 * the Sails app in which it sits.
 */


module.exports = (function() {
  'use strict';
  return {

    index: function(req, res) {

      function getEntityDefinitions() {


        // Model definitions.  These will be read from the config, falling back on using all models which have controllers.
        var modelDefs;

        /**
         * This is the function which will provide that fallback/default config.  That is, an object with:
         * as keys the models which have controllers, and
         * as values the empty object {}.
         * @returns {{}}
         */
        function defaultModelDefs() {
          var defs = {};
          Object.keys(sails.models).filter(function(modelName) {
            return sails.controllers.hasOwnProperty(modelName);
          }).forEach(function (modelName) {
            defs[modelName] = {};
          });
          return defs;
        }

        /**
         * Whether a given field should by default appear in the List view.
         * @param field
         * @returns {boolean}
         */
        function inListViewByDefault(field) {
          switch(field.type) {
            case 'string':
            case 'integer':
            case 'datetime':
              return true;
            default:
              return false;
          }
        }

        /**
         * Whether a given field should by default be used for searches.
         * @param field
         * @returns {boolean}
         */
        function isSearchableByDefault(field) {
          switch(field.type) {
            case 'string':
            case 'text':
              return true;
          }
          return false;
        }

        /**
         * Whether a given field should by default appear in the Edit view.
         * @param field
         * @returns {boolean}
         */
        function inEditViewByDefault(field) {
          if ('updatedAt' === field.name || 'id' === field.name) {
            return false;
          }
          // Ensures we don't include this field if related field is absent:
          return ! fieldLacksRelated(field);
        }

        /**
         * Whether a given field should by default appear in the Create view.
         * @param field
         * @returns {boolean}
         */
        function inCreateViewByDefault(field) {
          return inEditViewByDefault(field);
        }

        /**
         * True iff the field refers to a model which we're not representing.
         * @param field
         * @returns {boolean}
         */
        function fieldLacksRelated(field) {
          var refdModel = field.collection || field.model;
          return !! refdModel && ! modelDefs[refdModel];
        }

        /**
         * Whether a given field should by default appear as a link, if it's in the List view.
         * @param field
         * @returns {boolean}
         */
        function isDetailLinkByDefault(field) {
          return true;
        }

        function ngAdminFieldType(field) {
          switch (field.type) {
            case 'integer':
            case 'float':
              return 'number';
            case 'datetime':
            case 'date':
              return 'date';
            case 'boolean':
              return 'boolean';
            case 'string':
            case 'time':
              return 'string';
            case 'array':
              return 'choices';

//            case 'binary':
//            // @TODO Binary?
//
//            case 'text':
//            case 'json':
//            case 'alphanumeric':
//            case 'alphanumericdashed':
            default:
              return 'text';
          }
        }


        /**
         * Client-side JS code for making the ng-admin field
         */
        function fieldFactory(field) {

          function fieldConstructor(field) {

            if (field.collection) {

              // If the 'via' is a foreign key, it's a Many-to-1 Otherwise it's many-to-many.
              // However, for ng-admin, both need to be "ReferenceMany" fields.
              var referenceType = 'Many'; // field.via && sails.models[field.collection].definition[field.via].foreignKey ? 'dList' : 'Many';
              return 'Reference' + referenceType + '(' +
                JSON.stringify(field.name) +
                ').targetEntity(' +
                varName(field.collection) +
                ').targetField(' +
                'new Field(' + JSON.stringify(field.targetField || sails.models[field.collection].primaryKey) + ')' +
                ')';
            }

            if (field.model) {
              return 'Reference(' +
                JSON.stringify(field.name) +
                ').targetEntity(' +
                varName(field.model) +
                ').targetField(' +
                'new Field(' + JSON.stringify(field.targetField || sails.models[field.model].primaryKey) + ')' +
                ')';
            }

            return 'Field(' + JSON.stringify(field.name) + ').type(' + JSON.stringify(ngAdminFieldType(field)) + ')';
          }

          var factory = 'new ' + fieldConstructor(field);

          if (field.isDetailLink) {
            factory += '.isDetailLink(true)';
          }

          return factory;
        }

        /**
         * Fleshes out a field definition with defaults.
         * @param field
         * @returns {Object}
         */
        function fieldDefinition(field) {
          var _field = _.extend({
            inListView: inListViewByDefault(field),
            inEditView: inEditViewByDefault(field),
            inCreateView: inCreateViewByDefault(field),
            searchable: isSearchableByDefault(field),
            isDetailLink: isDetailLinkByDefault(field)
          }, field);
          _field.jsFieldFactory = fieldFactory(_field);
          return _field;
        }

        /**
         * Makes an array of field definitions, adding model Attribute defaults and defaults based on field types.
         * @param modelAttributes
         * @param fieldDefs
         * @returns {*}
         */
        function fieldsArray(modelAttributes, fieldDefs) {
          if ('undefined' === typeof fieldDefs) {
            fieldDefs = modelAttributes;
          }
          return Object.keys(fieldDefs).map(function(fieldName) {
            return _.extend(
              modelAttributes[fieldName],
              fieldDefs[fieldName],
              {name: fieldName}
            );
          }).map(fieldDefinition);
        }

        /**
         * JS Variable name for a given entity
         * @param modelName
         * @returns {string}
         */
        function varName(modelName) {
          return '__sailsModel_' + modelName;
        }

        modelDefs = sails.config.ngAdmin.models || defaultModelDefs();
        // Return Entity definitions by fleshing out the relevant config
        return Object.keys(modelDefs).map(function getEntityDefinitionFromModelName(modelName) {
            var model = sails.models[modelName],
              fieldDefs = fieldsArray(model._attributes, modelDefs[modelName].fields),
              definition = {
                // JS-escaped model name
                jsonName: JSON.stringify(modelName),
                // Name of the variable for the entity, in the generated view's JavaScript
                varName: varName(modelName),
                // JS-escaped ID field name
                jsonIdField: JSON.stringify(model.primaryKey),
                // JS-escaped array of field names which are searchable
                jsonSearchFields: JSON.stringify(fieldDefs.filter(function(definition) {
                  return false !== definition.isSearchable;
                }).map(function(definition) {
                  return definition.name;
                })),
                // Field definitions
                fields: fieldDefs
              };

            return definition;

          }
        );
      }

      res.locals.layout = '';
      res.view('ng-admin', {
        jsonAppName: JSON.stringify('Admin'),
        jsonUri: JSON.stringify(req.baseUrl),
        entities: getEntityDefinitions()
      });

    }

  };
})();
