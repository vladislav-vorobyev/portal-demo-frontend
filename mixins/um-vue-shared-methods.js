/**
 * UM vue components shared library
 */
const sharedMethods = {
  data() {
    return { myRoles: [] }
  },

  computed: {
    isAdmin() {
      const umAdminRoles = this.$config.umAdminRoles ?? []
      if (!Array.isArray(this.myRoles) || !Array.isArray(umAdminRoles)) return false
      return this.myRoles.some((r) => umAdminRoles.includes(r))
    },
  },

  methods: {
    fetchMyRoles() {
      this.$portalApi
        .get('/um/me/roles')
        .then((response) => {
          // console.log('my roles:', response.data)
          this.myRoles = response.data ?? []
        })
        // eslint-disable-next-line no-console
        .catch((err) => console.error(err))
    },

    /**
     * axios default error handler
     * @param {*} error catched
     */
    axiosOnErrorShowMessage(error) {
      if (error.response?.status === 404) {
        // Not Found
        this.errorMessage('Запись не найдена')
      } else if (error.response?.status === 409) {
        // object is already locked
        // eslint-disable-next-line no-console
        console.warn(error.response.data)
        this.errorMessage('Запись редактируется пользователем: ' + error.response.data?.user?.display_name)
      } else {
        // eslint-disable-next-line no-console
        console.warn(error.response || error)
        let message = error
        if (error.response?.data) {
          const data = error.response.data
          if (typeof data === 'object') {
            message = data.message || data.error || data
          } else {
            message = data
          }
        }
        this.errorMessage(message)
      }
    },

    errorMessage(message) {
      this.$message({
        showClose: true,
        message,
        type: 'error',
        duration: 5000,
      })
    },

    successMessage(message) {
      this.$message({
        showClose: true,
        message,
        type: 'success',
      })
    },
  },
}

/**
 * UM vue form component lock behavior
 */
const formLockMethods = {
  data() {
    return {
      lockId: null,
      lockName: '',
      isLocked: false,
      lockTimeoutTimer: null,
    }
  },

  created() {
    this.$on('close', this.unlockEntity)
    this.$on('update:visible', (val) => {
      if (!val) this.unlockEntity()
    })
  },

  methods: {
    lockEntity(name) {
      this.lockName = name
      setTimeout(this.doEntityLock, 0)
    },

    unlockEntity() {
      // console.log('unlock', this.lockName, this.lockId)
      if (this.lockId && this.lockName) {
        this.$portalApi
          .delete(`um/lock/${this.lockName}/${this.lockId}`)
          .then(() => {})
          .catch(this.axiosOnErrorShowMessage)
      }
      // this.lockId = null
      this.lockName = ''
      this.isLocked = false
      clearTimeout(this.lockTimeoutTimer)
    },

    doEntityLock() {
      // console.log('called doEntityLock:', this.lockName, this.lockId)
      if (this.lockId && this.lockName) {
        this.$portalApi
          .post(`um/lock/${this.lockName}/${this.lockId}`)
          .then(() => {
            this.isLocked = true
            // get delay from config and subtract 30 seconds but do not make less then 5
            const delay = Math.max(5, (this.$config.umLockEntityDelay ?? 600) - 30) * 1000
            this.lockTimeoutTimer = setTimeout(this.doEntityLock, delay) // update lock
          })
          .catch((error) => {
            this.isLocked = false
            this.axiosOnErrorShowMessage(error)
          })
      }
    },
  },
}

/**
 * UM vue list component shared library
 */
const listMethods = {
  props: {
    onMountedLoad: { type: Boolean, default: false },
  },

  created() {
    this.$parent.$on('reload-list', () => {
      this.fetchMyRoles()
      this.fetchEntities()
    })
  },

  mounted() {
    if (this.onMountedLoad) {
      this.$parent.$emit('reload-list')
    }
  },

  methods: {
    fetchEntities() {
      this.loading = true
      this.$portalApi
        .get(this.entitiesPath)
        .then((response) => {
          this.entities = response.data ?? []
        })
        .catch(this.axiosOnErrorShowMessage)
        .finally(() => (this.loading = false))
    },

    fetchEntity(id, callback) {
      this.loading = true
      this.$portalApi
        .get(`${this.entityPath}/${id}`)
        .then((response) => {
          callback(response.data)
        })
        .catch(this.axiosOnErrorShowMessage)
        .finally(() => (this.loading = false))
    },

    newEntity(body) {
      this.loading = true
      this.$portalApi
        .put(this.entityPath, body)
        .then(() => {
          this.successMessage('Добавлено успешно.')
          setTimeout(this.fetchEntities, 0)
        })
        .catch(this.axiosOnErrorShowMessage)
        .finally(() => (this.loading = false))
    },

    updateEntityPromise(id, body) {
      this.loading = true
      return this.$portalApi
        .put(`${this.entityPath}/${id}`, body)
        .then((result) => {
          this.successMessage('Сохранено успешно.')
          setTimeout(this.fetchEntities, 0)
          return Promise.resolve(result)
        })
        .catch((err) => {
          this.axiosOnErrorShowMessage(err)
          return Promise.reject(err)
        })
        .finally(() => (this.loading = false))
    },

    updateEntity(id, body) {
      this.updateEntityPromise(id, body)
        .then(() => {})
        .catch(() => {})
    },

    deleteEntity(id) {
      this.loading = true
      this.$portalApi
        .delete(`${this.entityPath}/${id}`)
        .then(() => {
          this.successMessage('Удалено успешно.')
          setTimeout(this.fetchEntities, 0)
        })
        .catch(this.axiosOnErrorShowMessage)
        .finally(() => (this.loading = false))
    },
  },
}

module.exports = { sharedMethods, formLockMethods, listMethods }
