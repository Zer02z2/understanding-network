const express = require("express")
const router = express.Router()

router.post("/ping", (req, res) => {
  const { name } = req.body
  if (!name) {
    res.status(418).send({ message: "Name is missing" })
  }
  res.status(200).send({
    name: name,
  })
})

const bootTime = new Date()
const serverOffset = bootTime.getTimezoneOffset()
const hourOffset = -serverOffset / 60
const timeZone = `UTC ${hourOffset}:00`

router.get("/serverTime", (req, res) => {
  const date = new Date()
  const millis = date.getMilliseconds()
  const time = date.toLocaleString()
  res.status(200).send({
    serverMillis: millis,
    serverTime: time,
    timeZone: timeZone,
  })
})

module.exports = router
