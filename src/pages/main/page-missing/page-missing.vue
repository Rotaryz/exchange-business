<template>
  <div class="page-missing">
    <navigation-bar title="兑换商城"></navigation-bar>
    <div class="empty-page">
      <empty buttonText="返回首页" :tip="tip" :image="require('./pic-goods@2x.png')"></empty>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  // import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'

  const PAGE_NAME = 'PAGE_ERROR'

  const CONFIG = {
    article: '文章已下架/删除',
    goods: '商品已下架/删除',
    brand: '品牌已下架/删除'
  }

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    onLoad(options) {
      this.type = options.type
      this.setTip()
    },
    onShow() {
      this.setTip()
    },
    data() {
      return {
        tip: '商品已下架/删除'
      }
    },
    methods: {
      setTip() {
        this.tip = CONFIG[this.type] || '页面丢失'
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .page-missing
    width: 100%
    height: 100vh
    display: flex
    flex-direction: column

    .empty-page
      flex: 1
</style>
