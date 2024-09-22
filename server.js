const express = require("express")
const path = require("path")
const app = express()

app.listen(3001)

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"))
})

const controller = require("./routes/controller")
app.use("/controller", controller)
