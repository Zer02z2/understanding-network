import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import cors from "cors"
import { Server } from "socket.io"
import darkRoomApi from "./routes/darkRoom.js"
import timeMachineApi from "./routes/timeMachine.js"
import textUmapApi from "./routes/textUmap.js"

const port = 3001
const rootPath = "undnet"
const app = express()
const dev = false
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.set("trust proxy", true)

const server = app.listen(port, () => {
  console.log(`Server is now alive on http://localhost:${port}/${rootPath}/`)
})
const io = new Server(server, {
  cors: {
    origin: dev ? "*" : "",
  },
})

app.use(cors({ origin: dev ? "*" : "" }))
app.use(`/${rootPath}`, express.static(path.join(__dirname, "views")))
app.use(
  `/${rootPath}/files/`,
  cors(),
  express.static(path.join(__dirname, "public"))
)
app.use(`/${rootPath}/darkRoom/api`, darkRoomApi())
app.use(`/${rootPath}/timeMachine/api`, timeMachineApi(io))
app.use(`/${rootPath}/textUmap`, cors(), textUmapApi())
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views/404", "index.html"))
})
