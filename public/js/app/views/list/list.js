define([
  'jquery',
  'underscore',
  'shared/views/base',
  'text!./list.html'

], function ($, _, BaseView, listTemplate) {

  return BaseView.extend({
    initialize: function (args) {

    },

    render: function (options) {
      this.options = options;

      this.$el.html(listTemplate);
      this.options.parent.notes.each(function(note){
        console.log(note);
      });
      return this;
    }

  });


});
