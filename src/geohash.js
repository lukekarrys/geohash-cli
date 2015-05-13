import {waterfall} from 'async'
import debugThe from 'debug'
import partial from 'lodash/function/partial'
import transform from 'lodash/object/transform'
import assign from 'lodash/object/assign'

import geohashMap from './geohashMap'
import fillOptions from './fillOptions'
import getCoordinates from './getCoordinates'

const debug = debugThe('geohash:main')

const toGeoHash = (options = {}, cb) => {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  const {key} = options
  const filledOptions = partial(fillOptions, options)

  waterfall([filledOptions, getCoordinates], (err, results) => {
    if (err) return cb(err)

    const {byDate, graticule, location} = results
    const milesFromLoc = (geo) => {
      return {distance: location.milesFrom(geo)}
    }
    debug(`Location: ${location}`)
    debug(`Graticule: ${graticule}`)

    const dates = transform(byDate, (result, hashes, date) => {
      const {global, geohashes} = hashes

      debug(`Global: ${global}`)
      debug(`Geohashes: ${geohashes}`)

      const map = geohashMap({
        key,
        location,
        geohashes,
        center: graticule.graticuleCenter().join(','),
        drawGraticulePaths: true,
        zoom: 7
      })

      const globalMap = geohashMap({
        key,
        location,
        geohashes: [global],
        center: location.toString(),
        drawGraticulePaths: false,
        zoom: null
      })

      result[date] = {
        map,
        globalMap,
        global: assign(milesFromLoc(global), global.toJSON()),
        geohashes: geohashes.map((hash) => assign(milesFromLoc(hash), hash.toJSON()))
      }
    })

    cb(null, {dates, location: location.toJSON()})
  })
}

export default toGeoHash
