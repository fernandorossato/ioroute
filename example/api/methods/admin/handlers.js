exports.login = async (socket, request) => {
    console.log(`You call [login]`)
    if (request.username == 'admin' && request.password == 'admin') {
        socket.LoginOk = true
        socket.User = { id: 1, name: 'admin' }
        return { error: false, user: socket.User, msg: 'you are logged in' }
    }
    else {
        return new Error(`Invalid login`)
    }
}