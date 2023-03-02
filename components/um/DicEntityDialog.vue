<template>
  <EntityDialog
    :title="title"
    :visible.sync="formVisible"
    :form-disabled="formDisabled"
    :modified="formModified"
    @form-save="formSave"
  >
    <el-form :model="form" :disabled="formDisabled" label-position="top">
      <el-form-item label="ID">
        <el-input v-model="slug" :placeholder="form.slug" autocomplete="off" @keyup.enter.native="formSave"></el-input>
      </el-form-item>
      <el-form-item label="Имя" required>
        <el-input ref="nameInput" v-model="form.name" autocomplete="off" @keyup.enter.native="formSave"></el-input>
      </el-form-item>
    </el-form>
  </EntityDialog>
</template>

<script>
import EntityDialog from '~/components/shared/_entityDialog.vue'
import { sharedMethods, formLockMethods } from '~/mixins/um-vue-shared-methods'
import { testSlug, cleanupSlug, convertToSlug } from '~/utils/string-ext'

const emptyForm = { slug: '', name: '' }

export default {
  components: { EntityDialog },

  mixins: [sharedMethods, formLockMethods],

  props: {
    entityModel: { type: String, required: true },
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
      autoSlug: true,
      slug: '',
    }
  },

  computed: {
    formDisabled() {
      return !!(this.form.id && !this.isLocked)
    },
  },

  watch: {
    visible(val) {
      this.formVisible = val
      if (val) {
        this.formModified = false
        setTimeout(() => {
          this.lockEntity(this.entityModel)
          this.$refs.nameInput.focus()
        }, 1)
      }
    },

    formVisible(val) {
      this.$emit('update:visible', val)
    },

    data(val) {
      this.form = Object.keys(val).length !== 0 ? { ...val } : { ...emptyForm }
      // prepare auto slug behavior
      this.autoSlug = this.form.slug === convertToSlug(this.form.name)
      this.slug = this.autoSlug ? '' : this.form.slug
      // set modified to false after form change by external update
      setTimeout(() => {
        this.formModified = false
      }, 1)
    },

    form: {
      handler(val) {
        this.formModified = true
        this.lockId = val.id
        if (this.autoSlug) {
          this.form.slug = this.form.name.length ? convertToSlug(this.form.name) : 'автозаполнение'
        }
      },
      deep: true,
    },

    slug() {
      // check auto slug behavior
      if (this.slug === '') {
        if (!this.autoSlug) {
          this.autoSlug = true
          this.form.slug = ''
        }
      } else {
        this.autoSlug = false
        // validate slug filling
        this.form.slug = this.slug
        if (!this.validateSlug()) {
          this.slug = this.form.slug
        }
      }
    },
  },

  methods: {
    formSave() {
      // validate form
      if (!this.form.slug.length || !this.form.name.length) {
        this.$message({
          message: 'Пустые значения недопустимы',
          type: 'error',
        })
        return
      }
      if (!this.validateSlug()) {
        return
      }
      // close dialog and emit event
      this.formVisible = false
      this.$emit('form-save', this.form)
    },

    validateSlug() {
      // validate form slug filling and remove illegal chars
      if (!testSlug(this.form.slug)) {
        this.$message({
          message: 'Для ID допустимы только латинские символы, цыфры, подчеркивание и дефис',
          type: 'error',
        })
        this.form.slug = cleanupSlug(this.form.slug)
        return false
      }
      return true
    },
  },
}
</script>
