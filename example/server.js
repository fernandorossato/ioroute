/**
 * Server example with methods only
 */

const { MethodRoute } = require('../index')



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
}

start()
