var nodeunit = window.nodeunit = require('nodeunit');
// The browser reporter is not explicitly required by Nodeunit, so it must be
// imported and attached here to direct Browserify to inline it.
nodeunit.reporters.browser = require('nodeunit/lib/reporters/browser');

nodeunit.reporters.browser.run({
  parser: require('../unit/parser')
});
