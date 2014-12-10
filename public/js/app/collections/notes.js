define([
  'jquery',
  'backbone',
  'localstorage',
  'models/note'
], function ($, Backbone, localstorage, NoteModel) {
  return Backbone.Collection.extend({
    model: NoteModel,
    localStorage: new Backbone.LocalStorage("Notes"), // Unique name within your app.
    comparator: function (model) {
      return model.get('updated_at');
    }
  });
});
