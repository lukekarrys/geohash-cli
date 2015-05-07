xkcd-geohash
=========================

CLI and JS tool to find as much info as possible about today's (or any date's) geohashes.

I use this for [xkcd Geohashing](https://xkcd.com/426/).

[![NPM](https://nodei.co/npm/xkcd-geohash.png)](https://nodei.co/npm/xkcd-geohash/)
[![Build Status](https://travis-ci.org/lukekarrys/xkcd-geohash.png?branch=master)](https://travis-ci.org/lukekarrys/xkcd-geohash)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)


## Install

**WIP: not published yet**
`npm install xkcd-geohash`


## Other Modules

This is built from other modules that were created to be smaller parts of this one:

- [`djia`](https://www.npmjs.com/package/djia)
- [`geo-graticule`](https://www.npmjs.com/package/geo-graticule)
- [`geohash-coordinates`](https://www.npmjs.com/package/geohash-coordinates)
- [`hex-frac-dec-frac`](https://www.npmjs.com/package/hex-frac-dec-frac)


## TODO

- Add `latest` option which will get all the possible today and future geohashes and globals
- Add options to only get graticule, global, or neighbors instead of all


## Contributing

This is written in ES6 and compiled to ES5 using [`babel`](https://babeljs.io/). The code you require will come from the `lib/` directory which gets compiled from `src/` before each `npm publish`.


## License

MIT