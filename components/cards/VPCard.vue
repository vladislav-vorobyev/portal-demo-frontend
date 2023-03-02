<template>
  <div class="card-body">
    <div class="card-body__left-side__top"></div>
    <div class="card-body__left-side__bottom">
      <div class="notification-number">{{ closestVacationDaysRemain }}</div>
      <div class="notification-text">
        <p class="row">дней</p>
        <p class="row">до отпуска</p>
        <p class="status">{{ closestVacationStatus }}</p>
      </div>
    </div>
    <div class="card-body__content" :class="{ '-empty': myVacations.length === 0 }">
      <div class="card-body__content__title">
        <span v-if="myVacations.length === 0">У Вас пока нет запланированных отпусков</span>
        <span v-else>Ближайшие отпуска:</span>
      </div>
      <div v-for="(vacation, index) in myVacations" :key="index">
        {{ formatDate(vacation.StartDate) }} - {{ formatDate(vacation.EndDate) }} ({{ vacation.Duration }} дней)
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

moment.locale('ru')

const VP = {
  Status: {
    ACCEPTED_BY_LEADER: 'Утверждено руководителем',
    ACCEPTED_BY_DIRECTOR: 'Утверждено ген. директором',
    ACCEPTED_BY_ACCOUNTANT: 'Утверждено гл. бухгалтером',
    ACCEPTED_BY_ACCOUNTANT_AS_LEADER: 'Утверждено гл. бухгалтером как руководителем',
    REFUSED_BY_LEADER: 'Отклонено руководителем',
    REFUSED_BY_DIRECTOR: 'Отклонено ген. директором',
    REFUSED_BY_ACCOUNTANT: 'Отклонено гл. бухгалтером',
    CONSIDERED: 'Рассматривается',
    CANCELLED: 'Отменено пользователем',
    MOVED: 'Перенесено',
    IN_VACATION: 'В отпуске',
    DONE: 'Использован',
    WRONG: 'fallback',
  },
  wrongStatus: ['WRONG', 'DONE', 'CANCELLED'],
}
const maxItems = 3

export default {
  name: 'VPCard',

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
    myVacations() {
      const vacations = []
      if (this.content?.Result) {
        this.content.Result.forEach((obj) => {
          obj.Vacations.forEach((vacation) => {
            vacation.diffDays = moment(vacation.StartDate, 'DDMMYYYY').diff(moment().startOf('day'), 'days')
            if (vacation.diffDays >= 0 && !VP.wrongStatus.includes(vacation.Status)) {
              vacations.push(vacation)
            }
          })
        })
      }
      return vacations.slice(0, maxItems)
    },

    closestVacationDaysRemain() {
      return this.myVacations.length ? this.myVacations[0].diffDays : '?'
    },

    closestVacationStatus() {
      return this.myVacations.length ? VP.Status[this.myVacations[0].Status] : ''
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
    this.loadContent()
  },

  methods: {
    formatDate(stringDate) {
      return moment(stringDate, 'DDMMYYYY').format('D MMM YY')
    },

    loadContent() {
      this.contentLoading = true
      this.$store.$portalApi
        .get('/ext/vacation?My=true') // TODO: move to config
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
