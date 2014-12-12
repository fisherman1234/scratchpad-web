// DesktopRouter.js
// ----------------
define([
    "jquery",
    "backbone",
    "views/main"
  ],

  function ($, Backbone, MainView) {

    var router = Backbone.Router.extend({

      initialize: function () {

        // Tells Backbone to start watching for hashchange events
        Backbone.history.start({pushState: true});

      },

      routes: {
        "": "index",
        "loading": "loading",
        "notes/:noteId": "noteId",
        "saved/:firebaseId": "loadFirebase"
      },
      loading: function(){

      },
      mainView: function(){
        if (!this._mainView){
          this._mainView = new MainView();
        }
        return this._mainView;
      },
      index: function () {
        this.mainView().render();
      },
      noteId: function(noteId) {
        this.mainView().render({noteId: noteId})
      },
      loadFirebase: function(firebaseId){
        this.mainView().render({firebaseId: firebaseId})
      }

    });

    // Returns the DesktopRouter class
    return router;

  }
);