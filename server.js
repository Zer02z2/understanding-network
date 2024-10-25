const express = require("express")
const path = require("path")
const cors = require("cors")
const port = 3001
const rootPath = "undnet"
const app = express()
const darkRoomApi = require("./routes/darkRoom")
const timeMachineApi = require("./routes/timeMachine")

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())
app.use(`/${rootPath}`, express.static(path.join(__dirname, "views")))
app.use(`/${rootPath}/darkRoom/api`, darkRoomApi)
app.use(`/${rootPath}/timeMachine/api`, timeMachineApi)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views/404", "index.html"))
})

app.listen(port, () => {
  console.log(`Server is now alive on http://localhost:${port}/${rootPath}/`)
})
