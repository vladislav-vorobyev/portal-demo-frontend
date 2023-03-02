<template>
  <div class="article">
    <div class="container">
      <div class="article-container-wrap">
        <div class="article-container">
          <div class="article-image">
            <img :src="article.image" />
          </div>
          <div class="article-title">
            <span>{{ article.title }}</span>
          </div>
          <div class="article-date" :title="createdDate + ' ' + createdTime">{{ createdDate }}</div>
          <div class="article-content">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="article-description" v-html="article.description" />
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="article.content" />
          </div>
        </div>
      </div>
      <div class="article-info">
        <div class="article-authors">
          <div class="info-title">Авторы</div>
          <div class="article-author">
            <div class="avatar"></div>
            <span>{{ article.author }}</span>
          </div>
        </div>
        <div class="navigation">
          <NuxtLink to="/articles"><span class="back-button">← Все новости</span></NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticlePage',
  async asyncData({ params, $portalApi, $getConfig }) {
    try {
      const response = await $portalApi.get(`/api/articles?filters[slug]=${params.slug}&populate=image`)
      const formats = response.data.data[0].attributes.image.data.attributes.formats
      const image = $getConfig().strapiURL + (formats.large?.url ?? formats.medium?.url ?? formats.small?.url)
      const article = response.data.data[0].attributes
      article.image = image
      return { article }
    } catch (error) {
      return { error }
    }
  },
  data() {
    return {
      article: {
        title: '',
        image: '',
        content: '',
      },
    }
  },
  computed: {
    createdDate() {
      return this.article.createdAt // TODO: get date part
    },
    createdTime() {
      return this.article.createdAt // TODO: get time part
    },
  },
}
</script>

<style lang="scss">
@import './assets/css/pages/articles.scss';
</style>
