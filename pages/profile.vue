<template>
  <div class="profile">
    <div class="container">
      <div class="main-box">
        <div class="side-menu"></div>

        <div class="tab-wrap">
          <div class="tab-title"><span>Настройки профиля</span></div>
          <div class="tab-content um">
            <UserForm
              ref="userForm"
              entity-model="users"
              :disabled.sync="formDisabled"
              :modified.sync="formModified"
              :data="form"
              @form-save="formSave"
            />

            <div class="tab-footer">
              <el-button @click="formCancel">Отмена</el-button>
              <el-button type="primary" :disabled="formDisabled" @click="formClickSave">Сохранить</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserForm from '~/components/um/UserForm.vue'
import { sharedMethods, listMethods } from '~/mixins/um-vue-shared-methods'

export default {
  name: 'ProfilePage',

  components: { UserForm },

  mixins: [sharedMethods, listMethods],

  beforeRouteLeave(to, from, next) {
    // console.log('beforeRouteLeave', this.$route, from)
    if (this.formModified) {
      this.$confirm('Данные были изменены. Закрыть без сохранения?', 'Предупреждение', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Нет',
        type: 'warning',
      })
        .then(() => {
          // leave
          this.$refs.userForm.$emit('close')
          next()
        })
        .catch(() => {})
    } else {
      // leave
      this.$refs.userForm.$emit('close')
      next()
    }
  },

  data() {
    return {
      loading: false,
      entityPath: '/um/user',
      form: null,
      formDisabled: false,
      formModified: false,
    }
  },

  computed: {
    ...mapGetters(['loggedInUser']),
  },

  mounted() {
    this.initData()
  },

  methods: {
    initData() {
      if (this.$myUserData.id) {
        this.dataLoad()
      } else {
        this.formDisabled = true
        setTimeout(this.initData, 500)
      }
    },

    dataLoad() {
      this.formDisabled = true
      this.fetchEntity(this.$myUserData.id, (data) => {
        // console.log('edit', data)
        this.formDisabled = false
        this.form = data
        this.$refs.userForm.$emit('load')
        setTimeout(() => {
          this.formModified = false
        }, 1)
      })
    },

    formCancel() {
      this.dataLoad()
    },

    formClickSave() {
      this.$refs.userForm.$emit('save')
    },

    formSave(data) {
      this.formVisible = false
      // console.log('save', data)
      if (data.id) {
        this.updateEntityPromise(data.id, data)
          .then(() => {
            if (data.id === this.$myUserData.id) {
              this.$myUserData.set(data)
            }
          })
          .catch(() => {})
      } else {
        this.newEntity(data)
      }
    },
  },
}
</script>

<style lang="scss">
@import '~/assets/css/pages/profile';
</style>
