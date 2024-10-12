const button = document.getElementById("button")
const display = document.getElementById("display")

const init = () => {
  if (!(button && display)) return

  button.addEventListener("click", () => {
    const time = new Date().toLocaleString()
    display.innerHTML = time
  })
}

init()
