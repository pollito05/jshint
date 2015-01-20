'use strict';

function ConsoleReporter() {}

module.exports = ConsoleReporter;

ConsoleReporter.prototype.testDone = function(name, assertions) {
  console.log(name, assertions.failures(), assertions.passes());
};

ConsoleReporter.prototype.done = function(duration, assertions) {
  var failures = assertions.failures();

  console.log('Tests completed in ' + duration +
    ' milliseconds. ' + assertions.passes() + ' assertions of ' +
    assertions.length + ' passed, ' + assertions.failures() + ' failed.'
  );
};
