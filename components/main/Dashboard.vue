<template>
  <div class="dashboard">
    <div class="dashboard__links">
      <draggable v-model="linksList" :move="checkLinkMove" @end="saveLinksSetup">
        <div
          v-for="linkItem in linksList"
          :key="linkItem.title"
          class="dashboard__links__item"
          :class="'-' + linkItem.icon"
          @click.prevent="openLink(linkItem.href)"
        >
          <img :src="linkIconSrc(linkItem)" class="link-icon" />
          <p>{{ linkItem.title }}</p>

          <el-dropdown v-if="!linkItem.uid" trigger="click" class="link-options">
            <div class="options-button" @click.stop></div>
            <el-dropdown-menu slot="dropdown">
              <a @click="editLink(linkItem)"> <el-dropdown-item>Изменить...</el-dropdown-item> </a>
              <a @click="deleteLink(linkItem)"> <el-dropdown-item>Удалить</el-dropdown-item> </a>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <div class="dashboard__links__item -app-add" @click="addLink">
          <img src="~/assets/images/icons/add.svg" alt="App add" />
        </div>
      </draggable>
    </div>

    <EditLinkDialog
      :title="linkDialogTitle"
      :visible.sync="addLinkDialogVisible"
      :data="formLink"
      class="edit-link-dialog"
      @form-save="saveLink"
    />

    <el-dialog
      title="Настройка отображения"
      :visible.sync="layoutSetupDialogVisible"
      :before-close="cancelCardsSetup"
      width="440px"
    >
      <draggable v-model="cardsList" ghost-class="ghost">
        <div v-for="card in cardsList" :key="card.uid" class="setup-card-item">
          <el-checkbox v-model="card.on" /> <span>{{ cardInfo(card.uid)?.name }}</span>
        </div>
      </draggable>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCardsSetup">Отмена</el-button>
        <el-button type="primary" @click="saveCardsSetup">Сохранить</el-button>
      </span>
    </el-dialog>

    <div class="card-container">
      <UniversalCard
        v-for="card in visibleCardsList"
        :key="card.uid"
        :uid="card.uid"
        :type="card.type"
        :name="card.name"
        :url="card.url"
        @hide-click="hideCard"
        @setup-click="layoutSetupDialogVisible = true"
      />

      <div class="card-wrapper--narrow" @click="layoutSetupDialogVisible = true">
        <img src="~/assets/images/icons/add.svg" alt="Card add" />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import { mapActions, mapState } from 'vuex'
import draggable from 'vuedraggable'
import EditLinkDialog from './EditLinkDialog.vue'
import UniversalCard from '~/components/cards/UniversalCard.vue'

const cardsConfiguration = {
  vp: { type: 'VPCard', name: 'Vacation Planner' },
  otm: { type: 'OTMCard', name: 'Office Time Manager' },
  supr: { type: '', name: 'SUPR' },
}

export default {
  name: 'DashboardComponent',

  components: { draggable, UniversalCard, EditLinkDialog },

  data() {
    return {
      linksList: [],
      addLinkDialogVisible: false,
      formLink: {},
      layoutSetupDialogVisible: false,
      cardsList: [],
    }
  },

  fetchOnServer: false,

  fetch() {
    this.$store.dispatch('dashboard/load')
  },

  computed: {
    ...mapState({
      error: (state) => state.dashboard.error,
      storedCards: (state) => state.dashboard.cards,
      storedLinks: (state) => state.dashboard.links,
    }),

    visibleCardsList() {
      return this.cardsList
        .filter((i) => i.on)
        .map((i) => {
          return { ...i, ...this.cardInfo(i.uid) }
        })
    },

    linkDialogTitle() {
      return this.formLink.title?.length ? 'Изменить ссылку' : 'Добавить ссылку'
    },
  },

  watch: {
    error(newMessage, oldMessage) {
      if (newMessage) {
        this.$message({
          message: `Не удалось загрузить карточки: ${newMessage}`,
          type: 'warning',
        })
      }
    },

    storedCards(val) {
      this.cloneCardsFrom(val)
    },

    storedLinks(val) {
      this.cloneLinksFrom(val)
    },
  },

  methods: {
    ...mapActions(['dashboard']),

    openLink(link) {
      window.open(link, '_blank')
    },

    checkLinkMove(evt) {
      return !!evt.draggedContext.element
    },

    isEqualLinks(l1, l2) {
      return l1?.title === l2?.title && l1?.href === l2?.href
    },

    linkIconSrc(linkItem) {
      return linkItem.img ?? ''
    },

    addLink() {
      this.formLink = {}
      this.addLinkDialogVisible = true
    },

    editLink(linkItem) {
      this.formLink = linkItem
      this.addLinkDialogVisible = true
    },

    deleteLink(linkItem) {
      this.linksList = this.linksList.filter((l) => !this.isEqualLinks(l, linkItem))
      this.$store.dispatch('dashboard/saveLinks', this.linksList)
    },

    saveLink(val) {
      this.addLinkDialogVisible = false
      if (this.formLink.title) {
        // find an index in array by formLink values
        this.linksList.forEach((l, i) => {
          if (this.isEqualLinks(l, this.formLink)) {
            this.linksList[i] = val
          }
        })
      } else {
        // push new value
        this.linksList.push(val)
      }
      this.$store.dispatch('dashboard/saveLinks', this.linksList)
    },

    cancelLinksSetup() {
      this.cloneLinksFrom(this.storedLinks)
    },

    saveLinksSetup() {
      this.$store.dispatch('dashboard/saveLinks', this.linksList)
    },

    cloneLinksFrom(val) {
      this.linksList = JSON.parse(JSON.stringify(val))
    },

    cloneCardsFrom(val) {
      this.cardsList = JSON.parse(JSON.stringify(val))
    },

    cardInfo(uid) {
      return { ...cardsConfiguration[uid], url: this.$config[uid + 'URL'] }
    },

    cancelCardsSetup() {
      this.cloneCardsFrom(this.storedCards)
      this.layoutSetupDialogVisible = false
    },

    saveCardsSetup() {
      this.$store.dispatch('dashboard/saveCards', this.cardsList)
      this.layoutSetupDialogVisible = false
    },

    hideCard(uid) {
      this.cardsList.forEach((v) => {
        if (v.uid === uid) v.on = false
      })
      this.$store.dispatch('dashboard/saveCards', this.cardsList)
    },
  },
}
</script>

<style lang="scss">
@import '~/assets/css/pages/dashboard';
</style>
