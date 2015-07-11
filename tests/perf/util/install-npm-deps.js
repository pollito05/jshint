"use strict";
var path = require("path");
var npm = require("npm");

module.exports = function(referenceDir, done) {
  var pkg = require(path.resolve(referenceDir, "package.json"));
  npm.load(pkg, function(err) {
    var packages;

    if (err) {
      done(err);
      return;
    }

    packages = Object.keys(pkg.dependencies).map(function(name) {
      return name + "@" + pkg.dependencies[name];
    });

    npm.commands.install(referenceDir, packages, done);
  });
};
