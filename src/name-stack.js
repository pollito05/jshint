"use strict";

function NameStack() {
  this._stack = [];
}

Object.defineProperty(NameStack.prototype, "length", {
  get: function() {
    return this._stack.length;
  }
});

/**
 * Create a new entry in the stack. Useful for tracking names across
 * expressions.
 */
NameStack.prototype.push = function() {
  this._stack.push(null);
};

/**
 * Discard the most recently-created name on the stack.
 */
NameStack.prototype.pop = function() {
  this._stack.pop();
};

/**
 * Update the most recent name on the top of the stack.
 *
 * @param {object} token The token to consider as the source for the most
 *                       recent name.
 */
NameStack.prototype.set = function(token) {
  this._stack[this.length - 1] = token;
};

/**
 * Generate a string representation of any name in the stack.
 *
 * @param {number} [offset] number of elements from the top of the stack.
 *                          Defaults to 0.
 *
 * @returns {string}
 */
NameStack.prototype.infer = function(offset) {
  var nameToken, type;
  var prefix = "";

  if (arguments.length === 0) {
    offset = 0;
  }

  nameToken = this._stack[this.length - 1 + offset];

  if (!nameToken) {
    return "";
  }

  type = nameToken.type;

  if (type !== "(string)" && type !== "(number)" && type !== "(identifier)") {
    return "(expression)";
  }

  if (nameToken.accessorType) {
    prefix = nameToken.accessorType + " ";
  }

  return prefix + nameToken.value;
};

module.exports = NameStack;
