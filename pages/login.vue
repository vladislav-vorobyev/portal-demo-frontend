<template>
  <div class="login-wrap"><span>Logging in...</span></div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'LoginPage',
  layout: 'anonymous',
  data() {
    return {
      activeIndex: this.$nuxt.$route.path,
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  mounted() {
    if (!this.isAuthenticated) {
      this.loginOidc()
    }
  },
  methods: {
    async loginOidc() {
      try {
        await this.$auth.loginWith('oidc')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Login error:', e)
        this.error = e.response.data.error.message
        // eslint-disable-next-line no-console
        console.warn(this.error)
      }
    },
  },
}
</script>

<style lang="scss">
@import '~/assets/css/theme.scss';

.login-wrap {
  color: #dbdde7;
  font-size: 200%;
  width: 100%;
  height: 100vh;
  display: flex;

  span {
    display: inline-block;
    margin: auto;
  }
}
</style>
