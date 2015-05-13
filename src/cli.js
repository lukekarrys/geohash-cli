#!/usr/bin/env node

import minimist from 'minimist'
import open from 'open'
import debugThe from 'debug'
import async from 'async'
import omit from 'lodash/object/omit'
import pick from 'lodash/object/pick'
import pluck from 'lodash/collection/pluck'
import each from 'lodash/collection/each'
import compact from 'lodash/array/compact'
import chunk from 'lodash/array/chunk'
import Table from 'cli-table'

import geohash from './geohash'

const openMap = (map, cb) => open(map, null, cb)
const endsWith = (str, suffix) => str.indexOf(suffix, str.length - suffix.length) !== -1
const decodeMap = (key, value) => {
  const decode = endsWith(key, 'map') || endsWith(key, 'Map')
  return decode ? decodeURIComponent(value) : value
}

const debug = debugThe('geohash:cli')
const argv = minimist(process.argv.slice(2), {
  boolean: ['open', 'pretty', 'json', 'table', 'help'],
  default: {
    table: true
  }
})

if (argv.help) {
  console.log(`
  Data options

    --date=YYYY-MM-DD [today]
      The date to start getting geohashes. Defaults to todays's date.

    --days [4]
      How many does to get in the future. Defaults to 4 or up to the most
      current date that has available data.

    --location=lat,lon [current location]
      Your location. By default it will try and use \`whereami\` to find
      your current location.

    --key
      The Google maps static maps API key to use for your maps.

    --cache
      The file or directory where you want to cache Dow Jones data.

  Output options

    --open [false]
      Open all maps in your default browser.

    --json [true]
      Output the full JSON information.

    --pretty [false]
      Make the json output prettier.

    --table [true]
      Output tables of all the distances for each day.

    --help [false]
      You're looking at it.
  `)
  process.exit(0)
}

debug(omit(argv, '_'))

geohash(pick(argv, 'date', 'days', 'location', 'key', 'cache'), (err, results) => {
  if (err) return console.error(err.message || err)

  debug('Success')

  const {dates} = results

  if (argv.json) {
    console.log(JSON.stringify(results, argv.pretty ? decodeMap : null, argv.pretty ? 2 : 0))
  }

  if (argv.table) {
    each(dates, (values, date) => {
      const distanceTable = new Table({ head: [date, 'Distances', ''] })
      distanceTable.push(['', '', ''])
      distanceTable.push.apply(distanceTable, chunk(pluck(values.geohashes, 'distance'), 3))
      distanceTable.push(['', '', ''])
      distanceTable.push(['Global', values.global.distance, ''])
      console.log(distanceTable.toString())
    })
  }

  if (argv.open) {
    const maps = pluck(dates, 'map').concat(pluck(dates, 'globalMap'))
    async.eachSeries(compact(maps), openMap)
  }
})
