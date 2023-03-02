<template>
  <nav class="nav">
    <div class="nav__container">
      <NuxtLink v-for="link in links" :key="link.title" :to="link.url" class="nav__item" :class="'-' + link.icon">
        <p>{{ link.title }}</p>
      </NuxtLink>
    </div>
    <div class="nav__item__logo">
      <p class="nav__item__logo__version">1.0</p>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'LeftNavComponent',
  data() {
    return {
      links: [
        { title: 'Главная', icon: 'nav-dashboard', url: '/' },
        { title: 'Компания', icon: 'nav-company', url: '/um/company' },
        { title: 'Новости', icon: 'nav-articles', url: '/articles' },
      ],
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
    activeIndex() {
      return this.$nuxt.$route.path
    },
  },
  methods: {},
}
</script>

<style lang="scss">
@import '../assets/css/components/leftnav';
</style>
