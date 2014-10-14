"use strict";

var state = {
  syntax: {},

  reset: function () {
    this.tokens = {
      prev: null,
      next: null,
      curr: null
    };

    this.option = {};
    this.ignored = {};
    this.directive = {};
    this.jsonMode = false;
    this.jsonWarnings = [];
    this.lines = [];
    this.tab = "";
    this.cache = {}; // Node.JS doesn't have Map. Sniff.
    this.ignoredLines = {};
    this.inferredFnNames = [];

    // Blank out non-multi-line-commented lines when ignoring linter errors
    this.ignoreLinterErrors = false;
  },

  inferFnName: function() {
    if (this.inferredFnNames.length === 0) {
      return "";
    }

    return this.inferredFnNames.map(function(token, idx) {
      if (token.type === "(string)") {
        return "[\"" + token.value + "\"]";
      } else if (token.exprName) {
        return "[expression]";
      }
      return (idx > 0 ? "." : "") + token.value;
    }).join("");
  }
};

exports.state = state;
