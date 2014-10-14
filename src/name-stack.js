"use strict";

function NameStack() {
  this._stack = [];
}

Object.defineProperty(NameStack.prototype, "length", {
  get: function() {
    return this._stack.length;
  }
});

NameStack.prototype.push = function() {
  this._stack.push(null);
};

NameStack.prototype.pop = function() {
  this._stack.pop();
};

NameStack.prototype.set = function(token) {
  this._stack[this.length - 1] = token;
};

NameStack.prototype.infer = function() {
  // Offset by `2` because the current function declaration will have pushed
  // an additional value onto the stack.
  var prevExprIdx = this.length - 2;
  var nameToken = this._stack[prevExprIdx];
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
};

module.exports = NameStack;
