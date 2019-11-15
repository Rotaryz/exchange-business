export const state = {
  selectItem: {}
}

export const getters = {
  selectItem(state) {
    return state.selectItem
  }
}

export const mutations = {
  SET_ITEM(state, item) {
    state.selectItem = item
  }
}

export const actions = {
  setItem({commit}, item) {
    commit('SET_ITEM', item)
  }
}
