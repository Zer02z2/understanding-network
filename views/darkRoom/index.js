const button = document.getElementById("button")
const input = document.getElementById("input")

const init = () => {
  if (!(button && input)) {
    alert("Something went wrong. Please refresh")
    return
  }

  const sendRequest = async () => {
    const value = input.value
    if (value.replace(/\s+/g, "").length === 0) return
    fetchPin(value)
    input.value = ""
  }

  button.addEventListener("click", sendRequest)
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return
    sendRequest()
  })
}

const fetchPin = async (name) => {
  const url = "/undnet/api/darkRoom/ping"
  const data = {
    name: name,
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
    console.log("Start fetching")
    const response = await fetch(url, options)
    const parsedResponse = await response.json()
    console.log(parsedResponse)
  } catch (error) {}
}

init()
