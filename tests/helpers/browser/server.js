"use strict";
var fs = require("fs");
var http = require("http");
var Stream = require("stream");
var path = require("path");
var url = require("url");

var browserify = require("browserify");
var buildJSHint = require(__dirname + "/../../../scripts/build");
var mainPath = path.resolve(
  __dirname + "/../../../" + require("../../../package.json").main
);

var build = {
  "jshint.js": function(done) {
    buildJSHint("web", function(err, version, src) {
      done(err, src);
    });
  },

  "index.html": function(done) {
    fs.readFile(__dirname + "/index.html.tmpl", function(err, contents) {

      if (err) {
        done(err);
        return;
      }

      done(
        null, String(contents).replace(/{{\s*NOW\s*}}/g, (new Date()).getTime())
      );
    });
  },

  fixtures: function(done) {
    var fixtureDir = __dirname + "/../../unit/fixtures";

    fs.readdir(fixtureDir, function(err, files) {
      var src = "";
      var fsCache = {};

      if (err) {
        done(err);
        return;
      }

      files.forEach(function(fileName) {
        var relativeName = "/tests/unit/fixtures/" + fileName;

        fsCache[relativeName] = fs.readFileSync(
          fixtureDir + "/" + fileName, { encoding: "utf-8" }
        );
      });

      src += [
        "(function() {",
        "  window.JSHintTestFixtures = " + JSON.stringify(fsCache) + ";",
        "}());"
      ].join("");

      done(null, src);
    });
  },

  runAllScript: function() {
    var testDir = "../../unit";
    var stream = new Stream.PassThrough();

    fs.readdir(__dirname + "/" + testDir, function(err, allFiles) {
      var testIncludes = allFiles.filter(function(file) {
        return /\.js$/i.test(file);
      }).map(function(file) {
        return "\"" + file + "\": require(\"" + testDir + "/" + file + "\")";
      }).join(",\n");

      var src = "";
      stream.on("data", function(chunk) {
        src += chunk;
      });

      (function() {
        var src = "";
        var runallStream = fs.createReadStream(__dirname + "/run-all.js.tmpl");
        runallStream.on("data", function(chunk) {
          src += chunk;
        });

        runallStream.on("end", function() {
          stream.write(
            src.replace(/{{\s*INJECT_TEST_INCLUDES\s*}}/, testIncludes)
          );
          stream.end();
        });
      }());
    });

    return stream;
  },

  "tests.js": function(done) {
    var bundle = browserify();
    var includedFaker = false;
    bundle.require(fs.createReadStream(__dirname + "/fs.js"), { expose: "fs" });
    bundle.add(build.runAllScript(), { basedir: __dirname });

    bundle.transform(function(filename) {
      var faker;

      if (filename === mainPath) {
        includedFaker = true;
        faker = new Stream.Readable();
        faker._read = function() {};
        faker.write = function() {};
        faker.push("exports.JSHINT = window.JSHINT;");
        faker.push(null);
        return faker;
      }

      return new Stream.PassThrough();
    });

    bundle.bundle(function(err, src) {
      if (err) {
        done(err);
        return;
      }

      if (!includedFaker) {
        done(new Error(
          "JSHint extraction module not included in bundled test build."
        ));
        return;
      }

      build.fixtures(function(err, fixtureBundle) {
        if (err) {
          done(err);
          return;
        }

        done(null, src + fixtureBundle);
      });
    });
  }
};

var contentTypes = {
  ".html": "text/html",
  ".js": "application/javascript"
};

module.exports = function(port, done) {
  var server = http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname.slice(1) || "index.html";
    var contentType = contentTypes[path.extname(pathname)];

    if (!Object.hasOwnProperty.call(build, pathname)) {
      res.statusCode = 404;
      res.end("not found");
    }

    build[pathname](function(err, src) {
      if (err) {
        res.statusCode = 500;
        res.end(err.message);
        return;
      }

      res.setHeader("content-type", contentType);
      res.end(src);
    });
  });

  server.listen(port, function() {
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
