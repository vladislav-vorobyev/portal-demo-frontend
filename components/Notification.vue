<template>
  <el-alert title="Ошибка!" type="error" effect="dark" :description="description" />
</template>

<script>
export default {
  name: 'NotificationComponent',
  props: {
    description: {
      type: String,
      default: 'error',
    },
  },
}
</script>
