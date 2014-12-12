// Require.js Configurations
// -------------------------
require.config({

  // Sets the js folder as the base directory for all future relative paths
  baseUrl: "/js/app",

  // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
  // probably a good idea to keep version numbers in the file names for updates checking
  paths: {

    // Core Libraries
    // --------------

    "jquery": "../libs/jquery",

    "underscore": "../libs/lodash",

    "backbone": "../libs/backbone",

    // Plugins
    // -------
    "ace": "//cdn.jsdelivr.net/ace/1.1.8/noconflict/ace",
    "sjcl": "../libs/sjcl",
    "backbone.validateAll": "../libs/plugins/Backbone.validateAll",
    "bootstrap": "../libs/plugins/bootstrap",
    "firebase": "https://cdn.firebase.com/js/client/2.0.6/firebase",
    "highlightjs": "//cdn.jsdelivr.net/highlight.js/8.4/highlight.min",
    "lz-string": "../libs/lz-string",
    "localstorage": "../libs/plugins/Backbone.localStorage",
    "moment": "//cdn.jsdelivr.net/momentjs/2.8.4/moment-with-locales.min",
    "text": "../libs/plugins/text"

  },
  waitSeconds: 3,

  // Sets the configuration for your third party scripts that are not AMD compatible
  shim: {


    // Twitter Bootstrap jQuery plugins
    "bootstrap": ["jquery"],

    // Backbone.validateAll plugin that depends on Backbone
    "backbone.validateAll": ["backbone"]

  }

});