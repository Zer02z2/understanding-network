import express from "express"

export default () => {
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
  return router
}
