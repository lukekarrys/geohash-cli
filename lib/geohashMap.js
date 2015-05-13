'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _qs = require('qs');

var _lodashObjectDefaults = require('lodash/object/defaults');

var _lodashObjectDefaults2 = _interopRequireDefault(_lodashObjectDefaults);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodashObjectOmit = require('lodash/object/omit');

var _lodashObjectOmit2 = _interopRequireDefault(_lodashObjectOmit);

var _lodashCollectionInvoke = require('lodash/collection/invoke');

var _lodashCollectionInvoke2 = _interopRequireDefault(_lodashCollectionInvoke);

var _lodashFunctionPartial = require('lodash/function/partial');

var _lodashFunctionPartial2 = _interopRequireDefault(_lodashFunctionPartial);

var _lodashUtilityIdentity = require('lodash/utility/identity');

var _lodashUtilityIdentity2 = _interopRequireDefault(_lodashUtilityIdentity);

var debug = (0, _debug2['default'])('geohash:map');
var BASE_URL = 'https://maps.googleapis.com/maps/api/staticmap?';

var delimiter = '|';
var middleItem = function middleItem(arr) {
  return arr[Math.round((arr.length - 1) / 2)];
};
var appendFirstIndex = function appendFirstIndex(arr) {
  return [].concat(arr, [arr[0]]);
};
var validArray = function validArray(arr) {
  return Array.isArray(arr) && arr.length > 0 && arr;
};

var toMarker = function toMarker(color, label, geo) {
  return ['color:' + color, 'label:' + label, geo.toString()].join(delimiter);
};

var toGraticulePaths = function toGraticulePaths(geohashes) {
  var pathPoints = (0, _lodashCollectionInvoke2['default'])(geohashes, 'graticuleBox').map(appendFirstIndex).map(function (geohash) {
    return geohash.join(delimiter);
  }).join(delimiter);

  var color = '0xff0000ff';
  var weight = 3;
  var pathOptions = (0, _qs.stringify)({ color: color, weight: weight }, { delimiter: delimiter }).replace(/=/g, ':');

  return pathOptions + delimiter + pathPoints;
};

var getMapUrl = function getMapUrl() {
  var options = arguments[0] === undefined ? {} : arguments[0];

  var params = (0, _lodashObjectDefaults2['default'])(options, {
    size: '640x640',
    maptype: 'hybrid',
    zoom: 7,
    markers: [],
    path: '',
    key: ''
  });
  var specialParams = ['location', 'drawGraticulePaths', 'geohashes'];

  var location = params.location;
  var drawGraticulePaths = params.drawGraticulePaths;
  var geohashes = params.geohashes;

  var validGeohashes = validArray(geohashes);

  specialParams.forEach(function (param) {
    return delete params[param];
  });
  debug('Initial params: ' + JSON.stringify(params));

  if (drawGraticulePaths && validGeohashes) {
    params.path += toGraticulePaths(validGeohashes);
    debug('Graticule Paths: ' + params.path);
  }

  if (!params.center && validGeohashes) {
    params.center = middleItem(validGeohashes).toString();
    debug('Geohashes center: ' + params.center);
  }

  if (validGeohashes) {
    var geohashMarkers = validGeohashes.map((0, _lodashFunctionPartial2['default'])(toMarker, 'blue', 'G'));
    params.markers.push(geohashMarkers);
    debug('Markers: ' + geohashMarkers);
  }

  if (location) {
    var locationMarker = toMarker('red', 'Y', location);
    params.markers.push(locationMarker);
    debug('Location: ' + locationMarker);
  }

  var qsStr = (0, _qs.stringify)((0, _lodashObjectOmit2['default'])(params, function (val) {
    return !(0, _lodashUtilityIdentity2['default'])(val);
  }), { arrayFormat: 'repeat' });
  debug('Map: ' + qsStr);

  return BASE_URL + qsStr;
};

exports['default'] = getMapUrl;
module.exports = exports['default'];