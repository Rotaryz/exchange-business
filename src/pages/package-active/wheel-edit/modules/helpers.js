import {mapGetters, mapMutations} from 'vuex'

export const computed = {
  ...mapGetters('wheelEdit', ['selectList', 'selectItem'])
}

export const methods = {
  ...mapMutations('wheelEdit', ['SET_SELECT_LIST', 'SET_SELECT_ITEM'])
}
