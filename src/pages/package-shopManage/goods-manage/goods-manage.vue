<template>
  <div class="goods-manage">
    <navigation-bar title="商品管理"></navigation-bar>
    <div class="scroll-box" :style="{top: statusBarHeight + 'px'}">
      <scroll-view
        class="scroll-view2"
        :class="{'scroll-view2-active': isTop}"
        v-if="navList.length"
        id="scrollView"
        :scroll-into-view="viewToItem"
        scroll-x
        scroll-with-animation="true"
      >
        <div v-for="(item, index) in navList" :class="tabIndex === index ? 'item-active'  : ''" :key="index"
             class="item scroll-item" :id="'item'+index" @click="_changeTab(index, item.status, $event)">
          <p class="text">{{item.name}}({{item.total}})</p>
        </div>
        <div :style="{left: (100 / 3) * tabIndex + '%'}" class="line-box">
          <div class="line"></div>
        </div>
      </scroll-view>
    </div>
    <div class="big-box">
      <div class="classify-big-box" :style="{'transform': ' translateX('+ -(tabIndex * 100) +'vw)', 'transition': boxTransition}">
        <div
          v-for="(tabItem, tabIdx) in navList" :key="tabIdx"
          class="goods-list-box"
        >
          <div v-if="list.length" class="goods-list">
            <div v-for="(item, goodsIdx) in list" :key="goodsIdx" class="goods-item">
              <div class="item-top" @click="_selectGoods(item)">
                <div v-if="canChecked" :class="[item.checked ? 'checked' : '']" class="check-box">
                  <img v-if="item.checked" src="./icon-pick@2x.png" class="icon-checked">
                </div>
                <div class="goods-img">
                  <img v-if="item.goods_cover_image" :src="item.goods_cover_image" mode="aspectFill" class="img">
                </div>
                <div class="goods-info">
                  <div class="goods-title">{{item.name}}</div>
                  <div class="center-box">
                    <div class="val-box">
                      <span class="icon-text">兑换券</span>
                      <span class="val exchange">{{item.integral_price || '—'}}</span>
                    </div>
                    <div class="val-box">已兑 <span class="val">{{item.sale_count}}</span></div>
                  </div>
                  <div class="bottom-box">
                    <div class="val-box">采购价 <span class="val">{{item.price}}</span></div>
                    <div class="val-box">剩余 <span class="val">{{item.saleable}}</span></div>
                  </div>
                </div>
              </div>
              <div v-if="tabIndex===0" class="item-bottom" @click="_showShareModal(item)">
                <img src="./icon-sharecode@2x.png" class="bottom-icon">
                分享二维码
              </div>
              <div v-else class="item-bottom" @click="_editGoods(item)">
                <img src="./icon-bjsp@2x.png" class="bottom-icon">
                编辑商品
              </div>
            </div>
          </div>
          <empty v-else tip="暂时无商品" :height="listHeight+'px'"></empty>
        </div>
      </div>
    </div>
    <div v-if="tabIndex!==2" class="bottom-bar">
      <div v-if="canChecked" class="select-box" @click="_selectAllGoods">
        <div :class="[allChecked ? 'checked' : '']" class="check-box">
          <img v-if="allChecked" src="./icon-pick@2x.png" class="icon-checked">
        </div>
        全选
      </div>
      <div></div>
      <div class="option-btn" @click="_optionGoods">{{tabIndex===0?'下架':'上架'}}商品</div>
    </div>
    <div v-if="showShare" class="share-modal" @click.stop="_hideShareModal">
      <div class="share-container">
        <div class="share-content">
          <img :src='shareInfo.goods_cover_image' mode="aspectFill" class="share-img">
          <div class="share-info">
            <div class="left-box">
              <div class="share-title">{{shareInfo.name}}</div>
              <div class="val-box">
                <img :src="imageUrl + '/exchange/pic-dhq@2x.png'" class="tag-img">
                <span class="share-exchange">{{shareInfo.integral_price || '—'}}</span>
              </div>
            </div>
            <img :src="shareQRCode" mode="aspectFill" class="qr-code">
          </div>
        </div>
      </div>
      <div class="save-btn" @click.stop="_handleSavePoster">保存图片</div>
    </div>
    <we-paint :preview="false" ref="wePaint" @drawDone="_savePoster"></we-paint>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'
  import WePaint from '@components/we-paint/we-paint'
  import { baseURL } from '@utils/config'

  const PAGE_NAME = 'GOODS_MANAGE'
  const NAV_LIST = [
    { name: '已上架', status: '1', data: [], height: 0, total: 0 },
    { name: '已下架', status: '0', data: [], height: 0, total: 0 },
    { name: '未发布', status: '2', data: [], height: 0, total: 0 }
  ]

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty,
      WePaint
    },
    data() {
      return {
        statusBarHeight: 64,
        listHeight: 0,
        navList: NAV_LIST,
        tabIndex: 0,
        list: [],
        viewToItem: 'item0',
        page: 1,
        status: 1,
        boxTransition: 'all 0.25s',
        allChecked: false,
        showShare: false,
        shareInfo: {},
        shareQRCode: '',
        sharing: false,
        preShareName: '',
        shareImg: '',
        canChecked: false,
        hasMore: false
      }
    },
    onReachBottom() {
      if (this.hasMore) {
        this.page++
        this._getGoodsList()
        this._getGoodsStatistic()
      }
    },
    onLoad() {
      let res = wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight ? res.statusBarHeight + 44 : 64
      this.listHeight = res.screenHeight - this.statusBarHeight - 95
    },
    onShow() {
      if (this.sharing) {
        this.sharing = false
        return
      }
      this.page = 1
      this.list = []
      this._getGoodsList()
      this._getGoodsStatistic()
    },
    methods: {
      // 获取商品列表
      _getGoodsList() {
        API.Goods.getManageGoodsList({ data: { limit: 10, page: this.page, status: this.status }, loading: false }).then((res) => {
          this.allChecked = false
          // 遍历添加勾选的参数
          res.data.map((item) => {
            item.checked = false
          })
          this.list = this.list.concat(res.data)
          this.hasMore = res.meta.current_page < res.meta.last_page
        })
      },
      // 获取商品列表统计
      _getGoodsStatistic() {
        API.Goods.getManageGoodsStatistic().then((res) => {
          this.navList.forEach((item) => {
            res.data.forEach((resItem) => {
              if (item.status * 1 === resItem.status * 1) {
                item.total = resItem.statistic
              }
            })
          })
        })
      },
      // 切换tab
      _changeTab(index, status, e) {
        if (this.tabIndex === index) return
        // 如果是切换旁边的tab就加上动画，不是旁边的tab就不要动画
        this.boxTransition = this.tabIndex === index - 1 || this.tabIndex === index + 1 ? 'all 0.25s' : ''
        this.canChecked = false
        this._setViewToItem(index)
        this.status = status
        this.page = 1
        this.list = []
        this._getGoodsList()
        this._getGoodsStatistic()
      },
      // 切换列表
      _setViewToItem(index = 0) {
        this.tabIndex = index
        let number = index < 3 ? 0 : index - 2
        this.viewToItem = `item${number}`
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
      },
      // 勾选商品
      _selectGoods(item) {
        if (this.tabIndex === 2 || !this.canChecked) return
        item.checked = !item.checked
        // 判断是否全部都勾选了，如果全部都勾选了就把全选按钮勾选
        let checkCount = 0
        const curList = this.list
        curList.forEach((item) => {
          item.checked && checkCount++
          this.allChecked = checkCount === curList.length
        })
      },
      // 勾选全部商品
      _selectAllGoods() {
        if (this.tabIndex === 2) return
        this.allChecked = !this.allChecked
        this.list.forEach((item) => {
          item.checked = this.allChecked
        })
      },
      // 编辑商品
      _editGoods(item) {
        wx.navigateTo({ url: `${this.$routes.shopManage.EDIT_GOODS}?id=${item.id}` })
      },
      // 上架/下架商品
      _optionGoods() {
        if (!this.canChecked) {
          this.canChecked = true
          return
        }
        let idArr = []
        this.list.forEach((item) => {
          if (item.checked) {
            idArr.push(item.id)
          }
        })
        if (!idArr.length) {
          this.$wechat.showToast('请选择商品')
          return
        }
        API.Goods.getManageSetGoodsStatus({ data: { ids: idArr, status: this.tabIndex } }).then((res) => {
          this.$wechat.showToast('操作成功！')
          this.page = 1
          this.canChecked = false
          this.list = []
          this._getGoodsList()
          this._getGoodsStatistic()
        })
      },
      // 分享二维码, 分享流程，点击分享二维码 > 获取二维码 > 点击保存手机 > 画图
      _showShareModal(item) {
        this.showShare = true
        this.shareInfo = item
        this._getQrCode()
      },
      // 隐藏分享modal
      _hideShareModal() {
        this.showShare = false
      },
      // 获取分享二维码
      _getQrCode() {
        this.shareQRCode = `${baseURL.api}/common/file/qrcode/miniprogram-load?path=pages/goods-detail?s=${this.$storage('userInfo').shop_id}&g=${this.shareInfo.id}`
      },
      // 点击保存到手机
      _handleSavePoster() {
        if (!this.shareQRCode) {
          // 没有二维码，重新获取二维码并画海报
          this._getQrCode(true)
          return
        }
        // 如果是同一个商品不重新画图
        if (this.shareInfo.name !== this.preShareName) {
          this.preShareName = this.shareInfo.name
          this._actionDrawPoster()// 画海报
        } else {
          this._savePoster(this.shareImg)
        }
      },
      // 海报绘图
      _actionDrawPoster() {
        let options = {
          canvasId: 'we-paint',
          multiple: 1,
          panel: {
            el: '.share-content'
          },
          els: [
            {
              el: '.share-content',
              drawType: 'rect',
              color: '#fff'
            },
            {
              el: '.share-content .share-img',
              drawType: 'img',
              mode: 'aspectFill',
              source: this.shareInfo.goods_cover_image
            },
            {
              el: '.share-content .share-title',
              drawType: 'text',
              source: this.shareInfo.name.length >= 10 ? this.shareInfo.name.slice(0, 12) + '...' : this.shareInfo.name,
              fontSize: 14,
              color: '#3F454B'
            },
            {
              el: '.share-content .tag-img',
              drawType: 'img',
              mode: 'aspectFill',
              source: this.imageUrl + '/exchange/pic-dhq@2x.png',
              yAdjust: 1
            },
            {
              el: '.share-content .share-exchange',
              drawType: 'text',
              source: this.shareInfo.integral_price,
              fontSize: 20,
              color: '#D83F35',
              xAdjust: 6
            },
            {
              el: '.share-content .qr-code',
              drawType: 'img',
              mode: 'aspectFill',
              source: this.shareQRCode
            }
          ]
        }
        this.$refs.wePaint && this.$refs.wePaint.action(options, false)// 绘图
      },
      // 保存海报到本地
      _savePoster(pic) {
        this.shareImg = pic
        let self = this
        wx.saveImageToPhotosAlbum({
          filePath: pic,
          success: (res) => {
            this.$wechat.showToast('海报保存成功')
            this._hideShareModal()
          },
          fail: (e) => {
            // 没有授权，重新调起授权
            wx.showModal({
              content: '保存海报需进行相册授权，请到小程序设置中打开授权',
              confirmText: '去授权',
              confirmColor: '#D83F35',
              success(res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      if (res.authSetting && res.authSetting['scope.writePhotosAlbum']) {
                        pic && self._savePoster(pic)
                      }
                    }
                  })
                }
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .goods-manage
    width: 100%
    height: 100vh
    box-sizing: border-box
    padding-top: 45px
  .scroll-box
    top: 64px
    position: fixed
    box-shadow: 0 0.5px 0 0 #E6E7E9
    background: $color-white
    height: 45px
    z-index: 999
  .scroll-view2
    position: relative
    padding-left: 9px
    z-index: 99
    display: block
    white-space: nowrap
    box-sizing: border-box
    transition: transform 0.3s
    transform: translate3d(0, 0, 0)
    height: 100%
    width: 100vw
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
    .item
      box-sizing: border-box
      position: relative
      display: inline-block
      width: (100/3)%
      height: 100%
      line-height: 45px
      padding: 0 18px
      white-space: nowrap
      font-size: $font-size-16
      text-align: center
      transform-origin: 50%
      transition: all 0.2s
      .text
        font-family: $font-family-regular
        color: $color-text-assist
        line-height: 45px
    .item-active
      font-size: $font-size-16
      color: $color-text-main
      position: relative
      transition: font-size 0.2s
      transform-origin: 50%
      .text
        font-family: $font-family-medium
        color: $color-text-main
        line-height: 45px
    .line-box
      position: absolute
      width: (100/3)%
      height: 3px
      top: 42px
      left: 0
      display: flex
      justify-content: center
      transition: all 0.2s
      .line
        background: $color-main
        width: 30px
        border-radius: 3px
        height: 3px
  .big-box
    width: 100vw
    overflow: hidden
    padding-bottom: 50px
  .classify-big-box
    width: 300vw
    layout(row)
    .goods-list-box
      width: 100vw
      overflow: auto
  .goods-list
    padding-bottom: 10px
  .goods-item
    box-sizing: border-box
    width: 100%
    padding: 0 10px
    margin-top: 10px
    background: #ffffff
    layout()
    transition: all 0.25s
    .item-top
      box-sizing: border-box
      padding: 10px 0
      height: 120px
      layout(row)
      .check-box
        align-self: center
        box-sizing: border-box
        width: 17px
        height: @width
        border: 1px solid $color-text-tip
        border-radius: 100%
        transition: all 0.25s
        &.checked
          border: none
        .icon-checked
          width: 17px
          height: @width
      .goods-img
        align-self: flex-start
        width: 90px
        height: @width
        margin: 0 10px 0 5px
        .img
          width: 90px
          height: @width
      .goods-info
        flex: 1
        margin-top: 2px
        .goods-title
          height: 40px
          line-height: 20px
          margin-bottom: 13px
          font-family: $font-family-medium
          font-size: $font-size-14
          color: $color-text-sub
          no-wrap-plus(2)
      .center-box,.bottom-box
        width: 100%
        layout(row)
        align-items: center
      .center-box
        margin-bottom: 11px
      .val-box
        flex: 1
        layout(row)
        align-items: center
        font-family: $font-family-regular
        font-size: $font-size-13
        color: $color-text-assist
        .val
          padding-left: 6px
          color: #000E11
        .exchange
          font-family: $font-family-medium
          font-size: 20px
          color: $color-money
        .icon-text
          box-sizing: border-box
          display: inline-block
          padding: 2.5px 3px
          line-height: 1
          background: rgba(234,74,73,0.10)
          border-1px(#D33B32, 1px)
          color: $color-money
          font-family: $font-family-regular
          font-size: 11px
    .item-bottom
      height: 45px
      line-height: 45px
      layout(row)
      justify-content: center
      align-items: center
      font-family: $font-family-regular
      font-size: 15px
      color: $color-text-secondary
      border-top-1px()
      .bottom-icon
        width: 15px
        height: @width
        margin: 0 6.5px
  .bottom-bar
    position: fixed
    bottom: 0
    left: 0
    box-sizing: border-box
    width: 100vw
    height: 50px
    line-height: 50px
    padding: 0 10px
    background: #ffffff
    layout(row)
    justify-content: space-between
    align-items: center
    box-shadow: 0 -1px 0 0 #EFEEF5
    .select-box
      font-family: $font-family-regular
      font-size: 14px
      color: $color-text-main
      layout(row)
      align-items: center
      .check-box
        box-sizing: border-box
        margin-right: 5px
        width: 17px
        height: @width
        border: 1px solid $color-text-tip
        border-radius: 100%
        transition: opacity 0.25s
        &.checked
          border: none
        .icon-checked
          width: 17px
          height: @width
    .option-btn
      width: 83px
      height: 30px
      line-height: 30px
      text-align: center
      font-family: $font-family-regular
      font-size: 14px
      color: $color-money
      border: 1px solid $color-money
      border-radius: 2px

  .share-modal
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 999
    width: 100vw
    height: 100vh
    background: rgba(39, 39, 62, 0.7)
    layout()
    align-items: center
    justify-content: center
    .share-container
      box-sizing: border-box
      width: px-change-vw(310)
      background: #ffffff
      border-radius: 3px
      .share-content
        padding: 15px px-change-vw(12) 18px
      .share-img
        width: px-change-vw(286)
        height: @width
        border-radius: 2px
      .share-info
        padding: 10px 0 14px
        layout(row)
        .left-box
          flex: 1
          layout()
          justify-content: space-between
        .share-title
          font-family: $font-family-medium
          font-size: 14px
          color: $color-text-sub
          line-height: 20px
          no-wrap-plus(2)
        .val-box
          width: 100%
          layout(row)
          align-items: center
          font-family: $font-family-regular
          font-size: $font-size-13
          color: $color-text-assist
          .share-exchange
            padding-left: 6px
            font-family: $font-family-medium
            font-size: 20px
            color: $color-money
          .tag-img
            width: 39px
            height: 16px
        .qr-code
          width: 78px
          height: @width
          margin-left: 6px
      .btn-con
        box-sizing: border-box
        layout(row)
        width: 100%
        padding: 15px px-change-vw(12) 25px
        .top-line
          position: absolute
          top: -15px
          width: 93.6vw
          height: 1px
          border-top-1px()
        .share-btn
          height: 68px
          flex: 1
          layout()
          justify-content: center
          align-items: center
          text-align: center
          font-family: $font-family-regular
          font-size: 14px
          color: $color-text-assist
          .btn-icon
            width: 40px
            height: @width
            margin-bottom: 14px
    .close-btn
      width: 27px
      height: @width
      margin-top: 30px
    .save-btn
      margin-top: 30px
      width: 110px
      height: 36px
      line-height: 36px
      font-size: 15px
      color: #fff
      text-align: center
      border-radius: 18px
      background: #D33B32
</style>
