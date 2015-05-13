import test from 'tape'
import pluck from 'lodash/collection/pluck'
import compact from 'lodash/array/compact'
import geohash from '../src/geohash'
import path from 'path'

const cache = path.join(path.resolve(__dirname, '..'), 'djia_cache.json')

test('geohash', (t) => {
  geohash({date: '2015-05-05', location: '34.5,-111.5', days: 3, cache}, (err, results) => {
    t.equal(err, null, 'err is null')

    const dates = results.dates
    const dateKeys = Object.keys(dates)
    t.equal(dateKeys.length, 3, 'has 3 dates')

    const geohashes = compact(pluck(dates, 'geohashes'))
    t.equal(geohashes.length, 3)
    t.equal(geohashes[0].length, 9)
    t.equal(geohashes[1].length, 9)
    t.equal(geohashes[2].length, 9)

    const globals = compact(pluck(dates, 'global'))
    t.equal(globals.length, 3)
    t.ok(globals[0].distance)
    t.ok(globals[0].latitude)
    t.ok(globals[0].longitude)

    t.end()
  })
})
