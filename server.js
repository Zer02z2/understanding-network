const express = require("express")
const path = require("path")
const cors = require("cors")
const port = 3001
const rootPath = "undnet"
const app = express()

app.use(express.json())
const server = app.listen(port, () => {
  console.log(`Server is now alive on http://localhost:${port}/${rootPath}/`)
})

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
})

darkRoomApi = require("./routes/darkRoom")
const timeMachineApi = require("./routes/timeMachine")(io)

app.use(cors({ origin: "*" }))
app.use(`/${rootPath}`, express.static(path.join(__dirname, "views")))
app.use(`/${rootPath}/darkRoom/api`, darkRoomApi)
app.use(`/${rootPath}/timeMachine/api`, timeMachineApi)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views/404", "index.html"))
})
