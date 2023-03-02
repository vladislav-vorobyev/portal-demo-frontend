export const state = () => ({
  windowWidth: 0,
  windowHeight: 0,
})

export const getters = {
  width(state) {
    return state.windowWidth
  },
  height(state) {
    return state.windowHeight
  },
}

export const mutations = {
  setWidth(state, val) {
    state.windowWidth = val
  },
  setHeight(state, val) {
    state.windowHeight = val
  },
}

export const actions = {
  update({ commit }) {
    commit('setWidth', window.innerWidth)
    commit('setHeight', window.innerHeight)
  },
}
