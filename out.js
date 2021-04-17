"use strict";

var _axios = _interopRequireDefault(require("axios"));

var _fireMock2 = _interopRequireDefault(require("@hawaijar/fireMock"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var axiosProxy = new Proxy(_axios["default"], handlers);
var _fireMock = _fireMock2["default"],
    handlers = _fireMock.handlers;