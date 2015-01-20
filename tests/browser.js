"use strict";

var phantom = require("phantom");
var createTestServer = require("./helpers/browser/server");
var port = 8045;

phantom.create(function (ph) {
  ph.createPage(function (page) {
    createTestServer(port, function(server) {
      page.onConsoleMessage(function(str) {
        console.log('logged:', str);
        if (/^suite:/.test(str)) {
          ph.exit();
          server.close();
        }
      });

      page.open("http://localhost:" + port, function () {});
    });
  });
});
