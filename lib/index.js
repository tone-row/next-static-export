'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var withAPI = function withAPI(Comp, Fn) {
  var requirePath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var staticProps = {};

  if ( requirePath) {
    // HOW TO ROUTE IT MAN
    staticProps = require("./data/".concat(requirePath)); // bc this **should** returns the module
  }

  var MyComp = function MyComp(props) {
    return React.createElement(Comp, _extends({}, staticProps, props));
  };

  if ( !requirePath) {
    MyComp.getInitialProps = Fn;
  }

  return MyComp;
};

module.exports = {
  withAPI: withAPI
};
