define([
  'jquery',
  'underscore',
  'backbone',
  'shared/views/base',
  'text!./password.html'

], function ($, _, Backbone, BaseView, passwordTemplate) {

  return BaseView.extend({
    initialize: function (args) {
    },

    render: function (options) {
      this.options = options;
      this.notes = options.parent.notes;

      this.$el.html(passwordTemplate);
      return this;
    },
    events: {
      'submit': 'onPasswordSubmit'
    },
    onPasswordSubmit: function(event){
      event.stopPropagation();
      event.preventDefault();

      this.model = this.notes._prepareModel();

      var $passField = this.$(".note-password");
      var pass = $passField.val();
      $passField.attr('disabled', 'true');

      var self = this;

      this.model.getFromFirebase(this.options.firebaseId, pass).done(function(){
        console.log('done');
        self.notes.add(self.model);
        Backbone.history.navigate("/notes/" + self.model.id, true);
      }).fail(function(){
        $passField.removeAttr("disabled");
      })
    }
  });


});
