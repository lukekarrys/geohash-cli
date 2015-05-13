import geohash from '../src/geohash'
import open from 'open'
import async from 'async'
import debugThe from 'debug'
import path from 'path'
import pluck from 'lodash/collection/pluck'

const endsWith = (str, suffix) => {
  return str.indexOf(suffix, str.length - suffix.length) !== -1
}
const decodeMap = (key, value) => {
  const decode = endsWith(key, 'map') || endsWith(key, 'Map')
  return decode ? decodeURIComponent(value) : value
}
const cache = path.join(path.resolve(__dirname, '..'), 'djia_cache.json')
// const openMap = (map, cb) => open(map, null, cb)
const date = '2015-05-08'

geohash({date, cache, days: 3}, (err, results) => {
  if (err) return console.error(err)

  console.log(JSON.stringify(results, decodeMap, 2))
  console.log(results['2015-05-10'].geohashes[0].milesFrom)
  // const {maps} = results
  // const localMaps = pluck(maps, 'map')
  // const globalMaps = pluck(maps, 'globalMap')

  // // async.eachSeries(localMaps.concat(globalMaps), openMap)
})
