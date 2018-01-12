export default {
  log: () => {
    console.log.call(this, arguments)
  }
}