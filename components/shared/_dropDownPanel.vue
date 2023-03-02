<template>
  <el-dropdown ref="main" trigger="click" placement="bottom-start">
    <span class="el-dropdown-link" @click="dropClick"><i class="el-icon-arrow-down el-icon--right"></i></span>
    <el-dropdown-menu slot="dropdown" class="um-form-dropdown-items-pane">
      <slot />
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'DropDownPanel',
  methods: {
    dropClick() {
      /* console.log(this.$refs)
      this.$refs.main?.$el.classList.add('active') */
    },
  },
}
</script>
