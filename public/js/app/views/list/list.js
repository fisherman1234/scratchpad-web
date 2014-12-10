define([
  'jquery',
  'underscore',
  'shared/views/base',
  'views/list/listItem',
  'text!./list.html'

], function ($, _, BaseView, ListItemView, listTemplate) {

  return BaseView.extend({
    initialize: function (args) {

    },
    render: function (options) {
      this.options = options;

      this.$el.html(listTemplate);
      var self = this;

      this.options.parent.notes.each(function(note){
        self.appendNote(note);
      });

      this.options.parent.notes.on('add', function(model){
        self.appendNote(model);
      });
      return this;
    },
    appendNote: function(note){
      var $ul = this.$("ul");
      var $li = $("<li class='snippet-list-item'/>");
      new ListItemView().setElement($li).render(note);
      $ul.prepend($li);
    }

  });


});
