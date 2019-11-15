<template>
  <div class="loading-more" :style="styles">
    <img src="./loading.gif" class="load-img">
    <p class="text">{{text}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'LOADING_MORE'
  export default {
    name: COMPONENT_NAME,
    props: {
      text: {
        type: String,
        default: '正在加载...'
      },
      styles: {
        type: String,
        default: `padding:30px 0 60px`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .loading-more
    margin: 0 auto
    layout(flex)
    justify-content: center
    align-items: center
    .load-img
      width: 25px
      height: @width
    .text
      padding-left: 4px
      font-family: $font-family-regular
      font-size: 12px
      color: $color-text-assist
</style>
