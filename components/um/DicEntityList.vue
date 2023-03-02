<template>
  <div class="um-list-wrap dic-page-wrap">
    <el-row>
      <el-input v-model="search" placeholder="Поиск..."></el-input>
    </el-row>
    <el-row class="entities-list-box">
      <el-table
        v-loading="loading"
        :data="filteredEntities"
        class="entities-list"
        :row-class-name="rowClass"
        @row-click="rowClick"
      >
        <el-table-column prop="slug" label="ID" sortable> </el-table-column>
        <el-table-column prop="name" label="Имя" sortable> </el-table-column>
        <el-table-column v-if="isAdmin" width="120" class-name="actions">
          <ListEntityActions
            :id="scope.row.id"
            slot-scope="scope"
            :entity-name="entityName"
            @edit-click="entityEdit"
            @delete-click="entityDelete"
          />
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-button v-if="isAdmin" type="primary" @click="entityAdd">Добавить {{ entityName }}</el-button>
    </el-row>

    <component
      :is="entityDialog"
      :entity-model="entityModel"
      :title="formTitle"
      :visible.sync="formVisible"
      :data="form"
      @form-save="formSave"
    />
  </div>
</template>

<script>
import DicEntityDialog from './DicEntityDialog.vue'
import RoleDialog from './RoleDialog.vue'
import ListEntityActions from '~/components/shared/_listEntityActions.vue'
import { matchedName, capitalizeFirstLetter } from '~/utils/string-ext'
import { sharedMethods, listMethods } from '~/mixins/um-vue-shared-methods'

export default {
  components: { ListEntityActions, DicEntityDialog, RoleDialog },

  mixins: [sharedMethods, listMethods],

  props: {
    entityDialog: { type: String, default: 'DicEntityDialog' },
    entitiesPath: { type: String, required: true },
    entityPath: { type: String, required: true },
    entityModel: { type: String, required: true },
    entityName: { type: String, required: true },
  },

  data() {
    return {
      loading: false,
      search: '',
      entities: [],
      form: null,
      formVisible: false,
    }
  },

  computed: {
    filteredEntities() {
      return this.entities.filter((v) => matchedName(v.name, this.search) || matchedName(v.slug, this.search))
    },

    formTitle() {
      return capitalizeFirstLetter(this.entityName)
    },

    rowClass() {
      return this.isAdmin ? 'clickable-row' : ''
    },
  },

  methods: {
    rowClick(row, column) {
      // console.log(row, column)
      if (column.property && this.isAdmin) {
        this.entityEdit(row.id)
      }
    },

    entityAdd() {
      this.form = {}
      this.formVisible = true
    },

    entityEdit(id) {
      this.fetchEntity(id, (data) => {
        // console.log('edit', data)
        this.formVisible = true
        setTimeout(() => {
          this.form = data
        }, 0)
      })
    },

    entityDelete(id) {
      // console.log('delete', id)
      this.deleteEntity(id)
    },

    formSave(data) {
      // console.log('save', data)
      this.form = { ...data }
      if (this.form.id) {
        this.updateEntity(this.form.id, this.form)
      } else {
        this.newEntity(this.form)
      }
    },
  },
}
</script>
