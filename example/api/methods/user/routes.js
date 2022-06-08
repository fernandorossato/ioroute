module.exports = [
    {
        method: 'UserLogin',
        handler: async (socket, request) => {
            console.log(`You call UserLogin`)
            if (request.username == 'user' && request.password == 'user') {
                socket.LoginOk = true
                socket.User = { id: 500, name: 'user' }
                return { error: false, user: socket.User, msg: 'you are logged in' }
            }
            else {
                return new Error(`Invalid login`)
            }
        },
        options: {
            description: 'Login admin users',
            validade: ['user', 'password'],
            auth: false
        }
    }
]