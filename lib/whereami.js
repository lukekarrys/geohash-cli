'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _child_process = require('child_process');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _colorsSafe = require('colors/safe');

var debug = (0, _debug2['default'])('geohash:whereami');

var MISSING_SCRIPT_ERR = '\n' + (0, _colorsSafe.red)('An executable called whereami could not be found.') + '\n\nBy default it looks for the executable ' + (0, _colorsSafe.underline)('whereami') + ' somewhere\nin your $PATH, but it looks like that couldn\'t be found.\n\nIf you are on ' + (0, _colorsSafe.underline)('OS X') + ', the easiest way to do this is to use\nhomebrew and run:\n\n' + (0, _colorsSafe.green)('brew install whereami') + '\n\nOtherwise checkout the repo from ' + (0, _colorsSafe.green)('http://victor.github.io/whereami/') + '\nfor ways to install from source.\n';

var whereami = function whereami(cb) {
  (0, _child_process.exec)('whereami', function (err, stdout, stderr) {
    if (err && stderr.indexOf('command not found')) {
      return cb(new Error(MISSING_SCRIPT_ERR));
    } else if (err) {
      return cb(err);
    }

    var location = stdout.toString().replace(/\n/g, '').split(',').map(Number);
    debug('lat,lon: ' + location);

    cb(null, location);
  });
};

exports['default'] = whereami;
module.exports = exports['default'];