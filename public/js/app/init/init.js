// DesktopInit.js
// --------------

// Includes Desktop Specific JavaScript files here (or inside of your Desktop router)
require(["jquery", "backbone", "moment", "backbone.validateAll", "ace", "lz-string", "routers/router", "bootstrap"],

  function($, Backbone, moment, bv, a, lz, DesktopRouter) {

    // Instantiates a new Desktop Router instance
    new DesktopRouter();

  }

);