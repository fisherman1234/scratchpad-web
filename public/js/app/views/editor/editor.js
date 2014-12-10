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
      var $select = this.$(".language-select");

      _.each(this.languageMapping, function(value, key){
        var $option = $("<option/>");
        $option.attr('value', key);
        $option.text(key);
        $select.append($option);
      });


      var self = this;

      // setup the editor
      this.aceEditor = ace.edit(this.$("#edit-content")[0]);
      this.aceEditor.setTheme("ace/theme/xcode");
      this.aceEditor.getSession().on('change', function (e) {
        self.onChange(e);
      });

      window.test = this;

      if (this.options.noteId && this.notes.get(this.options.noteId)) {
        this.model = this.notes.get(this.options.noteId);
        var aceLang = this.model.get('aceLang');
        if (aceLang) {
          this.aceEditor.getSession().setMode(aceLang);
          this.$(".language-select").val(this.model.get('highlightLang'));
        }
      } else {
        this.model = this.notes._prepareModel();
        this.notes.add(this.model);
      }

      // set header time.
      var noteTime = this.model.get("updated_at") ? moment(this.model.get("updated_at")) : moment();
      this.$(".timestamp").text(noteTime.format('lll'));

      // set editor value.
      this.aceEditor.setValue(this.model.get("value"), -1);


      return this;
    },
    events: {
      'click .add-note': 'addNote',
      'change .language-select': 'onLanguageSelectChanged'
    },
    onLanguageSelectChanged: function(){
      var lang = this.$(".language-select").val();
      var aceLang = this.languageMapping[lang];
      this.aceEditor.getSession().setMode(aceLang);
      this.model.save({aceLang: aceLang, highlightLang: lang});
    },
    addNote: function(){
      Backbone.history.navigate('/loading', true); // to force a refresh of the top url
      Backbone.history.navigate('/notes/new', true);
    },
    onChange: _.debounce(function(event){
      var value = this.aceEditor.getValue();

      if (value.length === 0 && this.model.isNew()){
        return;
      }


      var savedData = {value: value, updated_at: moment().toJSON()};

      if (!this.model.get('aceLang')){
        var detectedLang = hljs.highlightAuto(value).language;
        var aceLang = this.languageMapping[detectedLang];
        if (detectedLang && aceLang) {
          console.log('detected lang', aceLang);
          this.aceEditor.getSession().setMode(aceLang);
          savedData["aceLang"] = aceLang;
          savedData["highlightLang"] = detectedLang;
          this.$(".language-select").val(detectedLang);
        }
      }

      this.model.save(savedData);
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
      'sql': 'ace/mode/sql',
      'text': 'ace/mode/plain_text'
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
