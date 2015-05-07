'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _async = require('async');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _geoGraticule = require('geo-graticule');

var _geoGraticule2 = _interopRequireDefault(_geoGraticule);

var _geohashCoordinates = require('geohash-coordinates');

var _geohashCoordinates2 = _interopRequireDefault(_geohashCoordinates);

var _lodashFunctionPartial = require('lodash/function/partial');

var _lodashFunctionPartial2 = _interopRequireDefault(_lodashFunctionPartial);

var _lodashObjectAssign = require('lodash/object/assign');

var _lodashObjectAssign2 = _interopRequireDefault(_lodashObjectAssign);

var _lodashArrayFlatten = require('lodash/array/flatten');

var _lodashArrayFlatten2 = _interopRequireDefault(_lodashArrayFlatten);

var _whereami = require('./whereami');

var _whereami2 = _interopRequireDefault(_whereami);

var _geohashMap = require('./geohashMap');

var _geohashMap2 = _interopRequireDefault(_geohashMap);

var debug = _debug2['default']('geohash:geohash');

var fillRequiredOptions = function fillRequiredOptions(options, cb) {
  var filledOptions = _lodashObjectAssign2['default']({}, options);

  if (!filledOptions.date) {
    filledOptions.date = _moment2['default']().format('YYYY-MM-DD');
    debug('No date argument. Using ' + filledOptions.date);
  }

  if (!filledOptions.location) {
    return _whereami2['default'](function (err, result) {
      if (err) return cb(err);

      filledOptions.location = result;
      debug('No location argument. Using ' + filledOptions.location);

      cb(null, filledOptions);
    });
  }

  cb(null, filledOptions);
};

var locationAndDateToCoords = function locationAndDateToCoords(options, cb) {
  var location = options.location;

  _geohashCoordinates2['default'].all(options, function (err, result) {
    if (err) return cb(err);
    var global = result.global;
    var graticule = result.graticule;
    var neighbors = result.neighbors;

    debug('Location ' + location);
    debug('Global: ' + global);
    debug('Graticule: ' + graticule);
    debug('Neighbors: ' + neighbors);

    cb(null, {
      geo: new _geoGraticule2['default'](location),
      global: new _geoGraticule2['default'](global),
      graticule: new _geoGraticule2['default'](graticule),
      geohashes: neighbors
    });
  });
};

var toGeoHash = function toGeoHash(_x, cb) {
  var options = arguments[0] === undefined ? {} : arguments[0];

  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  var key = options.key;

  var filledOptions = _lodashFunctionPartial2['default'](fillRequiredOptions, options);

  _async.waterfall([filledOptions, locationAndDateToCoords], function (err, results) {
    if (err) return cb(err);

    var global = results.global;
    var graticule = results.graticule;
    var geohashes = results.geohashes;
    var geo = results.geo;

    var map = _geohashMap2['default']({
      key: key,
      markers: geohashes,
      center: graticule.graticuleCenter().join(','),
      drawGraticulePaths: true,
      size: '800x800',
      location: geo
    });

    var globalMap = _geohashMap2['default']({
      key: key,
      markers: [global],
      center: geo,
      location: geo,
      zoom: 2
    });

    debug('Location: ' + geo.toString());
    debug('Global: ' + global);
    debug('Graticule: ' + graticule);
    debug('Geohashes: ' + geohashes);
    debug('Map: ' + decodeURIComponent(map));
    debug('Global map: ' + decodeURIComponent(globalMap));

    cb(null, { map: map, globalMap: globalMap });
  });
};

exports['default'] = toGeoHash;
module.exports = exports['default'];