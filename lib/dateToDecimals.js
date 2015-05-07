'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _md5 = require('MD5');

var _md52 = _interopRequireDefault(_md5);

var _hexToDec = require('./hexToDec');

var _hexToDec2 = _interopRequireDefault(_hexToDec);

var _djia = require('./djia');

var _djia2 = _interopRequireDefault(_djia);

var splitAt = function splitAt(str, index) {
  return [str.substring(0, index), str.substring(index)];
};
var toDecimal = function toDecimal(val) {
  return splitAt(_md52['default'](val), 16).map(_hexToDec2['default']).map(Number);
};

var dateToDecimals = function dateToDecimals(date, cb) {
  _djia2['default'](date, function (err, djia) {
    if (err) return cb(err);
    cb(null, toDecimal(date + '-' + djia));
  });
};

exports['default'] = dateToDecimals;
module.exports = exports['default'];