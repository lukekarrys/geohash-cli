#!/usr/bin/env node

import minimist from 'minimist'
import open from 'open'
import debugThe from 'debug'
import omit from 'lodash/object/omit'
import pick from 'lodash/object/pick'

import geohash from './geohash'

const debug = debugThe('geohash:cli')
const argv = minimist(process.argv.slice(2), {
  boolean: ['open', 'pretty']
})

debug(omit(argv, '_'))

geohash(pick(argv, 'date', 'location', 'key', 'cache'), (err, results) => {
  if (err) return console.error(err.message || err)

  debug('Success')
  process.stdout.write(JSON.stringify(results, null, argv.pretty ? 2 : 0))

  if (argv.open) {
    results.map && open(results.map)
    results.globalMap && open(results.globalMap)
  }
})
