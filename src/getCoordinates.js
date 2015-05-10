import debugThe from 'debug'
import Geo from 'geo-graticule'
import indexBy from 'lodash/collection/indexBy'
import transform from 'lodash/object/transform'
import geohash from 'geohash-coordinates'

const debug = debugThe('geohash:coordinates')

const toGeo = (val) => new Geo(val)

const getCoordinates = (options, cb) => {
  const location = toGeo(options.location)

  geohash.latest(options, (err, result) => {
    if (err) return cb(err)

    const graticule = toGeo(result[0].graticule)
    debug(`Location ${location}`)
    debug(`Graticule: ${graticule}`)

    const byDate = transform(indexBy(result, 'date'), (result, value, key) => {
      const global = toGeo(value.global)
      const geohashes = value.neighbors.map(toGeo)
      debug(`Global ${key} ${location}`)
      debug(`Geohashes ${key} ${geohashes}`)
      result[key] = {global, geohashes}
    })

    // Geoify everything
    cb(null, {byDate, graticule, location})
  })
}

export default getCoordinates
