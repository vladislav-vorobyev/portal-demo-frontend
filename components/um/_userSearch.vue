<template>
  <div class="user-search-wrap">
    <el-input v-model="searchValue" placeholder="Поиск...">
      <el-button
        v-if="!isExtendedSearch"
        slot="append"
        title="Расширенный поиск"
        icon="el-icon-plus"
        @click="isExtendedSearch = true"
      />
      <el-button
        v-if="isExtendedSearch"
        slot="append"
        title="Скрыть расширенный поиск"
        icon="el-icon-minus"
        @click="isExtendedSearch = false"
      />
    </el-input>
    <div v-if="isExtendedSearch" class="extended-search-wrap">
      <el-select v-model="groupsSearch" multiple filterable placeholder="Отдел...">
        <el-option v-for="item in groupsList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
      </el-select>
      <el-select v-model="jobTitlesSearch" multiple filterable placeholder="Должность...">
        <el-option v-for="item in jobTitlesList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
      </el-select>
      <el-select v-model="rolesSearch" multiple filterable placeholder="Роль...">
        <el-option v-for="item in rolesList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import { sharedMethods } from '~/mixins/um-vue-shared-methods'

export default {
  mixins: [sharedMethods],

  props: {
    search: { type: String, required: true },
    groups: { type: Array, required: true },
    jobTitles: { type: Array, required: true },
    roles: { type: Array, required: true },
    extended: { type: Boolean, default: false },
  },

  emits: ['do-search'],

  data() {
    return {
      searchValue: '',
      groupsSearch: [],
      jobTitlesSearch: [],
      rolesSearch: [],
      isExtendedSearch: false,
      extLoading: false,
      groupsList: [],
      jobTitlesList: [],
      rolesList: [],
      entities: [],
    }
  },

  watch: {
    search(val) {
      this.searchValue = val
    },

    searchValue(val) {
      this.$emit('update:search', val)
      this.doSearch()
    },

    groups(val) {
      this.groupsSearch = val
    },

    groupsSearch(val) {
      this.$emit('update:groups', val)
      this.doSearch()
    },

    jobTitles(val) {
      this.jobTitlesSearch = val
    },

    jobTitlesSearch(val) {
      this.$emit('update:jobTitles', val)
      this.doSearch()
    },

    roles(val) {
      this.rolesSearch = val
    },

    rolesSearch(val) {
      this.$emit('update:roles', val)
      this.doSearch()
    },

    extended(val) {
      this.isExtendedSearch = val
    },

    isExtendedSearch(val) {
      this.$emit('update:extended', val)
      if (val) {
        this.fetchExtraData()
      } else {
        this.groupsSearch = []
        this.jobTitlesSearch = []
        this.rolesSearch = []
        this.doSearch()
      }
    },
  },

  created() {
    this.$parent.$on('reload-list', () => {
      this.fetchExtraData()
    })
  },

  methods: {
    doSearch() {
      setTimeout(() => {
        this.$emit('do-search')
      }, 0)
    },

    fetchExtraData() {
      if (this.isExtendedSearch) {
        this.extLoading = true

        Promise.all([
          this.$portalApi.get('/um/job_titles').then((response) => {
            this.jobTitlesList = response.data ?? []
            return Promise.resolve
          }),
          this.$portalApi.get('/um/groups').then((response) => {
            this.groupsList = response.data ?? []
            return Promise.resolve
          }),
          this.$portalApi.get('/um/roles').then((response) => {
            this.rolesList = response.data ?? []
            return Promise.resolve
          }),
        ])
          .then(() => {
            this.extLoading = false
          })
          .catch(this.axiosOnErrorShowMessage)
      }
    },
  },
}
</script>
