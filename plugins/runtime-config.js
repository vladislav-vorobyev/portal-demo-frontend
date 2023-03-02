export default function ({ $axios }, inject) {
  let config = {}

  const getConfig = () => config
  if (process && process.server) {
    config = JSON.parse(require('fs').readFileSync('static/config.json', 'utf8'))
  } else {
    $axios.get('/config.json').then((res) => {
      config = res.data
    })
  }
  inject('getConfig', getConfig)
}
