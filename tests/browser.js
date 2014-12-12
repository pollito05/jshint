"use strict";

var phantom = require("phantom");
var createTestServer = require("./helpers/browser/server");
var port = 8045;

phantom.create(function(ph) {
  ph.createPage(function(page) {
    createTestServer(port, function(server) {
      page.onConsoleMessage(function(str) {
        console.log(str);
      });

      page.set('onCallback', function(err) {
        ph.exit();
        server.close();
        if (err) {
          process.exit(1);
        }
      });

      page.onError(function(msg, trace) {
        console.error(msg);
        console.error(trace);
        process.exit(1);
      });

      page.open("http://localhost:" + port, function () {});
    });
  });
});
