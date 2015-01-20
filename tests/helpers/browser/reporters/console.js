'use strict';

function ConsoleReporter() {}

module.exports = ConsoleReporter;

ConsoleReporter.prototype.testDone = function(name, assertions) {
  console.log(
    ['test', name, assertions.failures(), assertions.passes()].join(':')
  );
};

ConsoleReporter.prototype.done = function(duration, assertions) {
  console.log(['suite', assertions.passes(), assertions.failures()].join(':'));
};
