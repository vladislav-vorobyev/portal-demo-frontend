<template>
  <div class="article-cards-wrapper">
    <div v-for="set in articlesGrid" :key="set.i" class="article-cards-column">
      <ArticleCard v-for="article in set.articles" :key="article.id" :article="article.attributes" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ArticleCard from './ArticleCard.vue'

export default {
  name: 'ArticlesGrid',
  components: { ArticleCard },

  props: {
    articles: { type: Array, required: true },
    gridColumns: { type: Number, default: 1 },
  },

  computed: {
    ...mapGetters({
      pageWidth: 'window-size/width',
    }),

    columns() {
      if (process.client) {
        const width = Math.max(1, this.pageWidth - (200 + 60))
        const num = Math.floor(width / (236 + 20))
        // console.log('!width:', width, 'columns:', num)
        return num
      } else {
        return 1
      }
    },

    articlesGrid() {
      if (process.client) {
        const num = this.columns
        const arr = []
        for (let i = 0; i < num; i++) {
          arr.push({ i, articles: this.getColumnArticles(i) })
        }
        // console.log('!articlesGrid:', arr)
        return arr
      } else {
        return [{ i: 1, articles: this.articles }]
      }
    },
  },

  watch: {
    columns(val) {
      this.$emit('update:gridColumns', val)
    },
  },

  methods: {
    getColumnArticles(colNum = 0) {
      const num = this.columns
      const arr = []
      for (let i = colNum; i < this.articles.length; i = i + num) {
        arr.push(this.articles[i])
      }
      return arr
    },
  },
}
</script>
