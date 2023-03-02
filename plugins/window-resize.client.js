export default ({ store }, inject) => {
  store.dispatch('window-size/update')
  window.onresize = () => {
    store.dispatch('window-size/update')
  }
}
