import geohash from '../src/geohash'
import open from 'open'
import async from 'async'
import debugThe from 'debug'
import path from 'path'
import pluck from 'lodash/collection/pluck'

const cache = path.join(path.resolve(__dirname, '..'), 'djia_cache.json')
const openMap = (map, cb) => open(map, null, cb)
const date = '2015-05-06'
const locations = [
  '34.5,113.5',
  '-37.5,145.5',
  '-34.5,-58.5',
  '33.5,-111.5'
]

async.eachSeries(locations, (location, cb) => {
  geohash({date, location, cache}, (err, results) => {
    if (err) return console.error(err)

    const {maps} = results
    const localMaps = pluck(maps, 'map')
    const globalMaps = pluck(maps, 'globalMap')

    async.eachSeries(localMaps.concat(globalMaps), openMap, cb)
  })
})
