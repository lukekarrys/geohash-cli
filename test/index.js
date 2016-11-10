import test from 'tape'
import nock from 'nock'
import map from 'lodash/map'
import compact from 'lodash/compact'
import geohash from '../src/geohash'
import fixtures from './fixtures'

const mockDate = (date) => nock('http://geo.crox.net/djia').get(`/${date}`).reply(200, fixtures[date])

test('geohash', (t) => {
  mockDate('2015-05-04')
  mockDate('2015-05-05')
  mockDate('2015-05-05')
  mockDate('2015-05-06')
  mockDate('2015-05-06')
  mockDate('2015-05-07')

  geohash({date: '2015-05-05', location: '34.5,-111.5', days: 3}, (err, results) => {
    t.equal(err, null, 'err is null')

    const dates = results.dates
    const dateKeys = Object.keys(dates)
    t.equal(dateKeys.length, 3, 'has 3 dates')

    const geohashes = compact(map(dates, 'geohashes'))
    t.equal(geohashes.length, 3)
    t.equal(geohashes[0].length, 9)
    t.equal(geohashes[1].length, 9)
    t.equal(geohashes[2].length, 9)

    const globals = compact(map(dates, 'global'))
    t.equal(globals.length, 3)
    t.ok(globals[0].distance)
    t.ok(globals[0].latitude)
    t.ok(globals[0].longitude)

    t.equal(nock.activeMocks().length, 0, 'no mocks left')

    t.end()
  })
})
