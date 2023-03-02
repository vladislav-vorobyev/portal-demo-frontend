export default function ({ $config, $axios, store }, inject) {
  const axiosPortalApi = $axios.create({
    headers: {
      common: {
        Accept: 'text/plain, */*',
      },
    },
  })

  axiosPortalApi.setBaseURL($config.portalApiURL)

  axiosPortalApi.onRequest(() => {
    if (!store.$auth.loggedIn) {
      throw new Error('User is not logged in')
    }

    const currentToken = store.$auth.strategy?.token?.get()

    if (!currentToken) {
      throw new Error('Wrong auth token')
    }

    axiosPortalApi.setHeader('Authorization', currentToken)
  })

  inject('portalApi', axiosPortalApi)
}
