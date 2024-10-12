const express = require("express")
const path = require("path")

const app = express()
app.use("/undnet", express.static(path.join(__dirname, "views")))
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views/404", "index.html"))
})

app.listen(3001)

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "views", "index.html"))
// })

// const controller = require("./routes/controller")
// app.use("/controller", controller)
