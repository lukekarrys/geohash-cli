'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _child_process = require('child_process');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _colorsSafe = require('colors/safe');

var debug = _debug2['default']('geohash:whereami');

var MISSING_SCRIPT_ERR = '\n' + _colorsSafe.red('This module needs to know your location to find the closest geohash!') + '\n\nBy default it looks for an executable called ' + _colorsSafe.underline('whereami') + ' somewhere in your $PATH,\nbut it looks like that couldn\'t be found.\n\nIf you are on ' + _colorsSafe.underline('OS X') + ', the easiest way to do this is to use homebrew and run:\n\n' + _colorsSafe.green('brew install whereami') + '\n\nThe next easiest way is to separately find your geolocation and pass it to this\nscript by using the ' + _colorsSafe.underline('--location') + ' argument:\n\n' + _colorsSafe.green('geohash --location=33.3813,-111.9409') + '\n';

var whereami = function whereami(cb) {
  _child_process.exec('whereami', function (err, stdout, stderr) {
    if (err && stderr.indexOf('command not found')) {
      return cb(new Error(MISSING_SCRIPT_ERR));
    } else if (err) {
      return cb(err);
    }

    var flatData = stdout.toString().replace(/\n/g, '');
    debug(flatData);
    cb(null, flatData.split(','));
  });
};

exports['default'] = whereami;
module.exports = exports['default'];