const express = require("express")
const path = require("path")
const router = express.Router()

router.get("/", (req, res) => {})

router.post("/name", (req, res) => {
  const { name } = req.body
  if (!name) {
    res.status(418).send({ message: "Name is missing" })
  }
  res.status(200).send({
    name: name,
  })
})

module.exports = router
