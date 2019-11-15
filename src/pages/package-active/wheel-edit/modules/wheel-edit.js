export const state = {
  selectList: [],
  selectItem: null
}

export const getters = {
  selectList: state => state.selectList,
  selectItem: state => state.selectItem
}

export const mutations = {
  SET_SELECT_LIST(state, list = []) {
    state.selectList = list
  },
  SET_SELECT_ITEM(state, obj = null) {
    state.selectItem = obj
  }
}

export const actions = {}
