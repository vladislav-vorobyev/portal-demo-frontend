<template>
  <div class="card-body">
    <div class="card-body__left-side__top" style="font-size: 10px; color: #8f94a4">Рабочий период две недели</div>
    <div class="card-body__left-side__bottom">
      <div class="notification-number" :class="{ 's-red': red, 's-green': green }">
        <span>{{ absHours }}</span>
      </div>
      <div class="notification-text">
        <p class="row">часов</p>
        <p class="row">
          <span v-if="over">переработки</span>
          <span v-else>недоработки</span>
        </p>
      </div>
    </div>
    <div class="card-body__content" :class="{ '-empty': empty }">
      <div class="card-body__content__title">
        <span v-if="shouldNote">
          <span v-if="over">
            За последние две недели Вы хорошо потрудились - Вам следует немного отдохнуть. Согласуйте с руководителем
            отгул на {{ absHours }} часов.
          </span>
          <span v-if="under">
            Недоработки за последние две недели составляют {{ absHours }} часов. Обратите на это внимание и попытайтесь
            скорректировать Ваше рабочее расписание на следующей неделе.
          </span>
        </span>
        <span v-else> Ваша загрузка в последние две недели в пределах нормы - продолжайте в том же духе! </span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

moment.locale('ru')

export default {
  name: 'OTMCard',

  props: {
    loading: { type: Boolean, required: true },
  },

  data() {
    return {
      content: null,
      contentLoading: false,
    }
  },

  computed: {
    empty() {
      return this.content === undefined || this.content === null
    },
    hours() {
      if (this.empty) return 0
      const h = this.content.overworkingHours
      // console.log('h ' + h)
      if (h === undefined || h === null) return 0
      return h
    },
    absHours() {
      const h = this.hours
      if (h < 0) return -h
      return h
    },
    over() {
      const h = this.hours
      // console.log('h>0 ' + h > 0)
      return h > 0
    },
    under() {
      const h = this.hours
      // console.log('h<0 ' + h < 0)
      return h < 0
    },
    shouldNote() {
      // console.log('this.absHours>8 ' + this.absHours > 8)
      return this.absHours > 8
    },
    red() {
      // console.log('this.shouldNote && this.under ' + this.shouldNote && this.under)
      return this.shouldNote && this.under
    },
    green() {
      // console.log('this.shouldNote && this.over ' + this.shouldNote && this.over)
      return this.shouldNote && this.over
    },
  },

  watch: {
    loading(val) {
      this.contentLoading = val
    },
    contentLoading(val) {
      this.$emit('update:loading', val)
    },
  },

  mounted() {
    const tonow = moment(new Date()).format('YYYY/MM/DD')
    this.loadContent('/journal/my/' + tonow + '/minus/14')
  },

  methods: {
    loadContent(path) {
      this.contentLoading = true
      this.$store.$portalApi
        .get(path)
        .then((response) => {
          this.content = response.data
        })
        .catch((error) => {
          this.content = error
        })
        .finally(() => (this.contentLoading = false))
    },
  },
}
</script>
