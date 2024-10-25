const express = require("express")
const router = express.Router()

const log = {}

router.get("/ip", (req, res) => {
  const ip = req.ip
  const handleResponse = async () => {
    // if (ip == "::1") {
    //     res.status(200).send({ ip: "Localhost" })
    //     return
    //   }
    const location = await getIpLocation(ip)
    res.status(200).send({ ...location, ip: ip })
  }
  handleResponse()
})

const getIpLocation = async (ip) => {
  if (log[ip]) return log[ip].location
  else return await fetchIpLocation(ip)
}

const fetchIpLocation = async (ip) => {
  const url = `http://ip-api.com/json/${"24.48.0.1"}`
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
    log[ip] = { location: location }
    console.log(log)
    return location
  } catch {
    return { message: "unable to find location" }
  }
}

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
