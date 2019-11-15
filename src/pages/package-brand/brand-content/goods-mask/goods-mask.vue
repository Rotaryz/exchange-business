<template>
  <div class="goods-mask" @click="hide">
    <div v-if="visible" class="mask"></div>
    <div :class="['goods-list-wrap',{show:visible}]" @click.stop="">
      <div v-show="goodsList.length" class="title">全部商品<span class="num">/共{{goodsList.length || 0}}个商品</span></div>
      <div class="good-list">
        <div v-for="(item,idx) in goodsList" :key="item.id" class="goods-item-wrap">
          <goods-item :item="item"></goods-item>
        </div>
      </div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import GoodsItem from '../goods-item/goods-item'
  const COMPONENT_NAME = 'GOODS_MASK'

  export default {
    name: COMPONENT_NAME,
    components: {
      GoodsItem
    },
    props: {
      visible: {
        type: Boolean,
        default: true
      },
      goodsList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
      }
    },
    methods: {
      hide() {
        this.$emit('hide')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .goods-mask
    width: 100%

  .mask
    box-sizing: border-box
    background: rgba(39, 39, 62, .7)
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0

  .goods-list-wrap
    position: fixed
    background #fff
    bottom 0
    left: 0
    right: 0
    transform translateY(100%)
    border-radius 12px 12px 0 0
    transition all 0.3s
    z-index: 3
    &.show
      transition all 0.3s
      transform translateY(0)
    .title
      height: 50px
      line-height 50px
      padding 0 15px
      font-family: $font-family-regular
      font-size: $font-size-16
      color: #111111
      .num
        font-family: $font-family-regular
        font-size: $font-size-11
        color: #808080
        margin-left 3px
    .good-list
      padding: 0 15px 17px 15px
      max-height: 60vh
      min-height:30vh
      overflow auto
      .goods-item-wrap
        margin-bottom:10px
</style>
