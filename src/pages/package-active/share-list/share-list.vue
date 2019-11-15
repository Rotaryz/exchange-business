<template>
  <div class="share-list">
    <navigation-bar title="裂变分销"></navigation-bar>
    <div class="share-box" v-if="shareList.length && totalPage >= 1">
      <div class="item-list" v-for="(item, index) in shareList" :key="index">
        <service-item :tabIdx="tabIdx"
                      :item="item"
                      :index="index"
                      :showEdit="item.showEdit"
                      @showEdit="showEditor"
                      @itemEditor="itemEditor"
                      @itemUp="itemUp"
                      @itemDelete="itemDelete">
        </service-item>
      </div>
    </div>
    <div class="empty-page" v-else>
      <empty :image="require('./pic-shopcar@2x.png')" tip="暂无商品"></empty>
    </div>
    <div class="add-btn-fixed">
      <div class="share-add-btn">
        <div class="add-btn" @click="jumpAddGoods">添加商品</div>
      </div>
    </div>
    <popup :showPopup.sync="showPopup" tip="确定删除该商品吗？" @confirm="confirm"></popup>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './modules/helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Popup from '@components/popup/popup'
  import ServiceItem from './service-item/service-item'
  import Empty from '@components/empty/empty'

  const PAGE_NAME = 'SHARE_LIST'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      ServiceItem,
      Popup,
      Empty
    },
    data() {
      return {
        shareList: [],
        tabIdx: 0,
        params: {
          limit: 10,
          page: 1
        },
        loading: false,
        totalPage: 0,
        showPopup: false,
        curItem: {},
        curIndex: 0
      }
    },
    onShow() {
      this.params.page = 1
      this.getShareList()
    },
    // 下拉加载
    onReachBottom() {
      if (this.params.page + 1 > this.totalPage || this.loading) return
      this.params.page++
      this.getShareList()
    },
    methods: {
      // 获取分享赚钱列表
      getShareList() {
        this.loading = true
        API.Share.shareActiveList({ data: this.params, loading: false }).then(res => {
          res.data.forEach((item) => {
            item.showEdit = false
          })
          if (this.params.page === 1) this.shareList = []
          this.shareList = [...this.shareList, ...res.data]
          this.totalPage = res.meta.last_page
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      // 显示编辑
      showEditor(item) {
        this.shareList.map((item1) => {
          if (+item.id === +item1.id) {
            item1.showEdit = !item1.showEdit
          } else {
            item1.showEdit = false
          }
          return item1
        })
      },
      // 编辑商品
      itemEditor(item) {
        item.showEdit = false
        wx.navigateTo({ url: `${this.$routes.active.SHARE_EDIT}?id=${item.id}` })
      },
      // 删除商品
      itemDelete(item, index) {
        console.log(item, index)
        item.showEdit = false
        this.curItem = item
        this.curIndex = index
        this.showPopup = true
      },
      // 确认删除
      confirm() {
        API.Share.destroyShareGoods({ data: {id: this.curItem.id}, loading: false }).then(res => {
          this.shareList.splice(this.curIndex, 1)
          this.$wechat.showToast('删除成功！')
        }).catch(() => {
          this.$wechat.showToast('删除失败！')
        })
        console.log('confirm delete')
      },
      // 添加商品
      jumpAddGoods() {
        wx.navigateTo({ url: this.$routes.active.SHARE_CHOICE })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .share-list
    width: 100%
    height: 100vh
    display: flex
    flex-direction: column
  .share-box
    padding: 10px 10px 64px
    box-sizing: border-box
    .item-list
      margin-bottom: 10px
  .add-btn-fixed
    position: fixed
    left: 0
    bottom: 0
    width: 100%
    .share-add-btn
      border-top-1px(#e6e6e6)
      width: 100%
      padding: 10px
      height: 64px
      box-sizing: border-box
      background: $color-white
      .add-btn
        font-family: $font-family-regular
        color: $color-white
        font-size: $font-size-16
        text-align: center
        border-radius: 2px
        background: $color-money
        height: 44px
        line-height: 44px
  .empty-page
    background-color: $color-white
    flex: 1
    padding: 10px 10px 64px
</style>
