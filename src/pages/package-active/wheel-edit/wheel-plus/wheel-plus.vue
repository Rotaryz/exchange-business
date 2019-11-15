<template>
  <div class="wheel-plus">
    <div class="button" @click="$emit('click')">
      <img src="./icon-plus_sign@2x.png" alt="" class="icon-add">
      添加新奖项
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'WHEEL_PLUS'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .wheel-plus
    height: 82px
    background: #F2F2F7
    layout(row)
    align-items :center
    justify-content :center
    .button
      layout(row)
      align-items :center
      justify-content :center
      width: 109px
      height: 32px
      border: 1px solid #606972
      border-radius: 1px
      font-family: $font-family-medium
      font-size: 14px
      color: #606972
      .icon-add
        width: 12px
        height: @width
        margin-right :5px
</style>
