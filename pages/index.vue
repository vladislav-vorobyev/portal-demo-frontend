<template>
  <div class="dashboard">
    <div class="container">
      <Dashboard />
    </div>
  </div>
</template>

<script>
import Dashboard from '~/components/main/Dashboard.vue'

export default {
  name: 'IndexPage',
  components: { Dashboard },
  layout: 'default',
}
</script>
