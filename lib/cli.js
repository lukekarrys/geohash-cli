#!/usr/bin/env node
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _open = require('open');

var _open2 = _interopRequireDefault(_open);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodashObjectOmit = require('lodash/object/omit');

var _lodashObjectOmit2 = _interopRequireDefault(_lodashObjectOmit);

var _lodashObjectPick = require('lodash/object/pick');

var _lodashObjectPick2 = _interopRequireDefault(_lodashObjectPick);

var _geohash = require('./geohash');

var _geohash2 = _interopRequireDefault(_geohash);

var debug = _debug2['default']('geohash:cli');
var argv = _minimist2['default'](process.argv.slice(2), {
  boolean: ['open', 'pretty']
});

debug(_lodashObjectOmit2['default'](argv, '_'));

_geohash2['default'](_lodashObjectPick2['default'](argv, 'date', 'location', 'key', 'cache'), function (err, results) {
  if (err) return console.error(err.message || err);

  debug('Success');
  process.stdout.write(JSON.stringify(results, null, argv.pretty ? 2 : 0));

  if (argv.open) {
    results.map && _open2['default'](results.map);
    results.globalMap && _open2['default'](results.globalMap);
  }
});