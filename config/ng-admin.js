/**
 * Configuration for ng-admin interface
 */

module.exports.ngAdmin = {

  /**
   * An array of the models to use.  By default, all the app's models will be used.  Override this behaviour by
   * supplying a value for 'models'.  E.g.
   *
   * models: {
   *
   *   // This will include myModel in all views (list, edit, create), and will use all integer, string and datetime
   *   // fields in the list view and all fields other than id and updatedAd in the edit/create views.
   *   // Additionally, all string/text fields will be used for searching in the model's list view.
   *
   *   myModel: {},
   *
   *   // To override the default behaviour:
   *
   *   myOtherModel: {
   *     // By specifying a 'fields' property, the default behaviour of including all fields is over-ridden, and
   *     // now only fields with keys here will be used
   *     fields: {
   *       // The 'name' field will be used in all views (list, edit, create)
   *       name: {},
   *       // For each view this behaviour can be over-ridden as follows
   *       // The 'phone' field will not occur in the list view, but will be searched
   *       phone: {
   *         inListView: false
   *       },
   *       // The 'content' field will not occur in the list view, and will be excluded from searching
   *       content: {
   *         inListView: false,
   *         searchable: false
   *       }
   *     }
   *   }
   *
   *   // Suppose you've got two has-many related models.  By default they will be identified in lists by their primary
   *   // key field.  This can be customised using the 'targetField' property.  In the following setup for example, the
   *   // appointments listed on a person edit-view will appear using their description, and the people appearing on
   *   // and appointment edit-view will be listed using the 'name' field.
   *
   *   person: {
   *     name: {},
   *     appointments: {
   *       targetField: 'description'
   *     }
   *   }
   *
   *   appointment: {
   *     time: {},
   *     description: {}
   *     people: {
   *       targetField: 'name'
   *     }
   *   }
   *
   * }
   *
   */

};