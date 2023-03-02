<template>
  <div class="um-list-wrap user-list-wrap">
    <!-- search wrap -->
    <el-row>
      <UserSearch
        :search.sync="search"
        :groups.sync="groupsSearch"
        :job-titles.sync="jobTitlesSearch"
        :roles.sync="rolesSearch"
        :extended.sync="isExtendedSearch"
        @do-search="doSearch"
      />
    </el-row>

    <!-- entities list wrap -->
    <el-row v-loading="loading" class="entities-list-box" :class="{ 'extended-search': isExtendedSearch }">
      <el-table
        v-infinite-scroll="load"
        :data="entities"
        class="entities-list"
        row-class-name="clickable-row"
        @row-click="rowClick"
        @row-dblclick="rowDblClick"
        @sort-change="sortChange"
      >
        <el-table-column prop="display_name" label="Имя" sortable="custom" />
        <el-table-column prop="email" label="Почта" sortable="custom" />
        <el-table-column prop="job_title_name" label="Должность" sortable="custom" />

        <el-table-column v-if="isAdmin" width="160" class-name="actions">
          <div slot-scope="scope">
            <el-button title="Список ролей" icon="el-icon-user" circle @click="editRoles(scope.row.id)"></el-button>

            <ListEntityActions
              :id="scope.row.id"
              entity-name="запись"
              @edit-click="entityEdit"
              @delete-click="entityDelete"
            />
          </div>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- total -->
    <el-row>
      <span class="total-count"> Всего {{ totalCount }} </span>
    </el-row>

    <!-- dialogs -->
    <EntityDialog
      title=""
      :visible.sync="userFormVisible"
      :form-disabled="userFormDisabled"
      :modified="userFormModified"
      @form-save="formClickSave"
    >
      <UserForm
        ref="userForm"
        :entity-model="entityModel"
        :disabled.sync="userFormDisabled"
        :modified.sync="userFormModified"
        :data="form"
        @form-save="formSave"
      />
    </EntityDialog>

    <el-dialog title="" :visible.sync="infoVisible" class="entity-dialog view-dialog">
      <UserInfo ref="userInfo" :data="info" />
    </el-dialog>

    <UserRolesDialog :entity-model="rolesModel" :visible.sync="rolesVisible" :data="form" @form-save="rolesSave" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserSearch from './_userSearch.vue'
import UserForm from './UserForm.vue'
import UserInfo from './UserInfo.vue'
import UserRolesDialog from './UserRolesDialog.vue'
import EntityDialog from '~/components/shared/_entityDialog.vue'
import ListEntityActions from '~/components/shared/_listEntityActions.vue'
import { sharedMethods, listMethods } from '~/mixins/um-vue-shared-methods'

export default {
  components: { UserSearch, ListEntityActions, UserForm, UserInfo, UserRolesDialog, EntityDialog },

  mixins: [sharedMethods, listMethods],

  props: {
    entityModel: { type: String, required: true },
    rolesModel: { type: String, required: true },
  },

  data() {
    return {
      loading: false,
      search: '',
      isExtendedSearch: false,
      groupsSearch: [],
      jobTitlesSearch: [],
      rolesSearch: [],
      entities: [],
      entitiesPath: '/um/users',
      entityPath: '/um/user',
      form: null,
      userFormDisabled: false,
      userFormVisible: false,
      userFormModified: false,
      info: null,
      infoVisible: false,
      rolesVisible: false,
      totalCount: 0,
      currentPage: 1,
      lastPage: 1,
      pageSize: 10,
      sortBy: '',
    }
  },

  computed: {
    ...mapGetters({
      pageHeight: 'window-size/height',
    }),
  },

  watch: {
    userFormVisible(val) {
      if (!val) {
        this.$refs.userForm.$emit('close')
        setTimeout(() => {
          this.form = {}
        }, 200)
      }
    },

    infoVisible(val) {
      if (!val) {
        this.$refs.userInfo.$emit('close')
        setTimeout(() => {
          this.info = {}
        }, 200)
      }
    },

    pageHeight() {
      this.handleResize()
    },
  },

  created() {
    this.$parent.$on('reload-list', () => {
      this.$emit('reload-list')
    })
  },

  methods: {
    calcPageSize() {
      return window ? Math.max(10, Math.floor((this.pageHeight - 360) / 40)) : 10
    },

    handleResize() {
      if (this.pageSize < this.calcPageSize()) {
        this.currentPage = 1
        this.fetchEntities()
      }
    },

    /*
     * Search functions
     */

    doSearch() {
      this.currentPage = 1
      this.fetchEntities()
    },

    /*
     * Table behavior functions
     */

    load() {
      if (!this.loading && this.currentPage < this.lastPage) {
        this.currentPage += 1
        this.fetchEntities()
      }
    },

    sortChange(args) {
      const { prop, order } = args // { column, prop, ascending|descending|null }
      this.sortBy = order ? prop + ' ' + (order === 'ascending' ? 'asc' : 'desc') : ''
      this.currentPage = 1
      this.fetchEntities()
    },

    rowClick(row, column) {
      if (column.property) {
        if (this.isAdmin) this.entityEdit(row.id)
        else this.entityView(row.id)
      }
    },

    rowDblClick(row, column) {
      this.entityView(row.id)
    },

    entityView(id) {
      this.fetchFullUser(id, (data) => {
        // console.log('view', data)
        this.infoVisible = true
        setTimeout(() => {
          this.info = data
        }, 0)
      })
    },

    entityEdit(id) {
      this.fetchEntity(id, (data) => {
        // console.log('edit', data)
        this.userFormVisible = true
        setTimeout(() => {
          this.form = data
          this.$refs.userForm.$emit('load')
        }, 0)
      })
    },

    entityDelete(id) {
      // console.log('delete', id)
      this.deleteEntity(id)
    },

    editRoles(id) {
      this.fetchEntity(id, (data) => {
        // console.log('data', data)
        this.form = data
        this.rolesVisible = true
      })
    },

    /*
     * Dialogs functions
     */

    formClickSave() {
      this.$refs.userForm.$emit('save')
    },

    formSave(data) {
      this.userFormVisible = false
      // console.log('save', data)
      // this.form = { ...data }
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

    rolesSave(id, userRoles) {
      // console.log('save', id, userRoles)
      if (id) {
        this.updateUserRoles(id, userRoles)
      }
    },

    /*
     * Requests to backend
     */

    fetchEntities() {
      // check page size
      if (this.currentPage === 1) {
        this.pageSize = this.calcPageSize()
      }
      // prepare request params
      const params = {}
      if (this.sortBy) params.orderby = this.sortBy
      if (this.search) params.s = this.search
      if (this.groupsSearch.length) params.groups = this.groupsSearch.join(',')
      if (this.jobTitlesSearch.length) params.job_titles = this.jobTitlesSearch.join(',')
      if (this.rolesSearch.length) params.roles = this.rolesSearch.join(',')
      this.loading = true
      this.$portalApi
        .get(`${this.entitiesPath}/${this.currentPage}/${this.pageSize}`, { params })
        .then((response) => {
          if (response.data?.current_page) {
            // console.log(response.data)
            this.totalCount = response.data.total ?? 0
            this.currentPage = response.data.current_page ?? 1
            this.lastPage = response.data.last_page ?? 1
            // correcting current page if over last
            if (response.data?.last_page && response.data?.last_page < this.currentPage) {
              this.currentPage = 1
              setTimeout(this.fetchEntities, 0)
            } else {
              // update table data
              // eslint-disable-next-line no-lonely-if
              if (this.currentPage === 1) {
                this.entities = response.data.data ?? []
              } else if (response.data.data?.length) {
                this.entities.push(...response.data.data)
              }
            }
          } else {
            this.errorMessage('Ошибка ответа от сервера')
            // eslint-disable-next-line no-console
            console.warn('No data in response:', response)
          }
        })
        .catch(this.axiosOnErrorShowMessage)
        .finally(() => (this.loading = false))
    },

    updateUserRoles(id, body) {
      this.$portalApi
        .put(`/um/user/${id}/roles`, body)
        .then(() => {
          this.successMessage('Роли обновлены успешно.')
        })
        .catch(this.axiosOnErrorShowMessage)
    },

    fetchFullUser(id, callback) {
      this.$portalApi
        .get(`/um/user/${id}/full`)
        .then((response) => {
          callback(response.data)
        })
        .catch(this.axiosOnErrorShowMessage)
    },
  },
}
</script>
