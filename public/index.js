const socket = io ();

socket.emit("mensaje", "saludos desde el cliente")

socket.on('mensaje_respuesta', (data) => {
    console.log(data)
})

socket.on('mensaje_para_todos',(data) => {
    console.log(data)
})