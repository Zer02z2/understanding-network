const express = require("express")
const router = express.Router()
const { exec } = require("child_process")

const log = {}

const command = 'curl "https://api.ipify.org?format=json"'
exec(command, (error, stdout) => {
  if (error) {
    console.error(`exec error: ${error}`)
    return
  }
  const serverIp = JSON.parse(stdout).ip
  initServerInfo(serverIp)
})

const initServerInfo = async (serverIp) => {
  const serverLocation = await fetchIpLocation(serverIp)
  log["serverIp"] = { ...serverLocation, ip: serverIp }
}

router.get("/ip", (req, res) => {
  const ip = req.ip
  const handleResponse = async () => {
    if (ip == "::1") {
      res.status(200).send(log.serverIp)
      return
    }
    if (log[ip]) {
      res.status(200).send({ ...log[ip].location, ip: ip })
      return
    }
    const location = await fetchIpLocation(ip)
    log[ip] = { location: location }
    res.status(200).send({ ...location, ip: ip })
  }
  handleResponse()
})

router.get("/serverIp", (req, res) => {
  res.status(200).send(log.serverIp)
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

const bootTime = new Date()
const serverOffset = bootTime.getTimezoneOffset()
const hourOffset = -serverOffset / 60
const timeZone = `UTC ${hourOffset}:00`

router.get("/serverTime", (req, res) => {
  const date = new Date()
  const millis = date.getMilliseconds()
  const time = date.toLocaleString()
  console.log(date.timeZone)
  res.status(200).send({
    serverMillis: millis,
    serverTime: time,
    timeZone: timeZone,
  })
})

module.exports = router
