import jwtDecode from 'jwt-decode'

function shouldRefresh(token) {
  try {
    const decodedToken = jwtDecode(token.get())

    const timeToLive = decodedToken.exp * 1000 - decodedToken.iat * 1000
    const timeDifference = decodedToken.exp * 1000 - Date.now()
    const timeExpired = timeToLive - timeDifference

    return timeExpired / timeToLive >= 0.75
  } catch (ignored) {
    return false
  }
}

function isTokenableScheme(scheme) {
  return 'token' in scheme
}

export default function ({ $auth }) {
  if (!process.server) {
    setInterval(async () => {
      const strategies = $auth.strategies

      const hasTokenToRefresh = Object.values(strategies).reduce((acc, scheme) => {
        if (!isTokenableScheme(scheme)) return false

        const token = scheme.token

        if (token && !token?.status()?.expired()) {
          return acc || shouldRefresh(token)
        } else {
          return acc || false
        }
      }, false)

      if (hasTokenToRefresh) {
        await $auth.refreshTokens()
      }
    }, 5000)
  }
}
