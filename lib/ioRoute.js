module.exports = class ioRoute {
    constructor(socket, request, reply) {
        this._socket = socket;
        this._request = request;
        this._reply = reply;
        this.auth = true;
        this._validate = [];
        this.admin = false;
        this.needQueue = false;
    }
    /**
     * Add a field name for required in request     
     * @param {String} campo 
     */
    addValidate (campo) {
        this._validate.push(campo);
    }
    validate () {
        if (this._validate.length > 0) {
            if (!this._request) {
                this.validate_msg = { error: true, errorDetails: 'Need request data.' };
            }
            else {
                this._validate.forEach(campo => {
                    if (!this._request[campo]) this.validate_msg = { error: true, errorDetails: `You must enter a ${campo} value in your request.` };
                });
            }
            if (this.validate_msg) {
                if (typeof this._reply === 'function') this._reply(this.validate_msg);
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    }
    async handler (call) {
        // Verifica se a rota precisa de Auth e se o socket está auth
        if (this.auth && !this._socket.LoginOk) {
            if (typeof this._reply === 'function') this._reply({ error: true, errorDetails: 'Please login first.!' });
            return;
        }
        // Verifica se a rota precisa ser admin
        if (this.admin && !this._socket.Admin) {
            if (typeof this._reply === 'function') this._reply({ error: true, errorDetails: 'Only admin users can use this route.' });
            return;
        }
        // Verifica se a rota precisa ter filas
        if (this.needQueue && (!this._socket.filas || this._socket.filas.length == 0)) {
            if (typeof this._reply === 'function') this._reply({ error: true, errorDetails: 'You do not have access to any queues.' });
            return;
        }
        // Validação de campos
        if (this.validate()) {
            // Implementacao do Handler pelo usuario..
            const ret = await call();
            if (ret) {
                // Se o handler retornar algo e o cliente enviou uma funcao para reply, reply...                
                if (typeof this._reply === 'function') {
                    // Verifica se o retorno é erro
                    if (ret instanceof Error) {
                        this._reply({ error: true, errorDetails: ret.message });
                    }
                    else {
                        this._reply(ret);
                    }
                }
            }
        }
    }
    manualReplay (ret) {
        if (typeof this._reply === 'function') this._reply(ret);
    }
}