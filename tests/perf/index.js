"use strict";

var path = require("path");

var fetchRepo = require("./util/fetch-repo");
var installNpmDeps = require("./util/install-npm-deps");
var benchmark = require("./util/benchmark");

var pkg = require("../../package.json");
var repoUrl = pkg.repository.url;
var prevRelease = pkg.version;
var referenceDir = path.resolve(__dirname, "jshint-reference");
var workingDir = path.resolve(__dirname, "../..");
var fixtures = Object.keys(require("./allowances.json"));

console.log("Fetching JSHint repository...");
fetchRepo(referenceDir, repoUrl, prevRelease)
  .then(function() {
      console.log("Installing Node.js modules...");
      installNpmDeps(referenceDir, function(err) {
        if (err) {
          console.error("Unable to install npm dependencies.");
          console.error(err);
          process.exit(1);
          return;
        }
        console.log("Benchmarking...");

        benchmark({
          fixtures: fixtures,
          referenceDir: referenceDir,
          workingDir: workingDir,
          prevRelease: prevRelease,
          done: function(results) {
            var passed = true;
            console.log("\nBenchmark Results\n=================");

            results.forEach(function(result) {
              passed = passed && result.passed;
              console.log(
                "File '" + result.fixture + "' " +
                (result.passed ? "passed" : "failed")
              );
              console.log("    " + result.message);
              console.log(
                "    Allowance: " + (100 * result.allowance).toFixed() + "%"
              );
              console.log(
                "    Delta:     " + (100 * result.delta).toFixed(2) + "%"
              );
              console.log("    Raw stats: " + JSON.stringify(result.stats));
              console.log();
            });

            if (!passed) {
              process.exit(1);
            }
          }
        });
      });
    }, function(err) {
      console.error("Unable to initialize a reference repository.");
      console.error(err);
      process.exit(1);
    });
