<template>
  <div class="antares">
    <HeaderComponent />
    <div class="main">
      <LeftNavComponent />
      <Nuxt />
    </div>
    <!--    <FooterComponent />-->
  </div>
</template>

<script>
import HeaderComponent from '../components/Header.vue'
import LeftNavComponent from '../components/LeftNav.vue'
// import FooterComponent from '../components/Footer.vue'

export default {
  name: 'DefaultLayout',
  components: {
    HeaderComponent,
    LeftNavComponent,
    // FooterComponent,
  },
}
</script>
