<template>
  <div class="zb-checkbox hand"
       :class="[type]"
       @click="$emit('click',$event)"
  >
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'ZB_CHECKBOX'

  export default {
    name: COMPONENT_NAME,
    props: {
      type: {
        type: String,
        default: '' // checked已选择 disable禁止 indeterminate 半选择状态
      }
    },
    data() {
      return {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .zb-checkbox
    // 选择框样式
    display: inline-block
    position: relative
    border: 1px solid #dcdfe6
    border-radius: 50%
    width: 15px
    height: 15px
    background-color: #fff
    z-index: 1
    transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46)

    &.checked
    &.disable
    &.indeterminate
      &:after
        box-sizing: content-box
        content: ""
        height: 7px
        left: 5px
        top: 2px
        position: absolute
        transform: rotate(45deg)
        width: 4px
        transition: transform .15s ease-in .05s
        transform-origin: center

    &.checked
      background-color: $color-main
      border: 1px solid  $color-main
      &:after
        border-bottom: 1px solid #fff
        border-right: 1px solid #fff

    &.disable
      background-color: $color-disable
      border-bottom: 1px solid $color-disable

      &:after
        border-bottom: 2px solid $color-text-disable
        border-right: 2px solid $color-text-disable

    &.indeterminate
      background-color: $color-main
      border: 1px solid  $color-main


      &:after
        height: 2px
        width: 8px
        top: 6px
        left: 4px
        background-color: $color-white
        transform: rotate(0deg)
</style>
