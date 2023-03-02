<template>
  <header class="header">
    <NuxtLink to="/">
      <img alt="Portal D" class="logotype" />
    </NuxtLink>
    <div class="header__container">
      <form class="header__container__search">
        <input
          id="headerSearchBarInput"
          ref="headerSearchBarInput"
          v-model.trim="inputText"
          class="search__input"
          type="search"
          autocomplete="off"
          @keyup.enter="searchByTerm"
        />
        <button type="submit" class="search__icon -search" @click="searchByTerm"></button>
        <!--        <button v-show="inputText.length" type="submit" class="search__icon -clear" @click="clear"></button>-->
      </form>
      <div class="header__container__notification">
        <button type="submit" class="notification__icon -notification"></button>
      </div>
      <div class="header__container__settings">
        <button type="submit" class="settings__icon -settings"></button>
      </div>
      <el-dropdown v-if="isAuthenticated" class="header__container__side-menu um">
        <div class="avatar-wrap avatar-40">
          <Ava :user-id="$myUserData.id" :photo-src="$myUserData.photo" />
        </div>
        <el-dropdown-menu>
          <div class="ava-display-name">
            <span>{{ $myUserData.displayName }}</span>
          </div>
          <NuxtLink to="/profile">
            <el-dropdown-item class="no-underline">Настройки</el-dropdown-item>
          </NuxtLink>
          <NuxtLink to="/logout">
            <el-dropdown-item class="no-underline">Выйти</el-dropdown-item>
          </NuxtLink>
        </el-dropdown-menu>
      </el-dropdown>
      <div v-else class="header__container__side-menu">
        <div index="/signin">
          <a @click="loginOidc">Войти</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import Ava from '~/components/shared/_avatar.vue'

export default {
  name: 'HeaderComponent',
  components: { Ava },
  data() {
    return {
      activeIndex: this.$nuxt.$route.path,
      inputText: '',
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
  },
  methods: {
    async loginOidc() {
      try {
        await this.$auth.loginWith('oidc')
      } catch (e) {
        this.error = e.response.data.error.message
      }
    },
    searchByTerm() {
      // todo: search logic
    },
    clear() {
      this.inputText = ''
      this.$refs.headerSearchBarInput.focus()
    },
  },
}
</script>

<style lang="scss">
@import '../assets/css/components/header';
</style>
