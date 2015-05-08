import debugThe from 'debug'
import Geo from 'geo-graticule'
import geohash from 'geohash-coordinates'

const debug = debugThe('geohash:coordinates')

const getCoordinates = (options, cb) => {
  const {location} = options

  geohash.all(options, (err, result) => {
    if (err) return cb(err)
    const {global, graticule, neighbors} = result

    debug(`Location ${location}`)
    debug(`Global: ${global}`)
    debug(`Graticule: ${graticule}`)
    debug(`Neighbors: ${neighbors}`)

    // Geoify everything
    cb(null, {
      location: new Geo(location),
      global: new Geo(global),
      graticule: new Geo(graticule),
      geohashes: neighbors.map((neighbor) => new Geo(neighbor))
    })
  })
}

export default getCoordinates
