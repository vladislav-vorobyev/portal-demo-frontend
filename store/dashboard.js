const defaultCardsList = [
  { uid: 'vp', on: true },
  { uid: 'otm', on: true },
]

const defaultLinksList = [
  { uid: 'otm', title: 'OTM', icon: 'app-otm' },
  { uid: 'vp', title: 'VP', icon: 'app-vp' },
]

export const state = () => ({
  cards: [],
  links: [],
  loading: false,
  error: undefined,
})

export const getters = {
  view(state) {
    return { cards: state.cards, links: state.links }
  },
}

export const mutations = {
  setCards(state, cards) {
    if (Array.isArray(cards)) {
      state.cards = cards
    } else {
      // eslint-disable-next-line no-console
      console.error('setCards error, cards is not array:', cards)
      throw new Error('Array required')
    }
  },

  setLinks(state, links) {
    if (Array.isArray(links)) {
      state.links = links
    } else {
      // eslint-disable-next-line no-console
      console.error('setLinks error, links is not array:', links)
      throw new Error('Array required')
    }
  },

  setLoading(state, value) {
    state.loading = value
  },

  setError(state, error) {
    state.error = error
  },
}

export const actions = {
  getDefaultCards() {
    return defaultCardsList.map((card) => card)
  },

  getDefaultLinks() {
    return defaultLinksList.map((link) => {
      return { ...link, href: this.$config[link.uid + 'URL'] }
    })
  },

  async load({ commit, dispatch }) {
    commit('setLoading', true)

    try {
      const result = await this.$portalApi.get('/users/me/dashboard')

      const dashboard = await result.data

      let cards = await dispatch('getDefaultCards')
      let links = await dispatch('getDefaultLinks')

      if (dashboard) {
        if (dashboard.cards) {
          cards = dashboard.cards
        }
        if (dashboard.links) {
          links = dashboard.links
        }
      }

      commit('setCards', cards)
      commit('setLinks', links)
    } catch (error) {
      commit('setError', error.message)
      commit('setCards', await dispatch('getDefaultCards'))
      commit('setLinks', await dispatch('getDefaultLinks'))
    }

    commit('setLoading', false)
  },

  async save({ state, commit }) {
    commit('setLoading', true)

    try {
      await this.$portalApi.put('/users/me/dashboard', { cards: state.cards, links: state.links })
    } catch (error) {
      commit('setError', error.message)
    }

    commit('setLoading', false)
  },

  async saveCards({ commit, dispatch }, cards) {
    await commit('setCards', cards)
    await dispatch('save')
  },

  async saveLinks({ commit, dispatch }, links) {
    await commit('setLinks', links)
    await dispatch('save')
  },
}
