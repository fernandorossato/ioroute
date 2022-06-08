const path = require('path');
const glob = require('glob');
const ioRoute = require('./ioRoute');
const { log } = require('./log')

module.exports = class MethodRoute {
    constructor() {
        this.rotas = [];
    }
    start (emiter) {
        this.rotas.forEach(rota => {
            emiter.on(`${rota.method}`, (request, reply, arg3) => {
                const route = new ioRoute(emiter, request, reply);
                if (typeof rota.options.auth !== 'undefined') route.auth = rota.options.auth;
                if (rota.options.validade) route._validate = rota.options.validade;
                route.handler(async () => {
                    let ret = await rota.handler(emiter, request, arg3);
                    if (typeof rota.options.log === 'undefined' || rota.options.log === true) {
                        log(`[MethodRoute] - [${rota.method}] Request: ${JSON.stringify(request)}, Reply: ${JSON.stringify(ret)}`)
                    }
                    return ret
                })
            });
        });
    }
    register (dir) {
        return new Promise((resolve, reject) => {
            glob(`${dir}/**/routes.js`, { cwd: process.cwd() }, (error, files) => {
                if (error) {
                    reject(error);
                } else {
                    files.forEach(file => {
                        try {
                            let route = require(path.join(process.cwd(), file));
                            this._add(route);
                        } catch (error) {
                            reject(error);
                        }
                    });
                    resolve('Modulos add');
                }
            });
        });
    }
    _add (rotas) {
        let metodos = rotas.map(m => m.method);
        let metodo = this.rotas.find(r => metodos.includes(r.method));
        if (metodo) {
            throw new Error(`The method ${metodo.method} it's already defined`);
        }
        else {
            rotas.forEach(rota => {
                this[rota.method] = rota;
            });
            this.rotas = this.rotas.concat(rotas);
        }
    }
    method (method) {
        let metodo = this.rotas.find(r => r.method == method);
        if (!metodo) {
            throw new Error(`O Metodo ${method} Not found`);
        }
        else {
            return metodo;
        }
    }
}