"use strict";

var phantom = require("phantom");
var createTestServer = require("./helpers/browser/server");
var port = 8045;

phantom.create(function (ph) {
  ph.createPage(function (page) {
    page.onConsoleMessage(function(str) {
      console.log('logged:', str);
    });
    createTestServer(port, function(server) {
      page.open("http://localhost:" + port, function (status) {
        page.evaluate(function() { return document.body.innerHTML; }, function(val) {
          console.log(val);
          ph.exit();
          server.close();
        });
      });
    });
  });
});
