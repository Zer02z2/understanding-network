import express from "express"
import { ExpressPeerServer } from "peer"

const port = 9000
const rootPath = "peerjs"

const app = express()
const server = app.listen(port, () => {
  console.log(`Server is now alive on http://localhost:${port}/${rootPath}/`)
})
const peerServer = ExpressPeerServer(server, {
  debug: true,
})
app.use(`/${rootPath}`, peerServer)
