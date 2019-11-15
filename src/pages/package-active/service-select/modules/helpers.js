// import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
import {mapGetters, mapActions} from 'vuex'

export const serviceSelectComputed = {
  ...mapGetters('serviceSelect', ['selectItem'])
}

export const serviceSelectActions = {
  ...mapActions('serviceSelect', ['setItem'])
}
