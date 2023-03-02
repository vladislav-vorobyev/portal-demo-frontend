// Prepare runtime enviroment file
import fs from 'fs'
import fse from 'fs-extra'
if (!fse.pathExistsSync('./static/config.json')) {
  fs.copyFileSync('./static/config.example.json', './static/config.json')
}
const currentEnvConfig = JSON.parse(fs.readFileSync('./static/config.json', 'utf8'))

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Portal D',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['element-ui/lib/theme-chalk/index.css', '~/assets/css/main.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/runtime-config.js',
    '@/plugins/axios-portal.js',
    '@/plugins/my-user-data.js',
    '@/plugins/window-resize.client.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'cookie-universal-nuxt',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    // baseURL: `${process.env.STRAPI_URL || 'http://localhost:1337'}/api`
    baseURL: '/',
    browserBaseURL: '/',
  },

  env: currentEnvConfig,
  serverRuntimeConfig: currentEnvConfig,
  publicRuntimeConfig: currentEnvConfig,

  router: {
    middleware: ['auth'],
  },

  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      callback: '/callback',
    },
    cookie: {
      options: {
        expires: 10,
      },
    },
    plugins: ['~/plugins/jwt-refresh.js', '~/plugins/user-info.js', '~/plugins/auth.js'],
    strategies: {
      oidc: {
        scheme: '~/configs/runtimeOpenIDConnectScheme.js',
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
    extend(config, { isClient }) {
      config.optimization.minimize = false
      if (isClient) {
        config.node = {
          fs: 'empty',
        }
      } else {
        config.target = 'node'
      }
    },
  },
}
