/**
 * Server example with methods and events
 */

// Changing ioroute log datetime format before importing them
process.env.IOR_LOG_TIMEFORMAT = 'YYYY-MM-DD HH:mm:ss.SSS'

const { MethodRoute, EventRoute } = require('../index')

// Event emitter for testing purposes
const EventEmitter = require('events')
class EventEmitterExemple extends EventEmitter {
    constructor() {
        super()
        let vm = this
        // Emitting event every 5s for testing.
        setInterval(() => {
            vm.emit('timeinterval', { data1: 'blabla', msg: 'At 5s' })
        }, 5000)

        // Emitting event every 15s for testing.
        setInterval(() => {
            vm.emit('broadcast', { data2: 'same', msg: 'At 15s' })
        }, 15000)
    }
}

const start = async () => {
    // Start socket.io server on port 3000
    let io = require('socket.io')(3000)
    console.log(`Server is running at port 3000`)

    // MethodRoute
    const methodRoute = new MethodRoute()
    // Define your route directory (You can create subdirectories)
    await methodRoute.register('api/methods')

    // When a client connects to the socket we start listening to the methods it calls
    io.on('connection', (socket) => {
        methodRoute.start(socket)
    });


    // EventRoute
    const eventRouter = new EventRoute()

    // Define route directory for events
    await eventRouter.register('api/events');

    // Start the event listen on EventEmitterExemple
    const events = new EventEmitterExemple()
    eventRouter.start(io, events);
}

start()
