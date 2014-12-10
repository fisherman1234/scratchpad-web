define([
  'jquery',
  'underscore',
  'moment',
  'shared/views/base',
  'collections/notes',
  'text!./editor.html'

], function ($, _, moment, BaseView, NoteCollection, editorTemplate) {

  return BaseView.extend({
    initialize: function (args) {
      this.notes = new NoteCollection();
    },

    render: function (options) {
      this.options = options;
      this.$el.html(editorTemplate);
      var self = this;

      this.aceEditor = ace.edit(this.$el[0]);
      this.aceEditor.setTheme("ace/theme/xcode");
      this.aceEditor.getSession().on('change', function (e) {
        self.onChange(e);
      });
      //editor.getSession().setMode("ace/mode/javascript");
      window.test = this;

      if (!this.options.id){
        this.model = this.notes._prepareModel();
      } else {
        var fetched = this.notes.get(this.options.id);
        if (fetched){
          this.model = fetched;
        } else {
          this.model = this.notes._prepareModel();
        }
      }
      return this;
    },
    onChange: _.debounce(function(event){
      var value = this.aceEditor.getValue();
      this.model.save({value: value, updated_at: moment().toJSON()});
      console.log(value);
    }, 300)

  });


});
