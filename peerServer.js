// import express from "express"
// import { ExpressPeerServer } from "peer"

// const port = 9000
// const rootPath = "peerjs"

// const app = express()
// const server = app.listen(port, () => {
//   console.log(`Server is now alive on http://localhost:${port}/${rootPath}/`)
// })
// const peerServer = ExpressPeerServer(server, {
//   proxied: true,
//   debug: true,
// })
// app.use(`/${rootPath}`, peerServer)

import { PeerServer } from "peer"

const peerServer = PeerServer({
  port: 9000,
  path: "/peerjs",
  proxied: true,
})
