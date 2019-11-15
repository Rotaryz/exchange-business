<template>
  <transition name="fade">
    <div class="detail-modal" v-show="showModal">
      <div class="detail-content">
        <div class="content-top">
          <div class="title">服务详情</div>
          <div class="scroll-container">
            <div class="list-box">
              <div class="list-item" v-for="(item, index) in list" :key="index">
                <div class="item-p border-bottom-1px">
                  <div class="item-left">服务名称</div>
                  <div class="item-right">
                    <input type="text" v-model="list[index].servie" placeholder="请输入" class="input-box">
                  </div>
                </div>
                <div class="item-p border-bottom-1px">
                  <div class="item-left">数量</div>
                  <div class="item-right">
                    <input type="number" v-model="list[index].number" placeholder="请输入" class="input-box">
                  </div>
                </div>
                <div class="item-p border-bottom-1px">
                  <div class="item-left">价格</div>
                  <div class="item-right">
                    <input type="number" v-model="list[index].price" placeholder="请输入" class="input-box">
                  </div>
                </div>
                <div class="close-btn" @click.stop="delItem(index)">
                  <img src="./icon-del24@2x.png" class="btn-icon">
                </div>
              </div>
              <div class="add-box" @click.stop="addItem">添加</div>
            </div>
          </div>
        </div>
        <div class="btn-group border-top-1px">
          <div class="btn cancel" @click.stop="cancel">取消</div>
          <div class="btn confirm border-left-1px" @click.stop="confirm">确定</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'service-detail-modal',
    data() {
      return {
        showModal: false,
        list: [{
          servie: '',
          number: '',
          price: ''
        }]
      }
    },
    methods: {
      showCover(arr) {
        if (arr && arr.length) {
          this.list = arr.map((item) => {
            let res = Object.assign({}, item)
            return res
          })
          console.log(this.list)
        }
        this.showModal = true
      },
      addItem() {
        this.list.push({
          service: '',
          number: '',
          price: ''
        })
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      },
      delItem(idx) {
        this.list.splice(idx, 1)
      },
      cancel() {
        this.showModal = false
      },
      confirm() {
        let res = this.list.filter((item) => {
          return item.servie || item.number || item.price
        })
        this.$emit('serviceSuccess', res)
        this.showModal = false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .detail-modal
    width: 100vw
    height: 100vh
    background: rgba(54,53,71,0.80)
    fill-box()
    z-index: 80
    .detail-content
      position: absolute
      width: 300px
      height: 360px
      background: $color-white
      border: 1px solid rgba(32,32,46,0.10)
      border-radius: 2px
      all-center()
      .content-top
        height: 315px
        .title
          padding: 25px 0 10px 20px
          font-family: $font-family-regular
          color: $color-text-main
          font-size: $font-size-16
          letter-spacing: 0.6px
        .scroll-container
          width: 100%
          height: 250px
          .list-box
            min-height: 250px
            padding: 10px 20px 0
            .list-item
              background: #F9F9F9
              border-1px($color-line, 2px)
              position: relative
              margin-bottom: 20px
              .close-btn
                position: absolute
                z-index: 88
                right: -11px
                top: -11px
                width: 16px
                height: 16px
                padding: 5px
                .btn-icon
                  width: 16px
                  height: 16px
              .item-p
                height: 40px
                display: flex
                padding: 0 10px
                align-items: center
                .item-left
                  width: 80px
                  font-family: $font-family-regular
                  font-size: $font-size-14
                  color: $color-text-main
                .item-right
                  flex: 1
                  overflow: hidden
                  .input-box
                    width: 100%
                    height: 100%
                    font-family: $font-family-regular
                    font-size: $font-size-14
                    background: #F9F9F9
                    outline: none
                    border: 0 none
                  .input-box::-webkit-input-placeholder
                    color: $color-text-secondary
                  .input-box::-ms-input-placeholder
                    color: $color-text-secondary
                  .input-box::-moz-placeholder
                    color: $color-text-secondary
            .add-box
              width: 80px
              height: 24px
              margin: 17px auto
              line-height: 24px
              text-align: center
              background: #F9F9F9
              border-radius: 12px
              border-1px($color-E6E6E6, 12px)
              font-size: $font-size-14
              color: $color-text-main
      .btn-group
        height: 45px
        layout(row)
        .btn
          box-sizing: border-box
          flex: 1
          height: 100%
          text-align: center
          line-height: 45px
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-text-main
          letter-spacing: 0.6px
          &.confirm
            color: $color-main


</style>
