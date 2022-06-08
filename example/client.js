// You can emit events to the socket that ioroute will check if it is defined in some "routes.js" file.
// If it is the method defined in "handler" will be executed with the informed data.

const client = require("socket.io-client")('http://localhost:3000', {
    "rejectUnauthorized": false
})

client.on('connect', () => {
    console.log(`Connected on server`)
    // Call route AdminLogin defined in api/methods/admin/routes.js
    client.emit(`AdminLogin`, { username: 'admin', password: 'admin' }, response => {
        console.log(`AdminLogin response ${JSON.stringify(response, null, 2)}`)
    })
});

// You call your methods by emitting events like this:
client.emit(`getUsers`, { page: 1, max: 30 }, response => {
    console.log(`getUsers response ${JSON.stringify(response, null, 2)}`)
})

// You can listen for events emitted by the server like this:
client.on('broadcast', (e) => {
    console.log(`Broadcast event emitted `, e)
});

// You can listen for events emitted by the server like this:
client.on('timeinterval', (e) => {
    console.log(`Timeinterval event emitted `, e)
});

client.on('disconnect', (e) => {
    console.log(e)
});