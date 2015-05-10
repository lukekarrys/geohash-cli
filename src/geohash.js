import {waterfall} from 'async'
import debugThe from 'debug'
import partial from 'lodash/function/partial'
import transform from 'lodash/object/transform'

import whereami from './whereami'
import geohashMap from './geohashMap'
import fillOptions from './fillOptions'
import getCoordinates from './getCoordinates'

const debug = debugThe('geohash:geohash')

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
    debug(`Location: ${location}`)
    debug(`Graticule: ${graticule}`)

    const maps = transform(byDate, (result, hashes, date) => {
      const {global, geohashes} = hashes

      debug(`Global: ${global}`)
      debug(`Geohashes: ${geohashes}`)

      const map = geohashMap({
        key,
        location,
        geohashes,
        center: graticule.graticuleCenter().join(','),
        drawGraticulePaths: true
      })

      const globalMap = geohashMap({
        key,
        location,
        geohashes: [global],
        center: location,
        zoom: null
      })

      result[date] = {map, globalMap}
    }, {})

    cb(null, {maps})
  })
}

export default toGeoHash
