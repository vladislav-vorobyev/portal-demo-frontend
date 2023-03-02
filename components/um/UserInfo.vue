<template>
  <div class="view-info user-wrap">
    <el-form ref="elForm" :model="form" :disabled="true" label-position="top">
      <el-form-item class="avatar-wrap avatar-140">
        <Ava :user-id="form.id" :photo-src="form.photo" />
      </el-form-item>
      <el-form-item label="UID">
        <el-input v-model="form.uid" disabled />
      </el-form-item>
      <el-form-item prop="email" label="Корпоративная почта (email)">
        <el-input v-model="form.email" disabled />
      </el-form-item>
      <el-form-item label="ФИО">
        <el-input v-model="fioRu" disabled />
      </el-form-item>
      <el-form-item label="Фамилия и имя латинскими буквами">
        <el-input v-model="fioLat" disabled />
      </el-form-item>
      <el-form-item label="Отображаемое имя">
        <el-input v-model="form.display_name" disabled />
      </el-form-item>
      <el-form-item label="Отдел">
        <el-input v-model="form.group_name" disabled />
      </el-form-item>
      <el-form-item label="Должность">
        <el-input v-model="form.job_title_name" disabled />
      </el-form-item>
      <!-- <el-form-item label="Роли">
        <el-input v-model="roles" disabled />
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import Ava from '~/components/shared/_avatar.vue'

const emptyForm = {
  uid: '',
  email: '',
  display_name: '',
  first_name_lat: '',
  last_name_lat: '',
  first_name_ru: '',
  second_name_ru: '',
  last_name_ru: '',
  job_title_name: '',
  group_name: '',
}

export default {
  components: { Ava },

  props: {
    data: { type: Object, default: emptyForm },
  },

  data() {
    return {
      form: emptyForm,
      fioRu: '',
      fioLat: '',
      roles: '',
    }
  },

  watch: {
    data(val) {
      this.form = Object.keys(val).length !== 0 ? { ...val } : { ...emptyForm }
      this.fioRu = `${val.last_name_ru ?? ''} ${val.first_name_ru ?? ''} ${val.second_name_ru ?? ''}`.trim()
      this.fioLat = `${val.last_name_lat ?? ''} ${val.first_name_lat ?? ''}`.trim()
      this.roles = val.roles?.join(', ')
    },
  },
}
</script>
