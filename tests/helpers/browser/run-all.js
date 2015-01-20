var nodeunit = require('nodeunit');
var DOMReporter = require('./reporters/dom');
var ConsoleReporter = require('./reporters/console');
var start = new Date().getTime();

var domReporter = new DOMReporter({ el: document.body });
var consoleReporter = new ConsoleReporter();

nodeunit.runModules({
  parser: require('../../unit/parser')
}, {
  moduleStart: function(name) {
  },
  testDone: function(name, assertions) {
    domReporter.testDone(name, assertions);
    consoleReporter.testDone(name, assertions);
  },
  done: function(assertions) {
    var duration = new Date().getTime() - start;

    domReporter.done(duration, assertions);
    consoleReporter.done(duration, assertions);
  }
});
