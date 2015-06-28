"use strict";

var _ = require("lodash");

var shimmedHas = function(obj, attr) {
  if (attr === "__proto__") {
    return _.has(obj, "__proto__") && obj.__proto__ !== null;
  }
  return _.has(obj, attr);
};

module.exports = "__proto__" in Object.create(null) ? shimmedHas : _.has;
