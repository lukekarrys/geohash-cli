import {stringify} from 'qs'
import defaults from 'lodash/object/defaults'
import assign from 'lodash/object/assign'
import debugThe from 'debug'
import omit from 'lodash/object/omit'
import Geo from 'geo-graticule'

const debug = debugThe('geohash:map')
const BASE_URL = 'https://maps.googleapis.com/maps/api/staticmap?'

const mapDefaults = {
  size: '600x600',
  maptype: 'hybrid',
  zoom: 7,
  markers: [],
  key: ''
}

const delimiter = '|'
const middleItem = (arr) => arr[Math.round((arr.length - 1) / 2)]
const appendFirstIndex = (arr) => arr.concat([arr[0]])
const validArray = (arr) => Array.isArray(arr) && arr.length > 0

const toMarker = (options = {}) => {
  const {color, geo, label} = options
  return [`color:${color}`, `label:${label}`, new Geo(geo).toString()].join(delimiter)
}

const toGraticulePath = (geohashes) => {
  const pathPoints = geohashes.map((geohash) => {
    return new Geo(geohash).graticuleBox().map(appendFirstIndex).join(delimiter)
  }).join(delimiter)

  const pathOptions = stringify({
    color: '0xff0000ff',
    weight: 3
  }, {delimiter}).replace(/=/g, ':')

  return pathOptions + delimiter + pathPoints
}

const getMapUrl = (options = {}) => {
  const params = defaults(options, mapDefaults)
  const specialParams = ['location', 'drawGraticulePaths']
  const {location, drawGraticulePaths} = params
  const validMarkers = validArray(params.markers)

  specialParams.forEach((param) => delete params[param])
  debug(`Initial params: ${JSON.stringify(params)}`)

  if (drawGraticulePaths && validMarkers) {
    params.path = toGraticulePath(params.markers)
    debug(`Graticule Paths: ${params.path}`)
  }

  if (!params.center && validMarkers) {
    params.center = middleItem(params.markers).toString()
    debug(`Geohashes center: ${params.center}`)
  }

  if (validMarkers) {
    params.markers = params.markers.map((marker) => {
      return toMarker({
        color: 'blue',
        label: 'G',
        geo: marker
      })
    })
    debug(`Markers: ${params.markers}`)
  }

  if (location) {
    const locationMarker = toMarker({
      color: 'red',
      label: 'Y',
      geo: location
    })
    params.markers.push(locationMarker)
    debug(`Location: ${locationMarker}`)
  }

  // If key is an empty string it will still be encoded but will cause
  // and error with the google maps request
  if (!params.key) delete params.key

  return BASE_URL + stringify(params, {arrayFormat: 'repeat'})
}

export default getMapUrl
