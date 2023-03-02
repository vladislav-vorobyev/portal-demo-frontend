<template>
  <EntityDialog
    :title="title"
    :visible.sync="formVisible"
    :form-disabled="formDisabled"
    :modified="formModified"
    @form-save="formSave"
  >
    <el-form :model="form" :disabled="formDisabled" label-position="top">
      <el-form-item label="ID">
        <el-input v-model="slug" :placeholder="form.slug" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Имя" required>
        <el-input ref="nameInput" v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item>
        <el-checkbox v-model="form.default" autocomplete="off">Использовать по умолчанию</el-checkbox>
      </el-form-item>
    </el-form>
  </EntityDialog>
</template>

<script>
import DicEntityDialog from './DicEntityDialog.vue'

export default {
  mixins: [DicEntityDialog],
}
</script>
