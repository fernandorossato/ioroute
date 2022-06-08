const moment = require('moment')
const _TIMEFORMAT = process.env.IOR_LOG_TIMEFORMAT || 'DD-MM-YYYY HH:mm:ss.SSS'

exports.log = (msg) => {
    console.log(`${moment().format(_TIMEFORMAT)} ${msg}`)
}