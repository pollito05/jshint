"use strict";
var fs = require("fs");
var http = require("http");
var DuplexStream = require("stream").PassThrough;
var url = require("url");

var browserify = require("browserify");
var fixtureDir = __dirname + "/../../unit/fixtures";
var build = require(__dirname + '/../../../scripts/build');
var testDir = "../../unit";

var makeRunAllScript = function() {
  var stream = new DuplexStream();

  fs.readdir(__dirname + "/" + testDir, function(err, allFiles) {
    var testIncludes = allFiles.filter(function(file) {
      return /\.js$/i.test(file);
    }).map(function(file) {
      return "\"" + file + "\": require(\"" + testDir + "/" + file + "\")";
    }).join(",\n");

    var src = '';
    stream.on('data', function(chunk) {
      src += chunk;
    });

    (function() {
      var src = '';
      var runallStream = fs.createReadStream(__dirname + "/run-all.js.tmpl");
      runallStream.on('data', function(chunk) {
        src += chunk;
      });

      runallStream.on('end', function() {
        stream.write(
          src.replace(/{{\s*INJECT_TEST_INCLUDES\s*}}/, testIncludes)
        );
        stream.end();
      });
    }());
  });

  return stream;
};

var routes = {
  "": function(req, res) {
    fs.readFile(__dirname + "/index.html", function(err, contents) {
      if (err) {
        res.statusCode = 500;
        res.end(err.message);
        return;
      }

      res.setHeader("content-type", "text/html");
      res.end(
        String(contents).replace(/{{\s*NOW\s*}}/g, (new Date()).getTime())
      );
    });
  },
  "jshint.js": function(req, res) {
    build('web', function(err, version, src) {
      res.end(src);
    });
  },
  "tests.js": function(req, res) {
    var bundle = browserify();
    bundle.require(fs.createReadStream(__dirname + "/fs.js"), { expose: "fs" });
    bundle.add(makeRunAllScript(), { basedir: __dirname });

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
