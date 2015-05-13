'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _geoGraticule = require('geo-graticule');

var _geoGraticule2 = _interopRequireDefault(_geoGraticule);

var _lodashCollectionIndexBy = require('lodash/collection/indexBy');

var _lodashCollectionIndexBy2 = _interopRequireDefault(_lodashCollectionIndexBy);

var _lodashObjectTransform = require('lodash/object/transform');

var _lodashObjectTransform2 = _interopRequireDefault(_lodashObjectTransform);

var _geohashCoordinates = require('geohash-coordinates');

var _geohashCoordinates2 = _interopRequireDefault(_geohashCoordinates);

var debug = (0, _debug2['default'])('geohash:coordinates');

var toGeo = function toGeo(val) {
  return new _geoGraticule2['default'](val);
};

var getCoordinates = function getCoordinates(options, cb) {
  var location = toGeo(options.location);

  _geohashCoordinates2['default'].latest(options, function (err, result) {
    if (err) return cb(err);

    var graticule = toGeo(result[0].graticule);
    debug('Location ' + location);
    debug('Graticule: ' + graticule);

    var byDate = (0, _lodashObjectTransform2['default'])((0, _lodashCollectionIndexBy2['default'])(result, 'date'), function (result, value, key) {
      var global = toGeo(value.global);
      var geohashes = value.neighbors.map(toGeo);
      debug('Global ' + key + ' ' + location);
      debug('Geohashes ' + key + ' ' + geohashes);
      result[key] = { global: global, geohashes: geohashes };
    });

    // Geoify everything
    cb(null, { byDate: byDate, graticule: graticule, location: location });
  });
};

exports['default'] = getCoordinates;
module.exports = exports['default'];