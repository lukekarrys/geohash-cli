#!/usr/bin/env node
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _open = require('open');

var _open2 = _interopRequireDefault(_open);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _lodashObjectOmit = require('lodash/object/omit');

var _lodashObjectOmit2 = _interopRequireDefault(_lodashObjectOmit);

var _lodashObjectPick = require('lodash/object/pick');

var _lodashObjectPick2 = _interopRequireDefault(_lodashObjectPick);

var _lodashCollectionPluck = require('lodash/collection/pluck');

var _lodashCollectionPluck2 = _interopRequireDefault(_lodashCollectionPluck);

var _lodashCollectionEach = require('lodash/collection/each');

var _lodashCollectionEach2 = _interopRequireDefault(_lodashCollectionEach);

var _lodashArrayCompact = require('lodash/array/compact');

var _lodashArrayCompact2 = _interopRequireDefault(_lodashArrayCompact);

var _lodashArrayChunk = require('lodash/array/chunk');

var _lodashArrayChunk2 = _interopRequireDefault(_lodashArrayChunk);

var _cliTable = require('cli-table');

var _cliTable2 = _interopRequireDefault(_cliTable);

var _geohash = require('./geohash');

var _geohash2 = _interopRequireDefault(_geohash);

var openMap = function openMap(map, cb) {
  return (0, _open2['default'])(map, null, cb);
};
var endsWith = function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};
var decodeMap = function decodeMap(key, value) {
  var decode = endsWith(key, 'map') || endsWith(key, 'Map');
  return decode ? decodeURIComponent(value) : value;
};

var debug = (0, _debug2['default'])('geohash:cli');
var argv = (0, _minimist2['default'])(process.argv.slice(2), {
  boolean: ['open', 'pretty', 'json', 'table', 'help'],
  'default': {
    table: true
  }
});

if (argv.help) {
  console.log('\n  Data options\n\n    --date=YYYY-MM-DD [today]\n      The date to start getting geohashes. Defaults to todays\'s date.\n\n    --days [4]\n      How many does to get in the future. Defaults to 4 or up to the most\n      current date that has available data.\n\n    --location=lat,lon [current location]\n      Your location. By default it will try and use `whereami` to find\n      your current location.\n\n    --key\n      The Google maps static maps API key to use for your maps.\n\n    --cache\n      The file or directory where you want to cache Dow Jones data.\n\n  Output options\n\n    --open [false]\n      Open all maps in your default browser.\n\n    --json [true]\n      Output the full JSON information.\n\n    --pretty [false]\n      Make the json output prettier.\n\n    --table [true]\n      Output tables of all the distances for each day.\n\n    --help [false]\n      You\'re looking at it.\n  ');
  process.exit(0);
}

debug((0, _lodashObjectOmit2['default'])(argv, '_'));

(0, _geohash2['default'])((0, _lodashObjectPick2['default'])(argv, 'date', 'days', 'location', 'key', 'cache'), function (err, results) {
  if (err) return console.error(err.message || err);

  debug('Success');

  var dates = results.dates;

  if (argv.json) {
    console.log(JSON.stringify(results, argv.pretty ? decodeMap : null, argv.pretty ? 2 : 0));
  }

  if (argv.table) {
    (0, _lodashCollectionEach2['default'])(dates, function (values, date) {
      var distanceTable = new _cliTable2['default']({ head: [date, 'Distances', ''] });
      distanceTable.push(['', '', '']);
      distanceTable.push.apply(distanceTable, (0, _lodashArrayChunk2['default'])((0, _lodashCollectionPluck2['default'])(values.geohashes, 'distance'), 3));
      distanceTable.push(['', '', '']);
      distanceTable.push(['Global', values.global.distance, '']);
      console.log(distanceTable.toString());
    });
  }

  if (argv.open) {
    var maps = (0, _lodashCollectionPluck2['default'])(dates, 'map').concat((0, _lodashCollectionPluck2['default'])(dates, 'globalMap'));
    _async2['default'].eachSeries((0, _lodashArrayCompact2['default'])(maps), openMap);
  }
});