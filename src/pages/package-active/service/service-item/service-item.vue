<template>
  <div class="service-item">
    <image class="item-left" :src="item.goods_cover_image" mode="aspectFill"></image>
    <div class="item-right">
      <div class="right-title">{{item.name}}</div>
      <div class="right-down">
        <div class="down-left">
          <p class="down-txt"><span class="first-txt">库存: {{item.saleable}}</span></p>
          <p class="down-txt second">售价: <i class="small"></i><span class="red-price">¥{{item.price}}</span></p>
        </div>
        <div class="down-right">
          <div class="down-right-icon" :class="showEdit ? 'active' : ''" @click.stop="showEditCover(item)"></div>
        </div>
      </div>
    </div>
    <div class="editor-box" :class="showEdit ? '' : 'hide'">
      <div class="editor-container">
        <div class="editor-content">
          <div class="editor-item" @click.stop="itemEditor(item)">
            <div class="item-icon edit"></div>
            <div class="item-txt">编辑</div>
          </div>
          <div class="editor-item" v-if="tabIdx === 0" @click.stop="itemDown(item)">
            <div class="item-icon down"></div>
            <div class="item-txt">下架</div>
          </div>
          <div class="editor-item" v-if="tabIdx === 1" @click.stop="itemDelete(item)">
            <div class="item-icon del"></div>
            <div class="item-txt">删除</div>
          </div>
        </div>
        <div class="editor-arrow"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['tabIdx', 'item', 'showEdit'],
    data() {
      return {
      }
    },
    methods: {
      showEditCover(item) {
        this.$emit('showEdit', item)
      },
      itemEditor(item) {
        this.$emit('itemEditor', item)
      },
      itemDown(item) {
        this.$emit('itemDown', item)
      },
      itemDelete(item) {
        this.$emit('itemDelete', item)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .service-item
    width: 100%
    background: $color-white
    border-1px($color-col-line, 2px)
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
      border-radius: 2px
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
      height: 70px
      display: flex
      flex-direction: column
      justify-content: space-between
      padding: 2px 0px
      box-sizing: border-box
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
            .small
              font-style: normal
              font-size: 12px
              color: $color-main
              display: inline-block
            .red-price
              color: $color-main
              font-family: $font-family-medium
            .original-price
              color: $color-text-main
              font-size: $font-size-12
              margin-left: 4px
          .second
            margin-top: 8px
            color: $color-text-secondary
            font-size: $font-size-14
          .first
            color: $color-text-secondary
        .down-right
          width: 10.6vw
          height: 5.3vw
          margin-left: 6vw
          position: relative
          .down-right-icon
            width: 10.6vw
            height: 5.3vw
            background: url('icon-function@2x.png')
            background-size: 100% 100%
          .down-right-icon.active
            background: url('icon-function_click@2x.png')
            background-size: 100% 100%
    .editor-box
      position: absolute
      height: 60px
      right: 14.6vw
      bottom: 5px
      width: 110px
      overflow: hidden
      transition: all 0.3s
      .editor-container
        display: flex
        align-items: flex-end
        height: 55px
        position: absolute
        right: 0
        top: 0
        transition: all 0.3s
        .editor-content
          background: rgba(0, 0, 0, 0.8)
          box-shadow: 0 1px 5px 0 rgba(54,53,71,0.50)
          border-radius: 2px
          height: 100%
          padding: 0 10px
          display: flex
          .editor-item
            width: 40px
            height: 100%
            display: flex
            flex-direction: column
            align-items: center
            justify-content: center
            .item-icon
              width: 17px
              height: 17px
              margin-bottom: 9px
              &.edit
                background: url('icon-compile_kj@2x.png')
                background-size: 100% 100%
              &.del
                background: url('icon-delete@2x.png')
                background-size: 100% 100%
              &.down
                background: url('icon-offline@2x.png')
                background-size: 100% 100%
            .item-txt
              font-size: $font-size-10
              font-family: $font-family-regular
              color: $color-white
        .editor-arrow
          width: 0
          height: 0
          border-width: 5px 0 5px 5px
          border-style: solid
          border-color: transparent transparent transparent rgba(0, 0, 0, 0.8)/*透明 灰 透明 透明 */
          margin-bottom: 12px

      .hide.editor-container
        right: -100%
    .editor-box.hide
      width: 0
</style>
