'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _async = require('async');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodashFunctionPartial = require('lodash/function/partial');

var _lodashFunctionPartial2 = _interopRequireDefault(_lodashFunctionPartial);

var _lodashObjectTransform = require('lodash/object/transform');

var _lodashObjectTransform2 = _interopRequireDefault(_lodashObjectTransform);

var _lodashObjectAssign = require('lodash/object/assign');

var _lodashObjectAssign2 = _interopRequireDefault(_lodashObjectAssign);

var _geohashMap = require('./geohashMap');

var _geohashMap2 = _interopRequireDefault(_geohashMap);

var _fillOptions = require('./fillOptions');

var _fillOptions2 = _interopRequireDefault(_fillOptions);

var _getCoordinates = require('./getCoordinates');

var _getCoordinates2 = _interopRequireDefault(_getCoordinates);

var debug = (0, _debug2['default'])('geohash:main');

var toGeoHash = function toGeoHash(_x, cb) {
  var options = arguments[0] === undefined ? {} : arguments[0];

  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  var key = options.key;

  var filledOptions = (0, _lodashFunctionPartial2['default'])(_fillOptions2['default'], options);

  (0, _async.waterfall)([filledOptions, _getCoordinates2['default']], function (err, results) {
    if (err) return cb(err);

    var byDate = results.byDate;
    var graticule = results.graticule;
    var location = results.location;

    var milesFromLoc = function milesFromLoc(geo) {
      return { distance: location.milesFrom(geo) };
    };
    debug('Location: ' + location);
    debug('Graticule: ' + graticule);

    var dates = (0, _lodashObjectTransform2['default'])(byDate, function (result, hashes, date) {
      var global = hashes.global;
      var geohashes = hashes.geohashes;

      debug('Global: ' + global);
      debug('Geohashes: ' + geohashes);

      var map = (0, _geohashMap2['default'])({
        key: key,
        location: location,
        geohashes: geohashes,
        center: graticule.graticuleCenter().join(','),
        drawGraticulePaths: true,
        zoom: 7
      });

      var globalMap = (0, _geohashMap2['default'])({
        key: key,
        location: location,
        geohashes: [global],
        center: location.toString(),
        drawGraticulePaths: false,
        zoom: null
      });

      result[date] = {
        map: map,
        globalMap: globalMap,
        global: (0, _lodashObjectAssign2['default'])(milesFromLoc(global), global.toJSON()),
        geohashes: geohashes.map(function (hash) {
          return (0, _lodashObjectAssign2['default'])(milesFromLoc(hash), hash.toJSON());
        })
      };
    });

    cb(null, { dates: dates, location: location.toJSON() });
  });
};

exports['default'] = toGeoHash;
module.exports = exports['default'];