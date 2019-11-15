import API from '@api'
// $discountStandard 标准折扣  $discountVersatile 全能折扣 $discountPartner 合伙人折扣价
export const state = {
  statusBarHeight: 20,
  $vw: 1,
  $systemInfo: {},
  $discountStandard: '',
  $discountVersatile: '',
  $discountPartner: ''
}

export const getters = {
  statusBarHeight: state => state.statusBarHeight,
  $vw: state => state.$vw,
  $systemInfo: state => state.$systemInfo,
  $discountStandard: state => state.$discountStandard,
  $discountVersatile: state => state.$discountVersatile,
  $discountPartner: state => state.$discountPartner
}

export const mutations = {
  SET_NAVIGATION_CONFIG(state, { statusBarHeight }) {
    state.statusBarHeight = statusBarHeight
  },
  SET_VW(state, vw) {
    state.$vw = vw
  },
  SET_SYSTEM_INFO(state, obj = {}) {
    state.$systemInfo = obj
  },
  SET_TMP_PRICE(state, arr) {
    const TMP = {
      1: '$discountStandard',
      2: '$discountVersatile',
      3: '$discountPartner'
    }
    arr.forEach(val => {
      state[TMP[val.level_no]] = val.discount / 10
    })
  }
}

export const actions = {
  getPriceTemplate({ commit, dispatch }) {
    API.Global.getPriceTemplate().then((res) => {
      commit('SET_TMP_PRICE', res.data)
    })
  }
}
