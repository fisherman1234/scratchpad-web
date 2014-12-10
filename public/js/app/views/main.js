define([
  'jquery',
  'underscore',
  'shared/views/base',
  'views/list/list',
  'views/editor/editor',
  'text!./main.html'

], function ($, _, BaseView, ListView, EditorView, mainTemplate) {

  return BaseView.extend({
    initialize: function (args) {
      this.list = new ListView();
      this.editor = new EditorView();
    },
    el: "#scratchpad-app",

    render: function (options) {
      this.options = options || {};
      this.options.parent = this;

      this.$el.html(mainTemplate);
      this.list.setElement(this.$("#list")).render(this.options);
      this.editor.setElement(this.$("#editor")).render(this.options);
      return this;
    }

  });


});
