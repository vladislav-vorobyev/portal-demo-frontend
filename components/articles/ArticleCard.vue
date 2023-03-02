<template>
  <el-card :id="'article-' + article.id" shadow="never" class="article-card">
    <div v-if="article.image.data" class="card-top-image">
      <NuxtLink :to="`/articles/${article.slug}`">
        <img :src="articleImage" class="article-image-preview" />
      </NuxtLink>
    </div>
    <div v-else class="card-top-image empty"></div>
    <div class="article-card-info-wrap">
      <NuxtLink :to="`/articles/${article.slug}`">
        <div class="article-title">{{ article.title }}</div>
      </NuxtLink>
      <div class="article-info-footer">
        <div class="article-date">{{ createdAt }}</div>
        <div class="article-author">{{ article.author }}</div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'ArticleCard',
  props: {
    article: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    articleImage() {
      return this.$config.strapiURL + this.article.image.data?.attributes?.formats?.small?.url
    },
    createdAt() {
      return this.article.createdAt
    },
  },
}
</script>
