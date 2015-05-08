import {waterfall} from 'async'
import debugThe from 'debug'
import partial from 'lodash/function/partial'

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

    const {global, graticule, geohashes, location} = results
    const globalDistance = location.milesFrom(global)
    const graticuleDistance = location.milesFrom(graticule)

    const map = geohashMap({
      key,
      location,
      markers: geohashes,
      center: graticule.graticuleCenter().join(','),
      drawGraticulePaths: true,
      size: '800x800'
    })

    const globalMap = geohashMap({
      key,
      location,
      markers: [global],
      center: location,
      zoom: 2
    })

    debug(`Location: ${location.toString()}`)
    debug(`Global: ${global}`)
    debug(`Graticule: ${graticule}`)
    debug(`Geohashes: ${geohashes}`)
    debug(`Map: ${decodeURIComponent(map)}`)
    debug(`Global map: ${decodeURIComponent(globalMap)}`)

    cb(null, {map, globalMap, globalDistance, graticuleDistance})
  })
}

export default toGeoHash
