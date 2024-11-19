import { UMAP } from "umap-js"
import seedrandom from "seedrandom"
import express from "express"

export default () => {
  const router = express.Router()

  router.post("/", async (req, res) => {
    const { text_batch, length } = req.body
    if (!text_batch) {
      return res.status(418).send({ message: "textBetch is missing" })
    }
    if (!length) {
      return res.status(418).send({ message: "length is missing" })
    }
    try {
      const result = await fetchEmbedding(text_batch)
      const output = result.output
      const embeddings = output.map((point) => point.embedding)
      const myrng = seedrandom("hello.")
      const umap = new UMAP({
        nNeighbors: Math.min(length - 1, 6),
        minDist: 0.1,
        nComponents: 2,
        random: myrng,
        spread: 0.99,
      })
      const fittings = umap.fit(embeddings)
      const normalizedFittings = normalize(fittings)
      res.status(200).send(normalizedFittings)
    } catch (error) {
      console.log(error)
      res.status(418).send({ message: "Unable to process request" })
    }
  })

  return router
}

const fetchEmbedding = async (input) => {
  const url = "https://replicate-api-proxy.glitch.me/create_n_get/"
  const data = {
    version: "b6b7585c9640cd7a9572c6e129c9549d79c9c31f0d3fdce7baac7c67ca38f305",
    input: { text_batch: input },
  }
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  }
  try {
    console.log("start fetching")
    const response = await fetch(url, options)
    const parsedResponse = await response.json()
    return parsedResponse
  } catch (error) {
    return error
  }
}

const normalize = (arrayOfNumbers) => {
  const [x, y] = [arrayOfNumbers[0][0], arrayOfNumbers[0][1]]
  let max = [x, y]
  let min = [x, y]
  for (let i = 0; i < arrayOfNumbers.length; i++) {
    for (let j = 0; j < 2; j++) {
      if (arrayOfNumbers[i][j] > max[j]) {
        max[j] = arrayOfNumbers[i][j]
      }
      if (arrayOfNumbers[i][j] < min[j]) {
        min[j] = arrayOfNumbers[i][j]
      }
    }
  }
  const normalizedArr = arrayOfNumbers.map((numbers) => {
    const num1 = (numbers[0] - min[0]) / (max[0] - min[0])
    const num2 = (numbers[1] - min[1]) / (max[1] - min[1])
    return [num1, num2]
  })
  return normalizedArr
}
