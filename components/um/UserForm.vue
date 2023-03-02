<template>
  <div class="user-form-wrap user-wrap">
    <el-form
      ref="elForm"
      :model="form"
      :disabled="formDisabled"
      label-position="top"
      :class="formDisabled ? 'is-disabled' : ''"
    >
      <el-form-item class="avatar-wrap avatar-140">
        <el-upload
          class="avatar-uploader"
          :action="`${$config.portalApiURL}/um/photo/${form.id}/upload`"
          :headers="{ Authorization: $auth.strategy?.token?.get() }"
          accept="image/*"
          :show-file-list="false"
          :disabled="loadingImage"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <Ava :user-id="form.id" :photo-src="form.photo" />
          <el-link :underline="false" :disabled="formDisabled">Изменить аватар</el-link>
        </el-upload>
      </el-form-item>

      <el-form-item label="UID">
        <el-input v-model="form.uid" autocomplete="off" disabled class="info-field"></el-input>
      </el-form-item>

      <el-form-item
        prop="email"
        label="Корпоративная почта (email)"
        :rules="[{ type: 'email', message: 'Некорректный email адрес', trigger: ['blur', 'change'] }]"
      >
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="ФИО">
        <el-input v-model="fioRu" autocomplete="off" class="um-form-dropdown-items">
          <DropDownPanel slot="prepend">
            <el-form-item label="Фамилия">
              <el-input v-model="form.last_name_ru" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="Имя">
              <el-input v-model="form.first_name_ru" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="Отчество">
              <el-input v-model="form.second_name_ru" autocomplete="off"></el-input>
            </el-form-item>
          </DropDownPanel>
        </el-input>
      </el-form-item>

      <el-form-item label="Фамилия и имя латинскими буквами">
        <el-input v-model="fioLat" autocomplete="off" class="um-form-dropdown-items">
          <DropDownPanel slot="prepend">
            <el-form-item label="Last Name">
              <el-input v-model="form.last_name_lat" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="First Name">
              <el-input v-model="form.first_name_lat" autocomplete="off"></el-input>
            </el-form-item>
          </DropDownPanel>
        </el-input>
      </el-form-item>

      <el-form-item label="Отображаемое имя">
        <el-select
          v-model="form.display_name"
          placeholder="Выбрать"
          allow-create
          filterable
          default-first-option
          class="full-line-select"
        >
          <el-option v-for="item in displayNameList" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Отдел">
        <el-select v-model="form.group_id" placeholder="Выбрать" filterable clearable class="full-line-select">
          <el-option v-for="item in groups" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Должность">
        <el-select v-model="form.job_title_id" placeholder="Выбрать" filterable clearable class="full-line-select">
          <el-option v-for="item in job_titles" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import DropDownPanel from '~/components/shared/_dropDownPanel.vue'
import Ava from '~/components/shared/_avatar.vue'
import { sharedMethods, formLockMethods } from '~/mixins/um-vue-shared-methods'
import { translitRusToZagran } from '~/utils/string-ext'

const emptyForm = {
  id: null,
  uid: '',
  email: '',
  display_name: '',
  first_name_lat: '',
  last_name_lat: '',
  first_name_ru: '',
  second_name_ru: '',
  last_name_ru: '',
  job_title_id: null,
  group_id: null,
}

export default {
  components: { DropDownPanel, Ava },

  mixins: [sharedMethods, formLockMethods],

  props: {
    entityModel: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    modified: { type: Boolean, default: false },
    data: { type: Object, default: emptyForm },
  },

  emits: ['form-save'],

  data() {
    return {
      formLoading: false,
      loadingImage: false,
      formModified: false,
      form: emptyForm,
      job_titles: [],
      groups: [],
      fioRu: '',
      fioLat: '',
      displayNameList: [],
    }
  },

  computed: {
    formDisabled() {
      return this.formLoading || (this.form.id && !this.isLocked)
    },
  },

  watch: {
    disabled(val) {
      this.formLoading = val
    },

    formDisabled(val) {
      this.$emit('update:disabled', val)
      if (val) {
        this.formModified = false
      }
    },

    modified(val) {
      this.formModified = val
    },

    formModified(val) {
      this.$emit('update:modified', val)
    },

    data(val) {
      this.form = Object.keys(val).length !== 0 ? { ...val } : { ...emptyForm }
    },

    form: {
      handler(val) {
        this.formModified = this.form.id ? this.isLocked : true
        this.lockId = val.id
        this.fioRu = `${val.last_name_ru ?? ''} ${val.first_name_ru ?? ''} ${val.second_name_ru ?? ''}`.trim()
        this.fioLat = translitRusToZagran(`${val.last_name_lat ?? ''} ${val.first_name_lat ?? ''}`.trim())
        // variants for display_name
        this.displayNameList = [
          ...new Set([
            `${val.first_name_ru ?? ''} ${val.last_name_ru ?? ''}`.trim(),
            `${val.last_name_ru ?? ''} ${val.first_name_ru ?? ''}`.trim(),
            `${val.last_name_ru ?? ''} ${val.first_name_ru ?? ''} ${val.second_name_ru ?? ''}`.trim(),
            `${val.first_name_lat ?? ''} ${val.last_name_lat ?? ''}`.trim(),
            `${val.last_name_lat ?? ''}, ${val.first_name_lat ?? ''}`.trim(),
          ]),
        ]
      },
      deep: true,
    },

    fioRu(val) {
      const ar = val.split(/[\s]+/)
      this.form.last_name_ru = ar[0] ?? ''
      this.form.first_name_ru = ar[1] ?? ''
      this.form.second_name_ru = ar[2] ?? ''
    },

    fioLat(val) {
      const ar = val.split(/[\s]+/)
      this.form.last_name_lat = ar[0] ?? ''
      this.form.first_name_lat = ar[1] ?? ''
    },
  },

  created() {
    this.$on('load', this.formLoad)
    this.$on('save', this.formSave)
  },

  methods: {
    handleAvatarSuccess(res, file) {
      this.form.photo = 'default/' + res
      this.loadingImage = false
    },

    beforeAvatarUpload(file) {
      if (file.type.substr(0, 6) !== 'image/') {
        this.$message.error('Допустимы только изображения!')
        return false
      }
      if (!(file.size / 1024 / 1024 < 2)) {
        this.$message.error('Максимальный размер изображения 2MB!')
        return false
      }
      this.loadingImage = true
      return true
    },

    formLoad() {
      this.fetchAllData()
      this.lockEntity(this.entityModel)
    },

    formSave() {
      // validate form
      if (!this.form.uid?.length) {
        this.errorMessage('UID не может быть пустым')
        return false
      }
      this.$refs.elForm.validate((valid) => {
        if (valid) {
          // emit event and data
          this.$emit('form-save', this.form)
        } else {
          this.errorMessage('Некорректные данные')
          return false
        }
      })
    },

    fetchAllData() {
      this.formLoading = true

      Promise.all([
        this.$portalApi.get('/um/job_titles').then((response) => {
          this.job_titles = response.data ?? []
          return Promise.resolve
        }),
        this.$portalApi.get('/um/groups').then((response) => {
          this.groups = response.data ?? []
          return Promise.resolve
        }),
      ])
        .then(() => {
          this.formLoading = false
        })
        .catch(this.axiosOnErrorShowMessage)
    },
  },
}
</script>
