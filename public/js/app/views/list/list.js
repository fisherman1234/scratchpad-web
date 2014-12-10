define([
  'jquery',
  'underscore',
  'shared/views/base',
  'text!./list.html'

], function ($, _, BaseView, listTemplate) {

  return BaseView.extend({
    initialize: function (args) {
    },

    render: function () {
      this.$el.html(listTemplate);
      return this;
    }

  });


});
