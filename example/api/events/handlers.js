exports.broadcast = async (io, ev) => {
    console.log(`Broadcast event emmited with data `, ev)

    // Your code here...

    // You can use the "socket.io" instance passed to "handlers" to relay the event to the users connected to the socket.
    // Event for users in Living Room
    io.to('LivingRoom').emit('broadcast', ev)

    // broadcast to all connected users
    io.emit('broadcast', ev)
}

exports.timeinterval = async (io, ev) => {
    console.log(`Timeinterval event emmited with data `, ev)

    // Your code here...

    // You can use the "socket.io" instance passed to "handlers" to relay the event to the users connected to the socket.
    io.emit('timeinterval', ev)
}