const button = document.getElementById("button")
const input = document.getElementById("input")
const record = document.getElementById("right-column")

const init = () => {
  if (!(button && input)) {
    alert("Something went wrong. Please refresh")
    return
  }

  const sendRequest = async () => {
    const value = input.value
    if (value.replace(/\s+/g, "").length === 0) return
    fetchPing(value)
    input.value = ""
  }

  button.addEventListener("click", sendRequest)
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return
    sendRequest()
  })
}

const fetchPing = async (name) => {
  const url = "https://io.zongzechen.com/undnet/api/darkRoom/ping"
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
    const startTime = new Date().getTime()
    const response = await fetch(url, options)
    const parsedResponse = await response.json()
    const endTime = new Date().getTime()
    const ping = endTime - startTime
    addNewRecord(parsedResponse.name, ping)
    console.log(parsedResponse)
  } catch (error) {}
}

addNewRecord = (name, ping) => {
  const element = document.createElement("p")
  const content = `${name}'s ping is ${ping} ms`
  const textnode = document.createTextNode(content)
  element.appendChild(textnode)
  record.appendChild(element)
}

init()
