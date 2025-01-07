import express from "express"

export default (io) => {
  const router = express.Router()

  io.of("/screenShare").on("connection", (socket) => {
    const userData = { id: undefined, room: undefined }
    socket.on("join-room", (roomId, userId) => {
      userData.id = userId
      userData.room = roomId
      console.log(roomId, userId)
      socket.join(roomId)
      socket.to(roomId).emit("user-connected", userId)
    })
    socket.on("disconnect", () => {
      console.log("user disconnected: ", userData.id)
      const { id, room } = userData
      socket.to(room).emit("close-call", id)
    })
  })
  return router
}
