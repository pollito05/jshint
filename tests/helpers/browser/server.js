"use strict";
var fs = require("fs");
var http = require("http");
var url = require("url");

var browserify = require("browserify");
var build = require(__dirname + '/../../../scripts/build');

var routes = {
  "": function(req, res) {
    res.setHeader("content-type", "text/html");
    res.end([
      "<DOCTYPE html>",
      "<html>",
      "  <head>",
      "    <meta charset='UTF-8'></meta>",
      "    <title>JSHint Browser Build Testing Server</title>",
      "  </head>",
      "  <body>",
      "  <script src='jshint.js?" + Date.now() + "'></script>",
      "  <script src='tests.js?" + Date.now() + "'></script>",
      "  </body>",
      "</html>"
    ].join("\n"));
  },
  "jshint.js": function(req, res) {
    build('web', function(err, version, src) {
      res.end(src);
    });
  },
  "tests.js": function(req, res) {
    var bundle = browserify();
    bundle.require(fs.createReadStream(__dirname + "/fs.js"), { expose: "fs" });
    bundle.add(__dirname + "/run-all.js");

    bundle.bundle(function(err, src) {
      if (err) {
        res.statusCode = 500;
        res.end(err.message);
        return;
      }

      fs.readdir(fixtureDir, function(err, files) {
        if (err) {
          res.statusCode = 500;
          res.end(err.message);
          return;
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

        res.end(src);
      });
    });
  }
};

module.exports = function(port, done) {
  var server = http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname.slice(1);

    if (pathname in routes) {
      routes[pathname](req, res);
      return;
    }

    res.statusCode = 404;
    res.end('not found');
  });

  server.listen(process.env.NODE_PORT || 8045, function() {
    done(server);
  });
};


if (require.main === module) {
  console.log("Starting JSHint browser build testing server.");
  console.log(
    "(override default port via the NODE_PORT environmental variable)"
  );

  module.exports(process.env.NODE_PORT || 8045, function(server) {
    console.log("Server now listening on port " + server.address().port);
  });
}
