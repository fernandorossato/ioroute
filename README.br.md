# Para que serve isso?
ioroute foi desenvolvido para processar métodos e eventos do "socket.io" na forma de rotas com 'request' e 'reply' da mesma forma que o hapi.js e o express.

## Instalação
```
npm install ioroute --save
```

## Forma de usar
```
const { MethodRoute, EventRoute } = require('ioroute')
// Servidor Socket.io
const io = require('socket.io')(3000)

// MethodRoute
const methodRoute = new MethodRoute()

// Você deve registrar o diretório de rotas. Subdiretórios também são aceitos.
// O ioroute vai procurar por arquivos chamados routes.js no diretório e subdiretórios informado no register.
await methodRoute.register('api')

// Defina quando as rotas devem começar a serem interpretadas. Normalmente no connection.
io.on('connection', (socket) => {
    methodRoute.start(socket)
});
```

## Exemplo de rota
Você deve criar um arquivo chamado routes.js com as rotas no diretório que você informou no register.
Você também pode criar subdiretórios que também tenham um arquivo chamado routes.js com as rotas.
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

## Exemplo completo
No diretório example [Full Exemple](https://github.com/fernandorossato/ioroute/example) você encontra uma implementação completa da lib.

# Documentation
Algumas propriedades são suportadas na definição da rota, você pode mudá-las no atributo "options" da rota. São elas:
* `validade` - Array com nome dos campos obrigatórios no request.
* `auth` - true/false - Define se a rota só pode ser chamada por usuários autenticados. Por padrão é true.
* `log` - true/false - Define se a rota deve gerar log das chamadas. Por padrão é true.

## Autenticando os clientes do socket.
Para definir que um client conectado está autenticado você deve atribuir `LoginOk = true` no socket dele.

### Exemplo de uma autenticação super simples, por favor implemente algo melhor!
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

## Mudando o formato de data e hora do log
Coloque a linha abaixo antes da importação do ioroute.

```
process.env.IOR_LOG_TIMEFORMAT = 'YYYY-MM-DD HH:mm:ss.SSS'
```

Exemplo:
```
process.env.IOR_LOG_TIMEFORMAT = 'YYYY-MM-DD HH:mm:ss.SSS'

const { MethodRoute, EventRoute } = require('ioroute')
```

Por padrão o ioroute gera log de todas as chamadas de rotas e eventos. Você pode desativar isso informando `log = false` na options da rota.