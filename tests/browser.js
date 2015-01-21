"use strict";

var phantom = require("phantom");
var createTestServer = require("./helpers/browser/server");
var port = 8045;

phantom.create(function (ph) {
  ph.createPage(function (page) {
    createTestServer(port, function(server) {
      page.onConsoleMessage(function(str) {
        var parts = str.split(":");
        var failures = parseInt(parts[3], 10);

        console.log(str);

        if (parts[0] === "all") {
          ph.exit();
          server.close();

          if (failures > 0) {
            process.exit(1);
          }
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
