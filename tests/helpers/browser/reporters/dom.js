"use strict";

function DOMReporter(options) {
  this.el = options.el;
  this.document = this.el.ownerDocument;

  this.header = this.create("h1", "nodeunit-header");
  this.banner = this.create("h2", "nodeunit-banner");
  this.userAgent = this.create("h2", "nodeunit-userAgent");
  this.tests = this.create("ol", "nodeunit-tests");
  this.result = this.create("p", "nodeunit-testresult");

  this.el.appendChild(this.header);
  this.el.appendChild(this.banner);
  this.el.appendChild(this.userAgent);
  this.el.appendChild(this.tests);
  this.el.appendChild(this.result);
}

module.exports = DOMReporter;

DOMReporter.prototype.create = function(tagName, id) {
  var el = this.document.createElement(tagName);

  if (id) {
    el.setAttribute("id", id);
  }

  return el;
};

DOMReporter.prototype.testDone = function(name, assertions) {
  var test = this.create("li");
  var strong = this.create("strong");
  strong.innerHTML = name + " <b style='color: black;'>(" +
    "<b class='fail'>" + assertions.failures() + "</b>, " +
    "<b class='pass'>" + assertions.passes() + "</b>, " +
    assertions.length +
  ")</b>";
  test.className = assertions.failures() ? "fail": "pass";
  test.appendChild(strong);

  var aList = this.create("ol");
  aList.style.display = "none";

  test.onclick = function () {
    var d = aList.style.display;
    aList.style.display = (d == "none") ? "block": "none";
  };

  for (var i=0; i<assertions.length; i++) {
    var li = this.create("li");
    var a = assertions[i];

    if (a.failed()) {
      li.innerHTML = (a.message || a.method || "no message") +
        "<pre>" + (a.error.stack || a.error) + "</pre>";
      li.className = "fail";
    }
    else {
      li.innerHTML = a.message || a.method || "no message";
      li.className = "pass";
    }

    aList.appendChild(li);
  }
  test.appendChild(aList);
  this.tests.appendChild(test);
};

DOMReporter.prototype.done = function(duration, assertions) {
  var failures = assertions.failures();
  this.banner.className = failures ? "fail": "pass";

  this.result.innerHTML = "Tests completed in " + duration +
    " milliseconds.<br/><span class='passed'>" +
    assertions.passes() + "</span> assertions of " +
    "<span class='all'>" + assertions.length + "<span> passed, " +
    assertions.failures() + " failed.";
};
