geohash-cli
=========================

CLI tool to find as much info as possible about today's (or any date's) geohashes.

I use this for [xkcd Geohashing](https://xkcd.com/426/).

[![NPM](https://nodei.co/npm/geohash-cli.png)](https://nodei.co/npm/geohash-cli/)
[![Build Status](https://travis-ci.org/lukekarrys/geohash-cli.png?branch=master)](https://travis-ci.org/lukekarrys/geohash-cli)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)


## Install

`npm install geohash-cli -g`


## Dependencies

In order to get your location (on OS X) you will need to install `whereami`. One way to do this is through Homebrew. You can run

```
brew install whereami
```

Otherwise visit the [whereami repo](http://victor.github.io/whereami/) for additional installation instructions.


## What it does

This module aims to be pretty specialized compared to the [other modules](#other-modules) below, and generate some quick information about the geohashes. I'm happy to take suggestions for other things it could do!

Currently it will:

- Find your current location if the argument is not passed in and you are on OS X
- Get the 9 closest geohashes to your location for each day
- Get the global geohash for each day
- Display tables for the distances from each
- Open Google static maps for each
- Output the information as JSON (the structure of the data is subject to change, but I'll semver it)


## CLI Usage

```sh
geohash --date=2015-05-05 --days=3 --json --table --pretty

# This will output the table and json information for the current location
# for May 5th, 6th and 7th
```


## Node Usage

This module is setup to mainly be used from the command line, but it is possible to use it from Node if that's what you want to do.

But really it's main purpose is the CLI, so if you are just trying to do something with the JSON information I would suggest you use [`geohash-coordinates`](https://www.npmjs.com/package/geohash-coordinates) which does most of the heavy lifting for this module.

The same [data options](#data-options) from below can be passed in the function.

```js
import geohash from 'geohash-cli'

geohash({date, days, location, cache, key}, (err, results) => {
  // Results will be the same as the json information outputted from the CLI
  console.log(results)
})
```


## API

### Data options

- `--date=YYYY-MM-DD [today]`
The date to start getting geohashes. Defaults to todays's date.

- `--days [4]`
How many does to get in the future. Defaults to 4 or up to the most current date that has available data.

- `--location=lat,lon [current location]`
Your location. By default it will try and use \`whereami\` to find your current location.

- `--key`
The Google maps static maps API key to use for your maps. This only needs to be used if you'll be visiting for than 1000 map links in a 24 hour period. See the [Google docs](https://developers.google.com/maps/documentation/staticmaps/#api_key) for more info.

- `--cache [$HOME/.config/djia/djia_cache.json]`
The file or directory where you want to cache Dow Jones data. See the [djia module](https://www.npmjs.com/package/djia) documentation for more info.

### Output options

- `-j, --json [false]`
Output the full JSON information.

- `-p, --pretty [false]`
Make the json output prettier.

- `-t, --table [false]`
Output tables of all the distances for each day.

- `-o, --open [false]`
Open all maps in your default browser.

- `-h, --help [false]`
Output the help information and exit.

- `--version [false]`
Output the version and exit.


## Other Modules

This is built from other modules that were created to be smaller parts of this one:

- [`djia`](https://www.npmjs.com/package/djia)
- [`geo-graticule`](https://www.npmjs.com/package/geo-graticule)
- [`geohash-coordinates`](https://www.npmjs.com/package/geohash-coordinates)
- [`hex-frac-dec-frac`](https://www.npmjs.com/package/hex-frac-dec-frac)


## Contributing

This is written in ES6 and compiled to ES5 using [`babel`](https://babeljs.io/). The code you require will come from the `lib/` directory which gets compiled from `src/` before each `npm publish`.


## License

MIT