define([
  'jquery',
  'underscore',
  'shared/views/base',
  'text!./listItem.html'

], function ($, _, BaseView, listItemTemplate) {

  return BaseView.extend({
    initialize: function (args) {
    },

    render: function (note) {
      this.note = note;

      var self = this;
      this.note.once('change', function(){
        self.render(note)
      });
      this.$el.html(listItemTemplate);
      var $preview = this.$(".preview");
      $preview.html(note.get('value'));

      if (note.get("highlightLang") && note.get("highlightLang") !== "text"){
        hljs.highlightBlock($preview[0]);
      } else {
        $preview.addClass('hljs');
      }

      this.$(".timestamp").html(moment(note.get("updated_at")).format("lll"));
      return this;
    },
    events:{
      'click': 'openNote'
    },
    openNote: function(){
      if (this.note.id){
        Backbone.history.navigate('/notes/' + this.note.id, true)
      } else {
        this.remove();
      }
    }

  });


});
