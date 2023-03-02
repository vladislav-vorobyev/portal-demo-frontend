<template>
  <EntityDialog
    :title="formTitle"
    :visible.sync="formVisible"
    :form-disabled="formDisabled"
    :modified="formModified"
    class="roles-dialog"
    @form-save="formSave"
  >
    <el-form ref="elForm" :model="form" :disabled="formDisabled" label-position="top">
      <!-- <el-form-item label="Роли">
        <el-select v-model="userRoles" placeholder="Выбрать" multiple class="full-line-select">
          <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item label="" class="user-roles-t">
        <el-transfer
          v-model="userRoles"
          :data="transferData"
          filterable
          filter-placeholder=" Поиск..."
          :left-default-checked="[]"
          :right-default-checked="[]"
          :titles="['Доступные', 'Назначенные']"
          :button-texts="['Убрать', 'Добавить']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}',
          }"
          @change="formChange"
        >
        </el-transfer>
      </el-form-item>
    </el-form>
  </EntityDialog>
</template>

<script>
import EntityDialog from '~/components/shared/_entityDialog.vue'
import { sharedMethods, formLockMethods } from '~/mixins/um-vue-shared-methods'

const emptyForm = {
  id: null,
  uid: '',
  display_name: '',
}

export default {
  components: { EntityDialog },

  mixins: [sharedMethods, formLockMethods],

  props: {
    entityModel: { type: String, required: true },
    visible: { type: Boolean, default: false },
    data: { type: Object, default: emptyForm },
  },

  emits: ['form-save'],

  data() {
    return {
      loading: false,
      formVisible: false,
      formModified: false,
      form: emptyForm,
      roles: [],
      userRoles: [],
      transferData: [],
    }
  },

  computed: {
    formDisabled() {
      return !!(this.loading || (this.form.id && !this.isLocked))
    },

    formTitle() {
      return `${this.form.display_name} (${this.form.uid}) - Список ролей`
    },
  },

  watch: {
    visible(val) {
      this.formVisible = val
      if (val) {
        this.formModified = false
      }
    },

    formVisible(val) {
      this.$emit('update:visible', val)
      if (!val) {
        // unset id on close
        setTimeout(() => {
          this.lockId = null
        }, 0)
      }
    },

    data(val) {
      this.form = Object.keys(val).length !== 0 ? { ...val } : { ...emptyForm }
      if (this.lockId !== this.form.id) {
        this.lockId = this.form.id
        if (this.formVisible) {
          this.fetchAllData()
          this.lockEntity(this.entityModel)
        }
      }
    },

    roles() {
      this.transferData = []
      this.roles.forEach((v) => {
        this.transferData.push({ key: v.id, label: v.name, disabled: false })
      })
    },
  },

  methods: {
    formChange() {
      this.formModified = true
    },

    formSave() {
      // validate form
      this.$refs.elForm.validate((valid) => {
        if (valid) {
          // close dialog and emit event
          this.formVisible = false
          this.$emit('form-save', this.form.id, this.userRoles)
        } else {
          this.errorMessage('Некорректные данные')
          return false
        }
      })
    },

    fetchAllData() {
      this.loading = true

      Promise.all([
        this.$portalApi.get('/um/roles').then((response) => {
          this.roles = response.data ?? []
          return Promise.resolve
        }),
        this.$portalApi.get(`/um/user/${this.form.id}/roles/full`).then((response) => {
          if (Array.isArray(response.data)) {
            this.userRoles = response.data.map((v) => {
              return typeof v === 'object' ? v.id : v
            })
          } else this.userRoles = []
          return Promise.resolve
        }),
      ])
        .then(() => {
          this.loading = false
        })
        .catch(this.axiosOnErrorShowMessage)
    },
  },
}
</script>
