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
        Backbone.history.start();

      },

      routes: {
        "": "index"
      },

      index: function () {
        new MainView().render();
      }

    });

    // Returns the DesktopRouter class
    return router;

  }
);