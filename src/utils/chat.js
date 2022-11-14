const fs = require('fs')

class Chat{
    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo
    }

    async postMessage(req){
        try{
            let messages = await fs.promises.readFile(this.nombreArchivo, 'utf-8')
            let parseMessages = await JSON.parse(messages)

            let { userEmail, message } = req
            
            const newMessage = {
                "userEmail":userEmail,
                "message":message,
            }

            parseMessages.push(newMessage)
            await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(parseMessages, null, "\t"))
            
            
        } catch(error) {
            console.log(`Ocurrio un error al guardar. El error fue: ${error}`)
        }
    }

    async getAll(){
        try {
            let messages = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
            const parseMessages = await JSON.parse(messages)
            return parseMessages
        } catch (error) {
            console.log(`Ocurrio un error al leer archivo. El error fue: ${error}`)
        }
    }
}

module.exports = Chat