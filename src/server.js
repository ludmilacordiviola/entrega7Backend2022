const express = require('express')
const path = require('path')
const { Server: IOServer } = require('socket.io')
const Contenedor = require('./utils/contenedor.js')
const Chat = require('./utils/chat')

const app = express()
const expressServer = app.listen(8080, () => console.log('Server listening port 8080'))
const io = new IOServer(expressServer)


app.use(express.static(path.join(__dirname, '../public')))

const contenedor = new Contenedor("productos.txt")
const chat = new Chat("chat.txt")
const messageArray = []

//Aca vienen las interacciones de io: servidor<-->cliente
io.on('connection', async socket =>  {
    console.log(`Client ID: ${socket.id} conected`)
    socket.emit('server:products', await contenedor.getAll())
    socket.emit('server:mensajes', await chat.getAll())

    //Evento de carga de nuevo producto
    socket.on('client:newProduct', async newProductInfo => {
        await contenedor.postProduct(newProductInfo)
        io.emit('server:products', await contenedor.getAll())
    })
    
    //Evento de nuevo mensaje
    socket.on('client:message', async messageInfo => {
        await chat.postMessage(messageInfo)

        io.emit('server:mensajes', await chat.getAll())
    })
})