const handlers = require('./handlers')

module.exports = [
    {
        method: 'broadcast',
        handler: handlers.broadcast,
        options: {
            description: 'Broadcast event for test'
        }
    },
    {
        method: 'timeinterval',
        handler: handlers.timeinterval,
        options: {
            description: 'Timeinterval event for test'
        }
    }
]