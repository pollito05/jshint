"use strict";

var fs = require("fs");

var browserify = require("browserify");

var bundle = browserify();
var fixtureDir = __dirname + "/../unit/fixtures";

bundle.require(__dirname + "/fs.js", { expose: "fs" });
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
      "}())"
    ].join("");

    fs.writeFileSync(__dirname + "/../browser-unit-tests.js", src);
  });
});
