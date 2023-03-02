<template>
  <div class="sync-users-wrap" style="padding: 30px 0">
    <el-row>
      <el-button type="primary" :disabled="loading" @click="syncUsers">Обновить сотрудников из LDAP</el-button>
    </el-row>
  </div>
</template>

<script>
/**
 * UM Users Sycronyze panel
 */

import { sharedMethods } from '~/mixins/um-vue-shared-methods'

export default {
  mixins: [sharedMethods],

  data() {
    return {
      loading: false,
    }
  },

  watch: {},

  methods: {
    syncUsers() {
      this.$confirm('Данные сотрудников могут быть перезаписанны. Продолжить?', 'Обновить из LDAP', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Нет',
        type: 'question',
      })
        .then(() => {
          this.loading = true
          this.$portalApi
            .get('/um/sync/users')
            .then(() => {
              this.successMessage('Обновлено успешно.')
              // setTimeout(this.fetchEntities, 0)
            })
            .catch(this.axiosOnErrorShowMessage)
            .finally(() => (this.loading = false))
        })
        .catch(() => {})
    },
  },
}
</script>
