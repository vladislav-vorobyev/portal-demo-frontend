<template>
  <div v-loading="loading" class="card-wrapper">
    <div class="card-top">
      <div class="card-top__title" @click="openApp">
        <p>{{ name }}</p>
      </div>
      <el-dropdown trigger="click">
        <div class="card-top__options"></div>
        <el-dropdown-menu slot="dropdown">
          <a @click="$emit('hide-click', uid)"> <el-dropdown-item>Скрыть</el-dropdown-item> </a>
          <a @click="$emit('setup-click', uid)"> <el-dropdown-item>Переместить...</el-dropdown-item> </a>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <component :is="type" :loading.sync="loading" />
  </div>
</template>

<script>
import VPCard from './VPCard.vue'
import OTMCard from './OTMCard.vue'

export default {
  name: 'UniversalCard',
  components: { VPCard, OTMCard },

  props: {
    type: { type: String, required: true },
    uid: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
  },

  emits: ['hide-click', 'setup-click'],

  data() {
    return {
      loading: false,
    }
  },

  methods: {
    openApp() {
      window.open(this.url, '_blank')
    },
  },
}
</script>

<style lang="scss">
@import '~/assets/css/components/card';
</style>
