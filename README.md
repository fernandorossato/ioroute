# What is this?
ioroute is a module developed to process "socket.io" methods and events as routes with request and reply like in hapi.js or express.

Translated in google translator, see the original in [Brazilian Portuguese](https://github.com/fernandorossato/ioroute/README.br.md).

## Installation
```
npm install ioroute --save
```

## Use
```
const { MethodRoute, EventRoute } = require('ioroute')
// Socket.io server
const io = require('socket.io')(3000)

// MethodRoute
const methodRoute = new MethodRoute()

// Register your routes directory. (You can create subdirectories)
// ioroute will look for files named routes.js in the directory and subdirectories of the directory entered in the register.
await methodRoute.register('api')

// Define when routes should start to be interpreted, typically on connection.
io.on('connection', (socket) => {
    methodRoute.start(socket)
});
```

## Route exemple
You must create a file called routes.js with the routes in the directory you entered in the register.
You can also create subdirectories that also have a file called routes.js with the routes.
```
module.exports = [
    {
        method: 'UserLogin',
        handler: async (socket, request) => {
            console.log(`You call UserLogin`)
            return { user: { id: 500, name: 'Juca' }, error: false, msg: 'User logged' }
        },
        options: {
            description: 'Login admin users',
            validade: ['user', 'password'],
            auth: false
        }
    }
]
```

## Full Exemple
Check out & run [Full Exemple](https://github.com/fernandorossato/ioroute/example) to see full example usage of the library.

# Documentation
Some settings are supported in the route definition, you can set them in the "options" attribute of the route. These are listed below:
* `validade` - Array with field names must be informed in the request. Field required. 
* `auth` - true/false - Defines whether the route can only be called by authenticated users. By default it is true.
* `log` - true/false - Defines whether the route should generate log. By default it is true.

## Authenticating your clients
To define that a connected client is authenticated you must set `LoginOk = true` on its socket.

### Simple authentication example, please do something better!
```
module.exports = [
    {
        method: 'UserLogin',
        handler: async (socket, request) => {            
            if(request.username == 'admin' && request.password == 'admin') {
                socket.LoginOk = true
                socket.User = { id: 1, name: 'admin' }
                return { error: false, user: socket.User, msg: 'you are logged in' }
            }
            else {
                return new Error(`Invalid login`)
            }            
        },
        options: {
            description: 'Login admin users',
            validade: ['username', 'password'],
            auth: false
        }
    }
]
```

## Changing ioroute log datetime format
Put the line below before importing ioroute.

```
process.env.IOR_LOG_TIMEFORMAT = 'YYYY-MM-DD HH:mm:ss.SSS'
```

Exemple:
```
process.env.IOR_LOG_TIMEFORMAT = 'YYYY-MM-DD HH:mm:ss.SSS'

const { MethodRoute, EventRoute } = require('ioroute')
```

By default ioroute logs the call of all routes and events, you can change this by setting `log = false` in the route options.