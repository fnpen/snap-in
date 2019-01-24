"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var _default = function _default() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      onBefore = _ref.onBefore,
      onAfter = _ref.onAfter,
      options = _objectWithoutProperties(_ref, ["onBefore", "onAfter"]);

  var store = {};

  function getHooks(name) {
    return typeof store[name] === 'undefined' ? store[name] = [] : store[name];
  }

  function hook(name, listener) {
    var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    if (typeof name !== 'string') {
      throw new Error('Expected the name to be a string.');
    }

    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    var hooks = getHooks(name);
    var addedIndex = hooks.push({
      listener: listener,
      priority: priority
    }) - 1;
    return function () {
      return hooks.splice(addedIndex, 1);
    }; // Remove previosly added
  }

  function wrap(name, object) {
    if (typeof name !== 'string') {
      throw new Error('Expected the name to be a string.');
    }

    var hooks = getHooks(name);

    if (!hooks.length) {
      return object;
    }

    if (typeof onBefore === 'function') {
      if (onBefore(name, object, hooks) === false) {
        return object;
      }
    }

    var fns = _toConsumableArray(hooks).sort(function (a, b) {
      return b.priority - a.priority;
    }).map(function (hook) {
      return hook.listener;
    });

    var result = fns.reduce(function (last, fn) {
      var r;

      try {
        r = fn(last, options);
      } catch (_unused) {
        console.error("Error in hook on wrap execution with name: ".concat(name));
        r = last;
      }

      return r;
    }, object);

    if (typeof onAfter === 'function') {
      onAfter(name, object, result, hooks);
    }

    return result;
  }

  return {
    hook: hook,
    wrap: wrap,
    __STORE__: store
  };
};

exports.default = _default;