const express = require("express")
const { exec } = require("child_process")

module.exports = (io) => {
  const router = express.Router()
  const userLog = {}
  const ipLog = {}
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
    ipLog["serverIp"] = {
      location: serverLocation,
      publicIp: serverIp,
      name: "server",
      timeZone: timeZone,
      timeDifference: undefined,
    }
    userLog["server"] = ipLog["serverIp"]
  }

  init()

  console.log(io)

  io.on("connection", (socket) => {
    const id = socket.id
    const ip = socket.handshake.address

    socket.on("init", (userData) => {
      initUser(id, ip, userData)
    })

    socket.on("userData", (userData) => {
      if (!userData) return
      Object.keys(userData).forEach((key) => {
        if (userData[key]) userLog[id][key] = userData[key]
      })
      alertUpdates()
    })
    socket.on("disconnect", () => {
      delete userLog[id]
      alertUpdates()
    })
  })

  const alertUpdates = () => {
    io.emit("onChange", userLog)
  }
  const initUser = async (id, ip, userData) => {
    userLog[id] = userData
    if (ip === "::1") {
      userLog[id] = { ...userLog[id], ...ipLog.serverIp }
    } else if (ipLog[ip]) {
      userLog[id] = { ...userLog[id], ...ipLog[ip] }
    } else {
      const location = await fetchIpLocation(ip)
      ipLog[ip] = {
        location: location,
        publicIp: ip,
      }
      userLog[id] = { ...userLog[id], ...ipLog[ip] }
    }
    alertUpdates()
  }

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
  return router
}
