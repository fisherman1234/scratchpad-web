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

      window.test = this;

      if (!this.options.noteId){
        this.model = this.notes._prepareModel();
        this.notes.add(this.model);
      } else {
        var fetched = this.notes.get(this.options.noteId);
        if (fetched){
          this.model = fetched;
          var aceLang = this.model.get('aceLang');
          if (aceLang){
            this.aceEditor.getSession().setMode(aceLang);
          }
        } else {
          this.model = this.notes._prepareModel();
          this.notes.add(this.model);
        }
      }

      var noteTime = this.model.get("updated_at") ? moment(this.model.get("updated_at")) : moment();
      this.$(".timestamp").text(noteTime.format('lll'));

      this.aceEditor.setValue(this.model.get("value"), -1);

      this.aceEditor.getSession().on('change', function (e) {
        self.onChange(e);
      });


      return this;
    },
    events: {
      'click .add-note': 'addNote'
    },
    addNote: function(){
      Backbone.history.navigate('/loading', true); // to force a refresh of the top url
      Backbone.history.navigate('/notes/new', true);
    },
    onChange: _.debounce(function(event){
      var value = this.aceEditor.getValue();

      var detectedLang = hljs.highlightAuto(value).language;
      var aceLang = this.languageMapping[detectedLang];
      if (aceLang){
        console.log('detected lang', aceLang);
        this.aceEditor.getSession().setMode(aceLang);
      }

      this.model.save({value: value, updated_at: moment().toJSON(), aceLang: aceLang, highlightLang: detectedLang});


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
    },
    postGistToGithub: function(){
      var value = this.aceEditor.getValue();
      var self = this;

      if (!value || value.length === 0) {
        return;
      }

      var data = {
        "description": this.model.get('id'),
        "public": false,
        "files": {
          "content": {
            "content": value
          }
        }
      };



      $.ajax({
        url: 'https://api.github.com/gists',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(data)
      })
        .success(function (e) {
          self.model.save({gistId: e.id});
        })
        .error(function (e) {
          console.warn("gist save error", e);
        });
    }

  });


});
