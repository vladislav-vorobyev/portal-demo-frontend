<template>
  <el-avatar ref="ava" :src="avaSrc" icon="el-icon-user-solid" @error="avaError"></el-avatar>
</template>

<script>
/**
 * UM vue user form/info componet shared library
 */

export default {
  props: {
    userId: { type: Number, default: 0 },
    photoSrc: { type: String, default: '' },
  },

  data() {
    return {
      id: 0,
      src: '',
    }
  },

  computed: {
    avaSrc() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      if (this.$refs.ava) this.$refs.ava.isImageExist = true
      if (this.src?.substr(0, 8) === 'default/') {
        //   URL.createObjectURL(file.raw)
        return `${this.$config.portalApiURL}/um/photo/${this.id}/` + this.src.substr(8)
      }
      return this.src
    },
  },

  watch: {
    userId(val) {
      this.id = val
    },

    photoSrc(val) {
      // console.log(val, this.$refs.ava.isImageExist)
      this.src = val
    },
  },

  methods: {
    avaError() {
      this.src = ''
      return true
    },
  },
}
</script>
