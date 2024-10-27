const express = require("express")
const router = express.Router()
const { exec } = require("child_process")
const io = require("socket.io")(3002, {
  cors: {
    origin: "*",
  },
})

const log = {}
const idLog = {}
const bootTime = new Date()
const serverOffset = bootTime.getTimezoneOffset()
const hourOffset = -serverOffset / 60
const timeZone = `UTC ${hourOffset}:00`

const init = async () => {
  const command = 'curl "https://api.ipify.org?format=json"'
  exec(command, (error, stdout) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    const serverIp = JSON.parse(stdout).ip
    initServerInfo(serverIp)
  })
}
const initServerInfo = async (serverIp) => {
  const serverLocation = await fetchIpLocation(serverIp)
  log["serverIp"] = {
    ...serverLocation,
    ip: serverIp,
    name: "server",
    timeZone: timeZone,
  }
}

init()

io.on("connection", (socket) => {
  const id = socket.id
  idLog[id] = { identifier: undefined }
  alertUpdates()
  socket.on("identifier", (identifier) => {
    if (!identifier) return
    idLog[id].identifier = identifier
    log[identifier].identifier = identifier
    log[identifier].online = true
    alertUpdates()
  })
  socket.on("disconnect", () => {
    const identifier = idLog[id].identifier
    delete idLog[id]
    if (!identifier) return
    log[identifier].online = false
    alertUpdates()
  })
})
const alertUpdates = () => {
  io.emit("onChange", log)
}

router.post("/ip", (req, res) => {
  const ip = req.ip
  const { name, timeZone } = req.body
  if (!name) {
    res.status(418).send({ message: "Name is missing" })
    return
  }
  const handleResponse = async () => {
    res.status(200).send({ ip: ip })
    if (log[ip]) {
      if (name === log[ip].name) return
      log[ip].name = name
    } else if (ip == "::1") {
      log[ip] = { ...log.serverIp, name: name }
    } else {
      const location = await fetchIpLocation(ip)
      log[ip] = {
        location: location,
        ip: ip,
        name: name,
        timeZone: timeZone,
        online: undefined,
        id: undefined,
      }
    }
    alertUpdates()
  }
  handleResponse()
})

const fetchIpLocation = async (ip) => {
  const url = `http://ip-api.com/json/${ip}`
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }
  try {
    const response = await fetch(url, options)
    const result = await response.json()
    const location = { city: result.city, country: result.country }
    return location
  } catch {
    const location = { city: undefined, country: undefined }
    return location
  }
}

router.get("/serverTime", (req, res) => {
  const date = new Date()
  const time = date.getTime()
  res.status(200).send({
    time: time,
  })
})

module.exports = router
