define([
  'jquery',
  'underscore',
  'backbone',
  'sjcl'
], function ($, _, Backbone, sc) {
  return Backbone.Model.extend({
    saveToFirebase: function () {
      var myFirebaseRef = new Firebase("https://blazing-torch-9766.firebaseio.com/");

      var fireBaseId = this.id + "-" + Date.now();
      var fireBaseKey = "notes/" + fireBaseId;
      var fireBasePass = this.randomPass();

      var notesRef = myFirebaseRef.child(fireBaseKey);
      var deferred = new Backbone.$.Deferred();
      var self = this;

      var data = this.toJSON();
      data.value = sjcl.encrypt(fireBasePass, data.value);

      notesRef.set(data, function (error) {
        if (error){
          deferred.reject(error);
        } else {
          self.save({fireBaseId: fireBaseId, fireBasePass: fireBasePass});
          deferred.resolve();
        }
      });
      return deferred;
    },
    getFromFirebase: function(fireBaseKey, password){
      var myFirebaseRef = new Firebase("https://blazing-torch-9766.firebaseio.com/");
      var notesRef = myFirebaseRef.child("notes/" + fireBaseKey);
      var deferred = new Backbone.$.Deferred();
      var self = this;

      notesRef.on("value", function (snapshot) {

        try {
          var val = snapshot.val();
          val.value = sjcl.decrypt(password, val.value);
          self.set(val);
          deferred.resolve();
        }
        catch (err) {
          deferred.reject("There was an error retrieving this item");
        }

      }, function (errorObject) {
        console.log('error retrieving');
        deferred.reject("There was an error retrieving this item");
      });

      return deferred;
    },
    randomPass: function () {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()_+=-{}|[];:',./?><";

      var min = 20;
      var max = 40;
      var length = min + parseInt(Math.random() * (max - min + 1), 10);

      for (var i = 0; i < length; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }


      return text;
    },
    postGistToGithub: function () {
      var self = this;

      var data = {
        "description": this.get('id'),
        "public": false,
        "files": {
          "content": {
            "content": this.get('value')
          }
        }
      };


      return $.ajax({
        url: 'https://api.github.com/gists',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(data),
        success: function(e){
          self.save({gistId: e.id});
        }
      });
    }
  });
});
