'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodashObjectAssign = require('lodash/object/assign');

var _lodashObjectAssign2 = _interopRequireDefault(_lodashObjectAssign);

var _whereami = require('./whereami');

var _whereami2 = _interopRequireDefault(_whereami);

var debug = (0, _debug2['default'])('geohash:options');

// Returns the options passed in but with date and location filled in
var fillOptions = function fillOptions(options, cb) {
  var filledOptions = (0, _lodashObjectAssign2['default'])({}, options);

  if (!filledOptions.date) {
    filledOptions.date = (0, _moment2['default'])().format('YYYY-MM-DD');
    debug('No date argument. Using ' + filledOptions.date);
  }

  if (!filledOptions.location) {
    return (0, _whereami2['default'])(function (err, result) {
      if (err) return cb(err);

      filledOptions.location = result;
      debug('No location argument. Using ' + filledOptions.location);

      cb(null, filledOptions);
    });
  }

  cb(null, filledOptions);
};

exports['default'] = fillOptions;
module.exports = exports['default'];