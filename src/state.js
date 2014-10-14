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

  setFnName: function(nameToken) {
    this.inferredFnNames[this.inferredFnNames.length - 1] = nameToken;
  },

  inferFnName: function() {
    return this._inferFnName(this.inferredFnNames.length - 2);
  },
  inferFnNames: function() {
    return this.inferredFnNames.map(function(_, idx) {
      return this._inferFnName(idx);
    }, this);
  },

  _inferFnName: function(idx) {
    var nameToken = this.inferredFnNames[idx];
    var prefix = "";

    if (!nameToken) {
      return "";
    }

    if (nameToken.exprName) {
      return "[expression]";
    }

    if (nameToken.setterName) {
      prefix = "set ";
    } else if (nameToken.getterName) {
      prefix = "get ";
    }

    return prefix + nameToken.value;
  }
};

exports.state = state;
