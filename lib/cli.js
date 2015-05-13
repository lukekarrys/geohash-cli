#!/usr/bin/env node
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _open = require('open');

var _open2 = _interopRequireDefault(_open);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _lodashObjectPick = require('lodash/object/pick');

var _lodashObjectPick2 = _interopRequireDefault(_lodashObjectPick);

var _lodashCollectionPluck = require('lodash/collection/pluck');

var _lodashCollectionPluck2 = _interopRequireDefault(_lodashCollectionPluck);

var _lodashCollectionInvoke = require('lodash/collection/invoke');

var _lodashCollectionInvoke2 = _interopRequireDefault(_lodashCollectionInvoke);

var _lodashCollectionEach = require('lodash/collection/each');

var _lodashCollectionEach2 = _interopRequireDefault(_lodashCollectionEach);

var _lodashArrayCompact = require('lodash/array/compact');

var _lodashArrayCompact2 = _interopRequireDefault(_lodashArrayCompact);

var _lodashArrayChunk = require('lodash/array/chunk');

var _lodashArrayChunk2 = _interopRequireDefault(_lodashArrayChunk);

var _cliTable = require('cli-table');

var _cliTable2 = _interopRequireDefault(_cliTable);

var _package = require('../package');

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

var _yargs$alias$default$alias$default$alias$default$alias$default$alias$default$default$version = _yargs2['default'].alias('o', 'open')['default']('o', false).alias('p', 'pretty')['default']('p', false).alias('j', 'json')['default']('j', false).alias('t', 'table')['default']('t', false).alias('h', 'help')['default']('h', false)['default']('cache', true).version(_package.version);

var argv = _yargs$alias$default$alias$default$alias$default$alias$default$alias$default$default$version.argv;

var noOuput = !argv.o && !argv.j && !argv.t ? 'Please use either --json, --table, or --open' : '';

debug(argv);

if (argv.help || noOuput) {
  console.log('\n  ' + noOuput + '\n\n  Data options\n\n    --date=YYYY-MM-DD [today]\n      The date to start getting geohashes. Defaults to todays\'s date.\n\n    --days [4]\n      How many does to get in the future. Defaults to 4 or up to the most\n      current date that has available data.\n\n    --location=lat,lon [current location]\n      Your location. By default it will try and use `whereami` to find\n      your current location.\n\n    --key\n      The Google maps static maps API key to use for your maps.\n\n    --cache [$HOME/.config/djia/djia_cache.json]\n      The file or directory where you want to cache Dow Jones data.\n\n  Output options\n\n    -j, --json [false]\n      Output the full JSON information.\n\n    -p, --pretty [false]\n      Make the json output prettier.\n\n    -t, --table [false]\n      Output tables of all the distances for each day.\n\n    -o, --open [false]\n      Open all maps in your default browser.\n\n    -h, --help [false]\n      You\'re looking at it.\n\n    --version\n      Output the version and exit.\n  ');
  process.exit(0);
}

(0, _geohash2['default'])((0, _lodashObjectPick2['default'])(argv, 'date', 'days', 'location', 'key', 'cache'), function (err, results) {
  if (err) return process.stderr(err.message || err);

  debug('Success');

  var dates = results.dates;

  if (argv.json) {
    process.stdout.write(JSON.stringify(results, argv.pretty ? decodeMap : null, argv.pretty ? 2 : 0));
  }

  if (argv.table) {
    if (argv.json) console.log('\n');
    (0, _lodashCollectionEach2['default'])(dates, function (values, date) {
      var distanceTable = new _cliTable2['default']({ head: [date, 'Distances', 'Miles'] });
      distanceTable.push(['', '', '']);
      distanceTable.push.apply(distanceTable, (0, _lodashArrayChunk2['default'])((0, _lodashCollectionInvoke2['default'])((0, _lodashCollectionPluck2['default'])(values.geohashes, 'distance'), 'toFixed', 2), 3));
      distanceTable.push(['', '', '']);
      distanceTable.push(['Global', values.global.distance.toFixed(2), '']);
      console.log(distanceTable.toString());
    });
  }

  if (argv.open) {
    var maps = (0, _lodashCollectionPluck2['default'])(dates, 'map').concat((0, _lodashCollectionPluck2['default'])(dates, 'globalMap'));
    _async2['default'].eachSeries((0, _lodashArrayCompact2['default'])(maps), openMap);
  }
});