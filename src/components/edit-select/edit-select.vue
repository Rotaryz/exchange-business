<template>
  <div class="edit-select border-bottom-1px" :class="{active: isOpen}">
    <header class="header" @click="handleToggle">
      <p class="left">{{title}}</p>
      <p class="middle" :class="{'disabled': disabled}">{{selectItemText}}{{unitText}}</p>
      <img src="/static/images/icon-pressed_my@2x.png" alt="" class="right" :class="{active: isOpen}">
    </header>
    <ul class="select-wrapper">
      <block v-for="(item, index) in dataArray" :key="index">
        <li class="select-item" :class="{active: index === selectIndex}" @click="handleSelect(item, index)"><i class="button"></i><span class="text">{{item}}</span></li>
      </block>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'EDIT_SELECT'

  export default {
    name: COMPONENT_NAME,
    props: {
      title: {
        type: String,
        default: ''
      },
      dataArray: {
        type: Array,
        default: () => []
      },
      selectItem: {
        type: [Number, Object],
        default: 0
      },
      unitText: {
        type: String,
        default: ''
      },
      disabled: {
        type: [Boolean, String],
        default: false
      }
    },
    data() {
      return {
        isOpen: false
      }
    },
    computed: {
      selectItemText() {
        return this.dataArray[this.selectIndex] || ''
      },
      selectIndex() {
        return this.dataArray.findIndex(val => val === this.selectItem)
      }
    },
    onUnload() {
      this.isOpen = false
    },
    methods: {
      handleToggle() {
        if (this.disabled) return
        this.isOpen = !this.isOpen
      },
      handleSelect(item) {
        this.$emit('change', item)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .edit-select
    height :50px
    transition : height 0.3s
    overflow :hidden
    &.active
      height:98px

  .header
    height: 50px
    padding :0 15px 0 10px
    layout(row)
    align-items :center
    font-family: $font-family-regular
    font-size: 14px
    line-height: 1
    .left
      color: #606972
      flex: 1
    .middle
      color: #1D2023
      padding-right :8px
    .disabled
      color: $color-text-tip
    .right
      width: 10px
      height: 10.5px
      transition :transform 0.3s
      transform :rotate(0deg)
      &.active
        transform :rotate(90deg)

  .select-wrapper
    height: 30px
    padding-top :1px
    padding-right :10px
    layout(row,block,nowrap)
    justify-content :flex-end
    .select-item
      position: relative
      height :30px
      width: 50px
      box-sizing border-box
      border-right :1px solid #1D2023
      border-top :1px solid #1D2023
      border-bottom :1px solid #1D2023
      text-align :center
      line-height :@height
      &:first-child
        border-left :1px solid #1D2023
        border-radius :2px 0 0 2px
        .button
          border-radius :2px 0 0 2px
      &:last-child
        border-radius :0 2px 2px 0
        .button
          border-radius :0 2px 2px 0

      &.active
        & > .text
          color: #fff
        & > .button
          background :#D83F35
      .text
        position: relative
        transition :all 0.3s
      .button
        position: absolute
        left: -1px
        top: @left
        right: @left
        bottom: @left
        background: transparent
        transition :all 0.3s


</style>
