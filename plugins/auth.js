export default function ({ $auth }) {
  $auth.onError((error, name, endpoint) => {
    // eslint-disable-next-line no-console
    console.error(name, error)
  })
}
