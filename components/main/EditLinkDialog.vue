<template>
  <EntityDialog
    :title="title"
    :visible.sync="formVisible"
    :form-disabled="false"
    :modified="formModified"
    @form-save="formSave"
  >
    <el-form :model="form" label-position="top">
      <el-form-item label="Имя" required>
        <el-input ref="firstInput" v-model="form.title" autocomplete="off" @keyup.enter.native="formSave"></el-input>
      </el-form-item>
      <el-form-item label="URL" required>
        <el-input v-model="form.href" autocomplete="off" @keyup.enter.native="formSave"></el-input>
      </el-form-item>
      <el-form-item label="Icon URL">
        <el-input v-model="form.img" autocomplete="off" @keyup.enter.native="formSave"></el-input>
      </el-form-item>
    </el-form>
  </EntityDialog>
</template>

<script>
import EntityDialog from '~/components/shared/_entityDialog.vue'
import { sharedMethods, formLockMethods } from '~/mixins/um-vue-shared-methods'

const emptyForm = { href: '', img: '', title: '' }

export default {
  components: { EntityDialog },

  mixins: [sharedMethods, formLockMethods],

  props: {
    title: { type: String, required: true },
    visible: { type: Boolean, default: false },
    data: { type: Object, default: emptyForm },
  },

  emits: ['form-save'],

  data() {
    return {
      formVisible: false,
      formModified: false,
      form: emptyForm,
    }
  },

  computed: {},

  watch: {
    visible(val) {
      this.formVisible = val
      if (val) {
        this.formModified = false
        setTimeout(() => {
          this.$refs.firstInput.focus()
        }, 1)
      }
    },

    formVisible(val) {
      this.$emit('update:visible', val)
    },

    data(val) {
      this.form = Object.keys(val).length !== 0 ? { ...val } : { ...emptyForm }
      // set modified to false after form change by external update
      setTimeout(() => {
        this.formModified = false
      }, 1)
    },

    form: {
      handler(val) {
        this.formModified = true
      },
      deep: true,
    },
  },

  methods: {
    formSave() {
      // validate form
      if (!this.form.href.length || !this.form.title.length) {
        this.$message({
          message: 'Пустые значения недопустимы',
          type: 'error',
        })
        return
      }
      // close dialog and emit event
      this.formVisible = false
      this.$emit('form-save', this.form)
    },
  },
}
</script>
