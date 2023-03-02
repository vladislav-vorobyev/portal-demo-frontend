<template>
  <div class="logout-wrap"><span>Logout...</span></div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'LogoutPage',
  layout: 'anonymous',
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  mounted() {
    if (this.isAuthenticated) {
      this.$auth.logout()
    }
  },
}
</script>
