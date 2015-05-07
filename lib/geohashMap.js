'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _qs = require('qs');

var _lodashObjectDefaults = require('lodash/object/defaults');

var _lodashObjectDefaults2 = _interopRequireDefault(_lodashObjectDefaults);

var _lodashObjectAssign = require('lodash/object/assign');

var _lodashObjectAssign2 = _interopRequireDefault(_lodashObjectAssign);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodashObjectOmit = require('lodash/object/omit');

var _lodashObjectOmit2 = _interopRequireDefault(_lodashObjectOmit);

var _geoGraticule = require('geo-graticule');

var _geoGraticule2 = _interopRequireDefault(_geoGraticule);

var debug = _debug2['default']('geohash:map');
var BASE_URL = 'https://maps.googleapis.com/maps/api/staticmap?';

var mapDefaults = {
  size: '600x600',
  maptype: 'hybrid',
  zoom: 7,
  markers: [],
  key: ''
};

var delimiter = '|';
var middleItem = function middleItem(arr) {
  return arr[Math.round((arr.length - 1) / 2)];
};
var appendFirstIndex = function appendFirstIndex(arr) {
  return arr.concat([arr[0]]);
};
var validArray = function validArray(arr) {
  return Array.isArray(arr) && arr.length > 0;
};

var toMarker = function toMarker() {
  var options = arguments[0] === undefined ? {} : arguments[0];
  var color = options.color;
  var geo = options.geo;
  var label = options.label;

  return ['color:' + color, 'label:' + label, new _geoGraticule2['default'](geo).toString()].join(delimiter);
};

var toGraticulePath = function toGraticulePath(geohashes) {
  var pathPoints = geohashes.map(function (geohash) {
    return new _geoGraticule2['default'](geohash).graticuleBox().map(appendFirstIndex).join(delimiter);
  }).join(delimiter);

  var pathOptions = _qs.stringify({
    color: '0xff0000ff',
    weight: 3
  }, { delimiter: delimiter }).replace(/=/g, ':');

  return pathOptions + delimiter + pathPoints;
};

var getMapUrl = function getMapUrl() {
  var options = arguments[0] === undefined ? {} : arguments[0];

  var params = _lodashObjectDefaults2['default'](options, mapDefaults);
  var specialParams = ['location', 'drawGraticulePaths'];
  var location = params.location;
  var drawGraticulePaths = params.drawGraticulePaths;

  var validMarkers = validArray(params.markers);

  specialParams.forEach(function (param) {
    return delete params[param];
  });
  debug('Initial params: ' + JSON.stringify(params));

  if (drawGraticulePaths && validMarkers) {
    params.path = toGraticulePath(params.markers);
    debug('Graticule Paths: ' + params.path);
  }

  if (!params.center && validMarkers) {
    params.center = middleItem(params.markers).toString();
    debug('Geohashes center: ' + params.center);
  }

  if (validMarkers) {
    params.markers = params.markers.map(function (marker) {
      return toMarker({
        color: 'blue',
        label: 'G',
        geo: marker
      });
    });
    debug('Markers: ' + params.markers);
  }

  if (location) {
    var locationMarker = toMarker({
      color: 'red',
      label: 'Y',
      geo: location
    });
    params.markers.push(locationMarker);
    debug('Location: ' + locationMarker);
  }

  // If key is an empty string it will still be encoded but will cause
  // and error with the google maps request
  if (!params.key) delete params.key;

  return BASE_URL + _qs.stringify(params, { arrayFormat: 'repeat' });
};

exports['default'] = getMapUrl;
module.exports = exports['default'];