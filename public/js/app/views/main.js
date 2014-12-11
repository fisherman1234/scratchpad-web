define([
  'jquery',
  'underscore',
  'shared/views/base',
  'collections/notes',
  'views/list/list',
  'views/editor/editor',
  'views/password',
  'text!./main.html'

], function ($, _, BaseView, NoteCollection, ListView, EditorView, PasswordView, mainTemplate) {

  return BaseView.extend({
    initialize: function (args) {
      this.list = new ListView();
      this.editor = new EditorView();
      this.notes = new NoteCollection();
      this.password = new PasswordView();
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
        this.renderRight();
      }

      return this;
    },
    doRender: function(){
      this.notes.sort();
      this.$el.html(mainTemplate);
      this.list.setElement(this.$("#list")).render(this.options);

      this.renderRight();
      this.rendered = true;
    },
    renderRight: function(){
      if (this.options.firebaseId) {
        this.password.setElement(this.$("#editor")).render(this.options);
      } else {
        this.editor.setElement(this.$("#editor")).render(this.options);
      }
    }

  });


});
