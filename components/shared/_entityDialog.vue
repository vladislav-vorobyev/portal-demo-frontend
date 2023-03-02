<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    :before-close="beforeClose"
    class="entity-dialog"
  >
    <slot />

    <span slot="footer" class="dialog-footer">
      <el-button @click="formCancel">Отмена</el-button>
      <el-button type="primary" :disabled="formDisabled" @click="formSave">Сохранить</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    visible: { type: Boolean, required: true },
    formDisabled: { type: Boolean, required: true },
    modified: { type: Boolean, required: true },
  },

  emits: ['form-save'],

  data() {
    return {
      dialogVisible: false,
    }
  },

  watch: {
    visible(val) {
      this.dialogVisible = val
    },

    dialogVisible(val) {
      this.$emit('update:visible', val)
    },
  },

  methods: {
    beforeClose(done) {
      if (this.modified) {
        this.$confirm('Данные были изменены. Закрыть без сохранения?', 'Предупреждение', {
          confirmButtonText: 'Да',
          cancelButtonText: 'Нет',
          type: 'warning',
        })
          .then(() => {
            done(true)
          })
          .catch(() => {
            done(false)
          })
      } else {
        done(true)
      }
    },

    formCancel() {
      this.beforeClose((cancel) => {
        if (cancel !== false) {
          this.dialogVisible = false
        }
      })
    },

    formSave() {
      this.$emit('form-save')
    },
  },
}
</script>
