import {stringify} from 'qs'
import defaults from 'lodash/defaults'
import debugThe from 'debug'
import omit from 'lodash/omit'
import invokeMap from 'lodash/invokeMap'
import partial from 'lodash/partial'
import identity from 'lodash/identity'

const debug = debugThe('geohash:map')
const BASE_URL = 'https://maps.googleapis.com/maps/api/staticmap?'

const delimiter = '|'
const middleItem = (arr) => arr[Math.round((arr.length - 1) / 2)]
const appendFirstIndex = (arr) => [].concat(arr, [arr[0]])
const validArray = (arr) => Array.isArray(arr) && arr.length > 0 && arr

const toMarker = (color, label, geo) => {
  return [`color:${color}`, `label:${label}`, geo.toString()].join(delimiter)
}

const toGraticulePaths = (geohashes) => {
  const pathPoints = invokeMap(geohashes, 'graticuleBox')
    .map(appendFirstIndex)
    .map((geohash) => geohash.join(delimiter))
    .join(delimiter)

  const color = '0xff0000ff'
  const weight = 3
  const pathOptions = stringify({color, weight}, {delimiter}).replace(/=/g, ':')

  return pathOptions + delimiter + pathPoints
}

const getMapUrl = (options = {}) => {
  const params = defaults(options, {
    size: '640x640',
    maptype: 'hybrid',
    zoom: 7,
    markers: [],
    path: '',
    key: ''
  })
  const specialParams = ['location', 'drawGraticulePaths', 'geohashes']

  const {location, drawGraticulePaths, geohashes} = params
  const validGeohashes = validArray(geohashes)

  specialParams.forEach((param) => delete params[param])
  debug(`Initial params: ${JSON.stringify(params)}`)

  if (drawGraticulePaths && validGeohashes) {
    params.path += toGraticulePaths(validGeohashes)
    debug(`Graticule Paths: ${params.path}`)
  }

  if (!params.center && validGeohashes) {
    params.center = middleItem(validGeohashes).toString()
    debug(`Geohashes center: ${params.center}`)
  }

  if (validGeohashes) {
    const geohashMarkers = validGeohashes.map(partial(toMarker, 'blue', 'G'))
    params.markers.push(geohashMarkers)
    debug(`Markers: ${geohashMarkers}`)
  }

  if (location) {
    const locationMarker = toMarker('red', 'Y', location)
    params.markers.push(locationMarker)
    debug(`Location: ${locationMarker}`)
  }

  const qsStr = stringify(omit(params, (val) => !identity(val)), {arrayFormat: 'repeat'})
  debug(`Map: ${qsStr}`)

  return BASE_URL + qsStr
}

export default getMapUrl
