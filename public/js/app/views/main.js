define([
  'jquery',
  'underscore',
  'shared/views/base',
  'collections/notes',
  'views/list/list',
  'views/editor/editor',
  'text!./main.html'

], function ($, _, BaseView, NoteCollection, ListView, EditorView, mainTemplate) {

  return BaseView.extend({
    initialize: function (args) {
      this.list = new ListView();
      this.editor = new EditorView();
      this.notes = new NoteCollection();
    },
    el: "#scratchpad-app",

    render: function (options) {
      this.options = options || {};
      this.options.parent = this;
      var self = this;

      if (!this.rendered){
        this.notes.fetch().done(function () {
          self.doRender();
        });
      } else {
        this.editor.render(this.options);
      }

      return this;
    },
    doRender: function(){
      this.notes.sort();
      this.$el.html(mainTemplate);
      this.list.setElement(this.$("#list")).render(this.options);
      this.editor.setElement(this.$("#editor")).render(this.options);
      this.rendered = true;
    }

  });


});
