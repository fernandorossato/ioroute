const handlers = require('./handlers')

module.exports = [
    {
        method: 'AdminLogin',
        handler: handlers.login,
        options: {
            description: 'Login admin users',
            validade: ['username', 'password'],
            auth: false
        }
    }
]