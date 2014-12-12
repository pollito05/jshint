"use strict";

function ConsoleReporter() {}

module.exports = ConsoleReporter;

ConsoleReporter.prototype.testDone = function(name, assertions) {
  console.log([
    "test", String(name).replace(/:/g, "-"), assertions.failures(),
    assertions.passes()
  ].join(":"));
};

ConsoleReporter.prototype.done = function(duration, assertions) {
  console.log([
    "all", "", assertions.failures(), assertions.passes()].join(":")
  );
};
