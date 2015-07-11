"use strict";
var path = require("path");
var fs = require("fs");

var Benchmark = require("benchmark");
var allowances = require("../allowances.json");

var messages = {
  faster: "The working copy is even faster than we require! Consider " +
    "decreasing the 'allowance' in the `tests/perf/allowances.json` file.",
  slower: "The working copy is slower than we require. Please double-check " +
    "the efficiency of your code. If you feel the performance decrease is " +
    "necessary, you may increase the 'allowance' in the " +
    "`tests/perf/allowances.json` file.",
  equal: "No significant difference found."
};

/**
 * Interpret the results from the execution of a Benchmark.js Suite according
 * to any performance allowance defined for the file under test.
 *
 * @returns {Object} A description of the performance test results
 */
function interpretResults(suite, prevRelease, fileName) {
  var compared = suite[0].compare(suite[1]);
  var stats = {
    working: suite[0].stats,
    reference: suite[1].stats
  };
  var report = {
    fixture: fileName,
    stats: stats
  };
  var allowance = allowances[fileName] && allowances[fileName][prevRelease];

  if (!allowance) {
    allowance = 0;
  }

  report.allowance = allowance;

  // The performance of the working copy is *not* significantly different
  // than that of the previous release
  if (compared === 1) {

    report.delta = 0;

    // Failure is still possible if we've tightened our belts since the
    // last release--in those cases, we expect a significant difference.
    if (allowance < 0) {
      report.passed = false;
      report.message = messages.slower;
    } else {
      report.passed = true;

      if (allowance > 0) {
        report.message = messages.faster;
      } else {
        report.message = messages.equal;
      }
    }

  // The performance of the working copy is significantly different than
  // that of the previous release
  } else {
    report.delta =
      (stats.working.mean - stats.reference.mean) / stats.reference.mean;

    report.passed = report.delta <= allowance;
    report.message = report.passed ? messages.faster : messages.slower;
  }

  return report;
}

function benchmarkFile(options) {
  var suite = new Benchmark.Suite();
  var fixtureSrc = fs.readFileSync(
    path.resolve(__dirname, "../fixtures", options.fixture),
    { encoding: "utf-8" }
  );

  suite.add('Working Directory', function() {
    workingJSHint(JSHINT_BENCH.fixtureSrc);
  }, {
    setup: function() {
      var workingJSHint;
      // Clear the `require` cache to limit interactions from previous test
      // runs
      Object.keys(JSHINT_BENCH.require.cache).forEach(function(path) {
        delete JSHINT_BENCH.require.cache[path];
      });

      workingJSHint = JSHINT_BENCH.require(JSHINT_BENCH.paths.working).JSHINT;
    }
  })
  .add("Previous release", function() {
    referenceJSHint(JSHINT_BENCH.fixtureSrc);
  }, {
    setup: function() {
      var workingJSHint;
      // Clear the `require` cache to limit interactions from previous test
      // runs
      Object.keys(JSHINT_BENCH.require.cache).forEach(function(path) {
        delete JSHINT_BENCH.require.cache[path];
      });

      referenceJSHint = JSHINT_BENCH.require(
        JSHINT_BENCH.paths.reference
      ).JSHINT;
    }
  })
  .on("complete", function() {
    delete global.JSHINT_BENCH;

    options.done(interpretResults(this, options.prevRelease, options.fixture));
  });

  // This global leakage is necessary to expose values to the benchmark
  // context in Benchmark.js version 1.0.
  // TODO: Remove this when the underlying issue is resolved; see
  // https://github.com/bestiejs/benchmark.js/issues/94
  global.JSHINT_BENCH = {
    paths: {
      reference: options.referenceDir,
      working: options.workingDir
    },
    require: require,
    fixtureSrc: fixtureSrc
  };

  suite.run({ async: true });
}

module.exports = function(options, _results) {
  if (!_results) {
    _results = [];
  }

  if (options.fixtures.length === 0) {
    options.done(_results);
    return;
  }

  benchmarkFile({
    fixture: options.fixtures.pop(),
    workingDir: options.workingDir,
    referenceDir: options.referenceDir,
    prevRelease: options.prevRelease,
    done: function(result) {
      _results.push(result);

      module.exports(options, _results);
    }
  });
};
