const net = require("net")

const server = net.createServer((socket) => {
  console.log("Client connected")

  socket.on("data", (data) => {
    const message = data.toString()
    console.log(message)
    socket.write(`Echo: ${data}`)
  })

  socket.on("end", () => {
    console.log("Client disconnected")
  })

  socket.on("error", (err) => {
    console.error("Socket error:", err)
  })
})

server.listen(8080, () => {
  console.log("Server listening on port 8080")
})
