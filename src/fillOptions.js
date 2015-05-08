import moment from 'moment'
import debugThe from 'debug'
import assign from 'lodash/object/assign'
import whereami from './whereami'

const debug = debugThe('geohash:options')

const fillOptions = (options, cb) => {
  const filledOptions = assign({}, options)

  if (!filledOptions.date) {
    filledOptions.date = moment().format('YYYY-MM-DD')
    debug(`No date argument. Using ${filledOptions.date}`)
  }

  if (!filledOptions.location) {
    return whereami((err, result) => {
      if (err) return cb(err)

      filledOptions.location = result
      debug(`No location argument. Using ${filledOptions.location}`)

      cb(null, filledOptions)
    })
  }

  cb(null, filledOptions)
}

export default fillOptions
