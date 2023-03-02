<template>
  <NuxtChild />
</template>

<script>
export default {
  name: 'LoginCallback',
  layout: 'default',
  middleware: 'auth',
}
</script>
