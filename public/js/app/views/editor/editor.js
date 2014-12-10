define([
  'jquery',
  'underscore',
  'moment',
  'highlightjs',
  'shared/views/base',
  'text!./editor.html'

], function ($, _, moment, highlightjs, BaseView, editorTemplate) {

  return BaseView.extend({
    initialize: function (args) {
    },

    render: function (options) {
      this.options = options;
      this.notes = options.parent.notes;
      this.$el.html(editorTemplate);
      var self = this;

      this.aceEditor = ace.edit(this.$("#edit-content")[0]);
      this.aceEditor.setTheme("ace/theme/xcode");
      this.aceEditor.getSession().on('change', function (e) {
        self.onChange(e);
      });

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
      console.log(hljs.highlightAuto(value));

      var detectedLang = hljs.highlightAuto(value).language;
      var aceLang = this.languageMapping[detectedLang];
      if (aceLang){
        this.aceEditor.getSession().setMode(aceLang);
        console.log('will set lang to', aceLang);
      }

    }, 300),
    languageMapping: {
      'apache': 'ace/mode/apache_conf',
      'bash': 'ace/mode/batchfile',
      'coffeescript': 'ace/mode/coffee',
      'cpp': 'ace/mode/c_cpp',
      'cs': 'ace/mode/csharp',
      'css': 'ace/mode/css',
      'diff': 'ace/mode/diff',
      'http': 'ace/mode/html',
      'ini': 'ace/mode/ini',
      'java': 'ace/mode/java',
      'javascript': 'ace/mode/javascript',
      'json': 'ace/mode/json',
      'makefile': 'ace/mode/makefile',
      'xml': 'ace/mode/xml',
      'markdown': 'ace/mode/markdown',
      'nginx': 'ace/mode/nix',
      'objectivec': 'ace/mode/objectivec',
      'perl': 'ace/mode/perl',
      'php': 'ace/mode/php',
      'python': 'ace/mode/python',
      'ruby': 'ace/mode/ruby',
      'sql': 'ace/mode/sql'
    }

  });


});
