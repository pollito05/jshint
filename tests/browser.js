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

/*bundle.require(fs.createReadStream(__dirname + "/fs.js"), { expose: "fs" });
bundle.add(__dirname + "/run-all.js");

bundle.bundle(function(err, src) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  fs.readdir(fixtureDir, function(err, files) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    var fsCache = {};
    files.forEach(function(fileName) {
      var relativeName = "/tests/unit/fixtures/" + fileName;
      fsCache[relativeName] = fs.readFileSync(
        fixtureDir + "/" + fileName, { encoding: "utf-8" }
      );
    });
    src += [
      "(function() {",
      " window.JSHintTestFixtures = " + JSON.stringify(fsCache) + ';',
      "}());"
    ].join("");

    fs.writeFileSync(__dirname + "/../browser-unit-tests.js", src);
  });
});
*/
