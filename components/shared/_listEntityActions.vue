<template>
  <div class="list-entity-actions">
    <el-button
      :title="`Редактировать ${entityName}`"
      icon="el-icon-edit"
      circle
      @click="$emit('edit-click', id)"
    ></el-button>

    <el-popconfirm
      :title="`Удалить ${entityName}?`"
      confirm-button-text="Да"
      cancel-button-text="Нет"
      @confirm="$emit('delete-click', id)"
    >
      <el-button slot="reference" :title="`Удалить ${entityName}`" icon="el-icon-delete" circle></el-button>
    </el-popconfirm>
  </div>
</template>

<script>
export default {
  props: {
    entityName: { type: String, required: true },
    id: { type: Number, required: true },
  },

  emits: ['edit-click', 'delete-click'],
}
</script>
