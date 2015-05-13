#!/usr/bin/env node

import yargs from 'yargs'
import open from 'open'
import debugThe from 'debug'
import async from 'async'
import pick from 'lodash/object/pick'
import pluck from 'lodash/collection/pluck'
import invoke from 'lodash/collection/invoke'
import each from 'lodash/collection/each'
import compact from 'lodash/array/compact'
import chunk from 'lodash/array/chunk'
import Table from 'cli-table'

import {version} from '../package'
import geohash from './geohash'

const openMap = (map, cb) => open(map, null, cb)
const endsWith = (str, suffix) => str.indexOf(suffix, str.length - suffix.length) !== -1
const decodeMap = (key, value) => {
  const decode = endsWith(key, 'map') || endsWith(key, 'Map')
  return decode ? decodeURIComponent(value) : value
}

const debug = debugThe('geohash:cli')
const {argv} = yargs
  .alias('o', 'open')
  .default('o', false)

  .alias('p', 'pretty')
  .default('p', false)

  .alias('j', 'json')
  .default('j', false)

  .alias('t', 'table')
  .default('t', false)

  .alias('h', 'help')
  .default('h', false)

  .default('cache', true)

  .version(version)

const noOuput = (!argv.o && !argv.j && !argv.t) ? 'Please use either --json, --table, or --open' : ''

debug(argv)

if (argv.help || noOuput) {
  console.log(`
  ${noOuput}

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

    --cache [$HOME/.config/djia/djia_cache.json]
      The file or directory where you want to cache Dow Jones data.

  Output options

    -j, --json [false]
      Output the full JSON information.

    -p, --pretty [false]
      Make the json output prettier.

    -t, --table [false]
      Output tables of all the distances for each day.

    -o, --open [false]
      Open all maps in your default browser.

    -h, --help [false]
      You're looking at it.

    --version
      Output the version and exit.
  `)
  process.exit(0)
}

geohash(pick(argv, 'date', 'days', 'location', 'key', 'cache'), (err, results) => {
  if (err) return process.stderr(err.message || err)

  debug('Success')

  const {dates} = results

  if (argv.json) {
    process.stdout.write(JSON.stringify(results, argv.pretty ? decodeMap : null, argv.pretty ? 2 : 0))
  }

  if (argv.table) {
    if (argv.json) console.log('\n')
    each(dates, (values, date) => {
      const distanceTable = new Table({ head: [date, 'Distances', 'Miles'] })
      distanceTable.push(['', '', ''])
      distanceTable.push.apply(distanceTable, chunk(invoke(pluck(values.geohashes, 'distance'), 'toFixed', 2), 3))
      distanceTable.push(['', '', ''])
      distanceTable.push(['Global', values.global.distance.toFixed(2), ''])
      console.log(distanceTable.toString())
    })
  }

  if (argv.open) {
    const maps = pluck(dates, 'map').concat(pluck(dates, 'globalMap'))
    async.eachSeries(compact(maps), openMap)
  }
})
