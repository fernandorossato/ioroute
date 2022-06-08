const path = require('path');
const glob = require('glob');
const { log } = require('./log')

module.exports = class EventRoute {
    constructor() {
        this.rotas = [];
    }
    start (io, emiter) {
        this.rotas.forEach(rota => {
            emiter.on(`${rota.method}`, async (ev) => {
                if (typeof rota.options.log === 'undefined' || rota.options.log === true) {
                    log(`[EventRoute] - [${rota.method}] Data: ${JSON.stringify(ev)}`)
                }
                await rota.handler(io, ev);
            });
        });
    }
    register (dir) {
        return new Promise((resolve, reject) => {
            glob(`${dir}/**/routes.js`, { cwd: process.cwd() }, (error, files) => {
                if (error) {
                    log(`[App] Error in load files -> `, error);
                    reject(error);
                } else {
                    files.forEach(file => {
                        try {
                            let route = require(path.join(process.cwd(), file));
                            this._add(route);
                        } catch (error) {
                            log(`[App] Erro in required '${file}' -> `, error);
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
            throw new Error(`The method ${method} Not found`);
        }
        else {
            return metodo;
        }
    }
}