<template>
  <div class="articles">
    <div class="container">
      <div class="articles-list-header">
        <h1 class="page-title">Новости компании</h1>
      </div>
      <ClientOnly fallback-tag="span" fallback="Загрузка новостей...">
        <ArticlesGrid :articles="articles" :grid-columns.sync="columns" />
      </ClientOnly>
    </div>
  </div>
</template>

<script>
import ArticlesGrid from '~/components/articles/ArticlesGrid.vue'

export default {
  name: 'NewsPage',
  components: { ArticlesGrid },

  data() {
    return {
      articles: [],
      error: null,
      loading: false,
      pageSize: 10,
      page: 1,
      pageCount: 1,
      columns: 1,
      scrollObserver: null,
    }
  },

  watch: {
    error(val) {
      this.$message({
        message: val,
        type: 'error',
      })
    },

    loading(val) {
      if (!val) {
        this.$emit('loaded')
      }
    },
  },

  mounted() {
    // infinite scroll behavior
    if (!this.scrollObserver) {
      this.scrollObserver = new IntersectionObserver(this.intersected, {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      })
    }
    // load articles
    this.fetchPage()
  },

  methods: {
    intersected(entries) {
      entries.forEach((entry) => {
        // console.log('!inter', entry)
        if (entry.isIntersecting) {
          // console.log('!intersected')
          this.scrollObserver.unobserve(entry.target)
          this.loadNext()
        }
      })
    },

    loadNext() {
      if (this.page < this.pageCount) {
        if (!this.loading) {
          this.$off('loaded', this.loadNext)
          this.page += 1
          this.fetchPage()
        } else {
          this.$on('loaded', this.loadNext)
        }
      }
    },

    async fetchPage() {
      // console.log('!fetch:', this.page, this.pageCount)
      this.loading = true
      try {
        const params = {
          populate: 'image',
          'pagination[page]': this.page,
          'pagination[pageSize]': this.pageSize,
        }
        const response = await this.$portalApi.$get('/api/articles', { params })
        const { data, meta } = response
        const articles = data.map((article) => {
          article.attributes.id = article.id
          return article
        })
        this.page = meta?.pagination?.page ?? 1
        this.pageCount = meta?.pagination?.pageCount ?? 1
        if (this.page === 1) {
          this.articles = articles
        } else {
          this.articles.push(...articles)
        }
        if (this.articles.length) {
          // infinite scroll behavior
          const targetIndex = Math.max(0, this.articles.length - this.columns - 1)
          const targetId = this.articles[targetIndex].id
          // console.log('target:', targetId, targetIndex, this.articles[targetIndex])
          if (targetId) {
            let repeatTimes = 100
            const setObserver = () => {
              const target = document.querySelector('#article-' + targetId)
              // console.log('target:', targetId, target)
              if (target) {
                this.scrollObserver.observe(target)
              } else if (repeatTimes) {
                repeatTimes--
                setTimeout(setObserver, 100)
              } else {
                // eslint-disable-next-line no-console
                console.error('Target to observe is not found, Id:', targetId)
              }
            }
            setTimeout(setObserver, 1)
          }
        }
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss">
@import '~/assets/css/pages/articles.scss';
</style>
