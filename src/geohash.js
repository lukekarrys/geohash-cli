import moment from 'moment'
import {waterfall} from 'async'
import debugThe from 'debug'
import Geo from 'geo-graticule'
import geohash from 'geohash-coordinates'

import partial from 'lodash/function/partial'
import assign from 'lodash/object/assign'
import flatten from 'lodash/array/flatten'

import whereami from './whereami'
import geohashMap from './geohashMap'

const debug = debugThe('geohash:geohash')

const fillRequiredOptions = (options, cb) => {
  const filledOptions = assign({}, options)

  if (!filledOptions.date) {
    filledOptions.date = moment().format('YYYY-MM-DD')
    debug(`No date argument. Using ${filledOptions.date}`)
  }

  if (!filledOptions.location) {
    return whereami((err, result) => {
      if (err) return cb(err)

      filledOptions.location = result
      debug(`No location argument. Using ${filledOptions.location}`)

      cb(null, filledOptions)
    })
  }

  cb(null, filledOptions)
}

const locationAndDateToCoords = (options, cb) => {
  const {location} = options

  geohash.all(options, (err, result) => {
    if (err) return cb(err)
    const {global, graticule, neighbors} = result

    debug(`Location ${location}`)
    debug(`Global: ${global}`)
    debug(`Graticule: ${graticule}`)
    debug(`Neighbors: ${neighbors}`)

    cb(null, {
      geo: new Geo(location),
      global: new Geo(global),
      graticule: new Geo(graticule),
      geohashes: neighbors
    })
  })
}

const toGeoHash = (options = {}, cb) => {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  const {key} = options
  const filledOptions = partial(fillRequiredOptions, options)

  waterfall([filledOptions, locationAndDateToCoords], (err, results) => {
    if (err) return cb(err)

    const {global, graticule, geohashes, geo} = results

    const map = geohashMap({
      key,
      markers: geohashes,
      center: graticule.graticuleCenter().join(','),
      drawGraticulePaths: true,
      size: '800x800',
      location: geo
    })

    const globalMap = geohashMap({
      key,
      markers: [global],
      center: geo,
      location: geo,
      zoom: 2
    })

    debug(`Location: ${geo.toString()}`)
    debug(`Global: ${global}`)
    debug(`Graticule: ${graticule}`)
    debug(`Geohashes: ${geohashes}`)
    debug(`Map: ${decodeURIComponent(map)}`)
    debug(`Global map: ${decodeURIComponent(globalMap)}`)

    cb(null, {map, globalMap})
  })
}

export default toGeoHash
