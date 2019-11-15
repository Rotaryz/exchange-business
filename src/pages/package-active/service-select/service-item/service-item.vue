<template>
  <div class="service-item">
    <div class="item-content" @click.stop="selectService(item)">
      <image class="item-left" :src="item.goods_cover_image" mode="aspectFill"></image>
      <div class="item-right">
        <div class="right-title">{{item.name}}</div>
        <div class="right-down">
          <div class="down-left">
            <p class="down-txt"><span class="first-txt">库存: {{item.saleable}}</span></p>
            <p class="down-txt second"><span class="text">售价: </span>¥{{item.price}}</p>
          </div>
        </div>
        <div v-if="checked" class="right-icon active"></div>
        <div v-else class="right-icon"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['tabIdx', 'item', 'checked'],
    data() {
      return {
      }
    },
    methods: {
      selectService(item) {
        this.$emit('selectService', item)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .service-item
    width: 100%
    padding-top: 100px
    height: 0
    background: $color-white
    border-1px($color-col-line, 2px)
    position: relative
    .item-content
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      box-sizing: border-box
      padding: 15px 10px
      display: flex
      align-items: center
      .item-left
        width: 70px
        height: @width
        margin-right: 10px
        border-radius: 2px
        border-1px($color-E6E6E6)
        object-fit: cover
        overflow: hidden
        position: relative
        .left-cover
          position: absolute
          width: 100%
          height: 100%
          background: rgba(54,53,71,0.8)
          line-height: 18.666vw
          text-align: center
          color: $color-white
          font-size: $font-size-12
          font-family: $font-family-regular
          transition: all .3s
        .hide.left-cover
          opacity: 0
      .item-right
        flex: 1
        overflow: hidden
        height: 66px
        display: flex
        flex-direction: column
        justify-content: space-between
        position: relative
        .right-title
          font-size: $font-size-16
          color: $color-text-sub
          font-family: $font-family-regular
          letter-spacing: 0.8px
          width: 100%
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
        .right-down
          display: flex
          justify-content: space-between
          align-items: flex-end
          .down-left
            flex: 1
            overflow: hidden
            .down-txt
              font-family: $font-family-regular
              color: $color-text-secondary
              font-size: $font-size-14
              letter-spacing: 0.6px
            .second
              color: $color-main
              font-size: $font-size-14
              font-family: $font-family-medium
              margin-top: 6px
            .text
              color: $color-text-secondary
              font-family: $font-family-regular
        .right-icon
          width: 20px
          height: 20px
          border-radius: 50%
          border: 1px solid $color-text-tip
          position: absolute
          background: $color-white
          box-sizing: border-box
          transition: all 0.2s
          col-center()
          right: 5px
        .active
          border-width: 0
          background: url('icon-pick@1x.png')
          background-color: $color-white
          background-size: 100% 100%
</style>
