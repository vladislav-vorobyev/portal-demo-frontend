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

        <el-table-column label="Умолч." align="center" width="100">
          <template slot-scope="scope">
            <i v-if="scope.row.default" class="el-icon-check"></i>
          </template>
        </el-table-column>

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

    <RoleDialog
      :entity-model="entityModel"
      :title="formTitle"
      :visible.sync="formVisible"
      :data="form"
      @form-save="formSave"
    />
  </div>
</template>

<script>
import DicEntityList from './DicEntityList.vue'
import RoleDialog from './RoleDialog.vue'

export default {
  components: { RoleDialog },
  mixins: [DicEntityList],
}
</script>
