"use strict";

var phantom = require("phantom");
var createTestServer = require("./helpers/browser/server");
var port = 8045;

phantom.create(function (ph) {
  ph.createPage(function (page) {
    createTestServer(port, function(server) {
      var failures = [];

      page.onConsoleMessage(function(str) {
        var parts = str.split(":");
        var failureCount = parseInt(parts[2], 10);

        console.log(str);

        if (parts[0] === "all") {
          ph.exit();
          server.close();

          if (failureCount > 0) {
            failures.unshift("");
            console.error(failures.join("\n  "));
            process.exit(1);
          }
        } else if (failureCount > 0) {
          failures.push(str);
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
