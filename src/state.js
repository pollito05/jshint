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

  pushFnName: function(nameToken) {
    this.inferredFnNames[this.inferredFnNames.length - 1].push(nameToken);
  },

  popFnName: function() {
    this.inferredFnNames[this.inferredFnNames.length - 1].pop();
  },

  inferFnName: function() {
    return this._inferFnName(this.inferredFnNames.length - 1);
  },
  inferFnNames: function() {
    return this.inferredFnNames.map(function(_, idx) {
      return this._inferFnName(idx);
    }, this);
  },

  _inferFnName: function(idx) {
    var names = this.inferredFnNames[idx];
    if (names.length === 0) {
      return "";
    }

    return names.map(function(token, idx) {
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
