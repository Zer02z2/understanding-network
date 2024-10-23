const express = require("express")
const path = require("path")
const port = 3001
const rootPath = "undnet"

const app = express()
app.use(express.json())
app.listen(port, () => {
  console.log(`Server is now alive on http://localhost:${port}/${rootPath}/`)
})

app.use(`/${rootPath}`, express.static(path.join(__dirname, "views")))

const api = require("./routes/api")
app.use(`/${rootPath}/api`, api)

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views/404", "index.html"))
})
