import {exec} from 'child_process'
import debugThe from 'debug'
import {red, green, underline} from 'colors/safe'

const debug = debugThe('geohash:whereami')

const MISSING_SCRIPT_ERR = `
${red('This module needs to know your location to find the closest geohash!')}

By default it looks for an executable called ${underline('whereami')} somewhere in your $PATH,
but it looks like that couldn't be found.

If you are on ${underline('OS X')}, the easiest way to do this is to use homebrew and run:

${green('brew install whereami')}

The next easiest way is to separately find your geolocation and pass it to this
script by using the ${underline('--location')} argument:

${green('geohash --location=33.3813,-111.9409')}
`

const whereami = (cb) => {
  exec('whereami', (err, stdout, stderr) => {
    if (err && stderr.indexOf('command not found')) {
      return cb(new Error(MISSING_SCRIPT_ERR))
    } else if (err) {
      return cb(err)
    }

    const flatData = stdout.toString().replace(/\n/g, '')
    debug(flatData)
    cb(null, flatData.split(','))
  })
}

export default whereami
