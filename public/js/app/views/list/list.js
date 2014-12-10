define([
  'jquery',
  'underscore',
  'backbone',
  'shared/views/base',
  'views/list/listItem',
  'text!./list.html'

], function ($, _, Backbone, BaseView, ListItemView, listTemplate) {

  return BaseView.extend({
    initialize: function (args) {

    },
    render: function (options) {
      this.options = options;

      this.$el.html(listTemplate);
      var self = this;

      this.renderNotes(this.options.parent.notes);

      this.options.parent.notes.on('add', function(model){
        self.appendNote(model);
      });
      return this;
    },
    renderNotes: function(notes){
      this.$("ul").empty();
      var self = this;
      notes.each(function (note) {
        self.appendNote(note);
      });

    },
    appendNote: function(note){
      var $ul = this.$("ul");
      var $li = $("<li class='snippet-list-item'/>");
      new ListItemView().setElement($li).render(note);
      $ul.prepend($li);
    },
    events: {
      'keyup #search-query': 'onQueryUp'
    },
    onQueryUp: function(){
      var query = this.$("#search-query").val();
      var toRender;
      if (query.length > 0){
        var search  = new RegExp(query, 'i');
        toRender = new Backbone.Collection(this.options.parent.notes.filter(function (model) {
          return model.get("value") && model.get("value").match(search);
        }));
      } else {
        toRender = this.options.parent.notes;
      }
      this.renderNotes(toRender);

    }

  });


});
