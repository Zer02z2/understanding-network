import express from "express"
import { ExpressPeerServer } from "peer"

const app = express()
const server = app.listen(9000)
const peerServer = ExpressPeerServer(server)
app.use("/peerjs", peerServer)
