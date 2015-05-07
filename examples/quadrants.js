import geohash from '../src/geohash'
import open from 'open'
import async from 'async'
import debugThe from 'debug'
import omit from 'lodash/object/omit'
import pick from 'lodash/object/pick'

const debug = debugThe('geohash:example')

const date = '2015-05-06'
const locations = [
  '34.5,113.5',
  '-37.5,145.5',
  '-34.5,-58.5',
  '33.5,-111.5'
]

async.eachSeries(locations, (location, cb) => {
  geohash({date, location}, (err, results) => {
    if (err) return console.error(err)

    const {map, globalMap} = results
    debug(`Map: ${date} ${location}`)

    open(map, null, () => {
      if (location === locations[3]) {
        open(globalMap, null, cb)
      } else {
        cb()
      }
    })
  })
})
