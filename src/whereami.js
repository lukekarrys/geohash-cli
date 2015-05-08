import {exec} from 'child_process'
import debugThe from 'debug'
import {red, green, underline} from 'colors/safe'

const debug = debugThe('geohash:whereami')

const MISSING_SCRIPT_ERR = `
${red('An executable called whereami could not be found.')}

By default it looks for the executable ${underline('whereami')} somewhere
in your $PATH, but it looks like that couldn't be found.

If you are on ${underline('OS X')}, the easiest way to do this is to use
homebrew and run:

${green('brew install whereami')}

Otherwise checkout the repo from ${green('http://victor.github.io/whereami/')}
for ways to install from source.
`

const whereami = (cb) => {
  exec('whereami', (err, stdout, stderr) => {
    if (err && stderr.indexOf('command not found')) {
      return cb(new Error(MISSING_SCRIPT_ERR))
    } else if (err) {
      return cb(err)
    }

    const location = stdout.toString().replace(/\n/g, '').split(',').map(Number)
    debug(`lat,lon: ${location}`)

    cb(null, location)
  })
}

export default whereami
