"use strict";
var _ = require("underscore");

function Functor(name, token, scope, overwrites) {
  this["(name)"]       = name;
  this["(breakage)"]   = 0;
  this["(loopage)"]    = 0;
  this["(scope)"]      = scope;
  this["(tokens)"]     = {};
  this["(properties)"] = {};

  this["(catch)"]     = false;
  this["(global)"]    = false;

  this["(line)"]      = null;
  this["(character)"] = null;
  this["(metrics)"]   = null;
  this["(statement)"] = null;
  this["(context)"]   = null;
  this["(blockscope)"]= null;
  this["(comparray)"] = null;
  this["(generator)"] = null;
  this["(params)"]    = null;

  if (token) {
    _.extend(this, {
      "(line)"     : token.line,
      "(character)": token.character,
      "(metrics)"  : createMetrics(token)
    });
  }

  _.extend(this, overwrites);

  if (this["(context)"]) {
    this["(blockscope)"] = this["(context)"]["(blockscope)"];
    this["(comparray)"]  = this["(context)"]["(comparray)"];
  }
}

function createMetrics(functionStartToken) {
  return {
    statementCount: 0,
    nestedBlockDepth: -1,
    ComplexityCount: 1,

    verifyMaxStatementsPerFunction: function (state, warning) {
      if (state.option.maxstatements &&
        this.statementCount > state.option.maxstatements) {
        warning("W071", functionStartToken, this.statementCount);
      }
    },

    verifyMaxParametersPerFunction: function (params, state, warning) {
      params = params || [];

      if (state.option.maxparams && params.length > state.option.maxparams) {
        warning("W072", functionStartToken, params.length);
      }
    },

    verifyMaxNestedBlockDepthPerFunction: function (state, warning) {
      if (state.option.maxdepth &&
        this.nestedBlockDepth > 0 &&
        this.nestedBlockDepth === state.option.maxdepth + 1) {
        warning("W073", null, this.nestedBlockDepth);
      }
    },

    verifyMaxComplexityPerFunction: function (state, warning) {
      var max = state.option.maxcomplexity;
      var cc = this.ComplexityCount;
      if (max && cc > max) {
        warning("W074", functionStartToken, cc);
      }
    }
  };
}

module.exports = Functor;
