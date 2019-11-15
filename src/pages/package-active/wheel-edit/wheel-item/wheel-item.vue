<template>
  <div class="wheel-item" :class="{'hide-bottom': hideBottom}">
    <div class="header">
      <img v-if="item.type == 1" :src="item.image_url" alt="" class="head-image" mode="aspectFill">
      <img v-else-if="item.type == 2" src="./pic-bodou.png" alt="" class="head-image" mode="aspectFill">
      <img v-else-if="item.type == 3" src="./pic-duihuan.png" alt="" class="head-image" mode="aspectFill">
      <div v-else class="head-image" mode="aspectFill"></div>
      <button class="button" @click="handleChange"><img src="./icon-change@2x.png" alt="" class="icon-change">更换奖品</button>
    </div>
    <article class="item-wrapper border-bottom-1px">
      <div class="left-wrapper" @click="handleDelete">
        <img v-if="hasDelete" src="./icon-del32_red@2x.png" alt="" class="icon-del">
      </div>
      <div class="right-wrapper">
        <section class="options border-bottom-1px">
          <p class="left">奖品{{giftLeftNumber}}名称{{giftTypeText ? '（' + giftTypeText + giftNumberShow +'）': ''}}</p>
          <div class="middle m-r-10">
            <input type="text" maxlength="6" placeholder="请输入奖品名称" placeholder-class="placeholder" class="input" v-model="itemName" @change="$emit('update', {key: 'name', val: itemName})">
          </div>
        </section>
        <section class="options">
          <p class="left">库存</p>
          <div class="middle">
            <input type="number" maxlength="10" placeholder="请输入库存" placeholder-class="placeholder" class="input" v-model="itemStock" @change="$emit('update', {key: 'stock', val: itemStock})">
          </div>
          <p class="right">个</p>
        </section>
      </div>
    </article>
  </div>
</template>

<script type="text/ecmascript-6">
  import {GIFT_TYPE} from '../wheel-handle'
  const COMPONENT_NAME = 'WHEEL_ITEM'

  const LEFT_NAME = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五'
  }

  export default {
    name: COMPONENT_NAME,
    props: {
      hideBottom: {
        type: Boolean,
        default: false
      },
      hasDelete: {
        type: Boolean,
        default: false
      },
      item: {
        type: Object,
        default: () => {}
      },
      index: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        itemName: this.item.name || '',
        itemStock: this.item.stock
      }
    },
    computed: {
      giftTypeText() {
        let text = ''
        if (this.item) {
          text = GIFT_TYPE[this.item.type] || ''
        }
        return text
      },
      giftNumberShow() {
        let number = ''
        // if (this.item.type > 1) {
        //   number = this.item.number > 0 ? this.item.number : ''
        // }
        return number
      },
      giftLeftNumber() {
        return LEFT_NAME[this.index] || ''
      }
    },
    methods: {
      handleChange() {
        this.$emit('change')
      },
      handleDelete() {
        if (this.hasDelete) {
          this.$emit('delete', this.item)
        }
      },
      setData(obj = {}) {
        Object.assign(this, obj)
      },
      handleInput(e, key) {
        const val = e.mp.detail.value
        console.log(val, key)
        this.$emit('update', {key, val})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .placeholder
    font-family: $font-family-regular
    font-size: 14px
    color: #BCC4CC

  .m-r-10
    margin-right :10px

  .wheel-item
    width: 100%
    background :#ffffff
    margin-bottom : 12px
    &.hide-bottom
      margin-bottom : 0
    .item-wrapper
      layout(row)
      .left-wrapper
        padding-left :10px
        height :100%
        .icon-del
          margin-top :17px
          margin-right :8px
          width: 16px
          height: @width
      .right-wrapper
        flex: 1
        .options
          height :50px
          line-height: 1
          layout(row,block,nowrap)
          align-items :center
          font-family: $font-family-regular
          font-size: 14px
          color: #606972
          .left
            flex: 1
            color: #606972
          .middle
            height :14px
            line-height: @height
            .input
              position :relative
              top: -4px
              width: 120px
              height :14px
              font-family: $font-family-regular
              font-size: 14px
              color: #1D2023
              line-height: 14px
              text-align :right
              text-indent :-2px
          .right
            margin-right :10px
            margin-left :5px
    .header
      height :px2vw(120)
      background-image:url("./pic-turntable.png")
      background-size :100% 100%
      background-position :center content
      background-repeat: no-repeat
      position: relative
      .head-image
        width :100%
        height: @width
        display :block
      .button
        position: absolute
        top: 15px
        right: @top
        height: 28px
        width: 95px
        background: rgba(0,0,0,0.3)
        border-radius :@height
        layout(row)
        justify-content:center
        align-items :center
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #FFFFFF;
        .icon-change
          width: 14px
          height: 12px
          margin-right: 3px

</style>
