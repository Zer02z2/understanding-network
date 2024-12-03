import express from "express"

export default (io) => {
  const router = express.Router()

  io.of("/screenShare").on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
      console.log(roomId, userId)
      socket.join(roomId)
      socket.to(roomId).emit("user-connected", userId)
    })
  })
  return router
}
