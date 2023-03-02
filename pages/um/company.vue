<template>
  <div class="um company">
    <div class="container">
      <h1 class="page-title">Компания</h1>

      <el-tabs type="card" @tab-click="tabClick">
        <el-tab-pane label="Сотрудники" class="active">
          <UserList :on-mounted-load="true" entity-model="users" roles-model="roles2users" />
        </el-tab-pane>

        <el-tab-pane label="Отделы">
          <DicEntityList entities-path="/um/groups" entity-path="/um/group" entity-model="groups" entity-name="отдел" />
        </el-tab-pane>

        <el-tab-pane v-if="isAdmin" label="Должности">
          <!-- prettier-ignore -->
          <DicEntityList entities-path="/um/job_titles" entity-path="/um/job_title" entity-model="job_titles" entity-name="должность" />
        </el-tab-pane>

        <el-tab-pane v-if="isAdmin" label="Роли">
          <!-- <DicEntityList entity-dialog="RoleDialog" entities-path="/um/roles" entity-path="/um/role" entity-name="роль" /> -->
          <RoleList entities-path="/um/roles" entity-path="/um/role" entity-model="roles" entity-name="роль" />
        </el-tab-pane>

        <el-tab-pane v-if="isAdmin" label="Синхронизация">
          <SyncUsers />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import UserList from '~/components/um/UserList.vue'
import DicEntityList from '~/components/um/DicEntityList.vue'
import RoleList from '~/components/um/RolesList.vue'
import SyncUsers from '~/components/um/SyncUsers.vue'
import { sharedMethods } from '~/mixins/um-vue-shared-methods'

export default {
  name: 'CompanyPage',
  components: { UserList, DicEntityList, RoleList, SyncUsers },
  mixins: [sharedMethods],
  layout: 'default',

  mounted() {
    this.fetchMyRoles()
    // this.testMyUser()
  },

  methods: {
    tabClick(tab) {
      tab.$emit('reload-list')
      tab.$parent.$children.forEach((e) => {
        e.$el.classList.remove('active')
      })
      setTimeout(() => {
        tab.$el.classList.add('active')
      }, 1)
    },

    testMyUser() {
      const myUID = this.loggedInUser.sub || this.loggedInUser.username
      // eslint-disable-next-line no-console
      console.log('My user UID:', myUID)
      this.$portalApi
        .get(`/um/me`)
        .then((response) => {
          // eslint-disable-next-line no-console
          console.log(response.data)
        })
        .catch(this.axiosOnErrorShowMessage)
      this.$portalApi
        .get(`/um/me/full`)
        .then((response) => {
          // eslint-disable-next-line no-console
          console.log('full user:', response.data)
        })
        .catch(this.axiosOnErrorShowMessage)
      this.$portalApi
        .get(`/um/me/roles`)
        .then((response) => {
          // eslint-disable-next-line no-console
          console.log('roles:', response.data)
        })
        .catch(this.axiosOnErrorShowMessage)
      this.$portalApi
        .get(`/um/user/uid/${myUID}/roles/full`)
        .then((response) => {
          // eslint-disable-next-line no-console
          console.log('roles full:', response.data)
        })
        .catch(this.axiosOnErrorShowMessage)
    },
  },
}
</script>

<style lang="scss">
@import '~/assets/css/pages/um';
</style>
