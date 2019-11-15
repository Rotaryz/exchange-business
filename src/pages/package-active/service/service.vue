<template>
  <div class="service">
    <navigation-bar title="服务"></navigation-bar>
    <div class="header-tab border-bottom-1px" :style="{top: headerTop + 'px'}">
      <div class="tab-box">
        <div class="tab-item" :class="tabIdx === index ? 'active' : ''" v-for="(item, index) in tabList" :key="index" @click="changeTab(index, item)">
          {{item.txt}}({{numObj[tabsNumArr[index]]}})
        </div>
      </div>
      <div class="underline-box" :style="'transform: translate(' + tabIdx*100 + '%,0)'">
        <div class="underline"></div>
      </div>
    </div>
    <div class="container">
      <div class="big-container" :style="'transform: translate(-' + tabIdx*50 + '%,0)'">
        <div class="container-item">
          <div class="list-container">
            <div class="list-item" v-for="(item, index) in upList" :key="item.id">
              <service-item :tabIdx="tabIdx"
                            :item="item"
                            :showEdit="item.showEdit"
                            @showEdit="showEditor"
                            @itemEditor="itemEditor"
                            @itemDown="itemDown"
                            @itemDelete="itemDelete">
              </service-item>
            </div>
            <empty v-if="nothing0 && loaded" :image="empty" :paddingTop="100" tip="暂无服务"></empty>
          </div>
        </div>
        <div class="container-item">
          <div class="list-container">
            <div class="list-item" v-for="(item, index) in downList" :key="item.id">
              <service-item :tabIdx="tabIdx"
                            :item="item"
                            :showEdit="item.showEdit"
                            @showEdit="showEditor"
                            @itemEditor="itemEditor"
                            @itemUp="itemUp"
                            @itemDelete="itemDelete">
              </service-item>
            </div>
            <empty v-if="nothing1 && loaded" :image="empty" :paddingTop="100" tip="暂无服务"></empty>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-fill" :style="{height: statusBarHeight > 20 ? '100px':'80px'}"></div>
    <div class="footer-box" :style="{height: statusBarHeight > 20 ? '84px' : '64px'}">
      <div class="footer-btn" @click="toDetail('new')">新建服务</div>
    </div>
    <popup popUpType="confirm" :tip="popTip" :showPopup.sync="showPopup" @confirm="modalConfirm"></popup>
  </div>
</template>


<script type="text/ecmascript-6">
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ServiceItem from './service-item/service-item'
  import Popup from '@components/popup/popup'
  import Empty from '@components/empty/empty'

  const PAGE_NAME = 'MY_SERVICE'

  const TABS = [
    {txt: '已上架', id: 0, list: 'upList'},
    {txt: '已下架', id: 1, list: 'downList'}
  ]
  const TABSNUM = ['online_count', 'offline_count']

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
        tabList: TABS,
        tabIdx: 0,
        upList: [],
        downList: [],
        numObj: {},
        tabsNumArr: TABSNUM,
        nothing0: false,
        page: 1,
        nothing1: false,
        noMore: false,
        temporaryItem: {}, // 缓存需要处理的item
        temporaryType: '',
        showPopup: false,
        popTip: '',
        headerTop: 20,
        loaded: false
      }
    },
    computed: {
    },
    onLoad() {
      let res = mpvue.getSystemInfoSync()
      this.headerTop = res.statusBarHeight + 44 || 20
    },
    onShow() {
      this._getServiceList()
      this.getServiceCount()
      wx.pageScrollTo({scrollTop: 0, duration: 0})
    },
    onHide() {
      this._initAny()
      this.tabIdx = 0
    },
    onReachBottom() {
      this.getMore()
    },
    methods: {
      _getServiceList() {
        let data = {
          page: this.page,
          status: this.tabIdx ? 0 : 1
        }
        API.Service.getServiceList({data, loading: true})
          .then((res) => {
            this.$wechat.hideLoading()
            this[`${this.tabList[this.tabIdx].list}`] = res.data
            this.loaded = true
            if (!res.data.length) {
              this[`nothing${this.tabIdx}`] = true
            } else {
              this[`nothing${this.tabIdx}`] = false
            }
          })
          .catch(res => {
            this.$wechat.hideLoading()
          })
      },
      getServiceCount() {
        API.Service.getServiceCount()
          .then((res) => {
            this._setTabNum(res.data)
          })
      },
      _setTabNum(data) {
        this.numObj = {
          online_count: data[0].statistic,
          offline_count: data[1].statistic
        }
      },
      changeTab(idx) {
        this.tabIdx = idx * 1
        this._initAny()
        this._initAll()
        this._getServiceList()
        // wx.pageScrollTo({scrollTop: 0, duration: 0})
      },
      modalConfirm() {
        if (!this.temporaryItem.id) return
        switch (this.temporaryType) {
          case 'down':
            this._serviceDown(this.temporaryItem)
            break
          case 'del':
            this._serviceDel(this.temporaryItem)
            break
        }
      },
      showEditor(item) {
        this[`${this.tabList[this.tabIdx].list}`] = this[`${this.tabList[this.tabIdx].list}`].map((service) => {
          if (+item.id === +service.id) {
            service.showEdit = !service.showEdit
          } else {
            service.showEdit = false
          }
          return service
        })
      },
      itemEditor(item) {
        let id = item.id
        this.toDetail('edit', id)
      },
      async itemDown(item) {
        this.temporaryItem = item
        this.temporaryType = 'down'
        this.showPopup = true
        this.popTip = '确定下架该服务吗？'
      },
      _serviceDown(item) {
        let data = {
          id: item.id,
          status: 0
        }
        API.Service.serviceUpDown({data}).then((res) => {
          this.$wechat.showToast('操作成功')
          this.numObj[this.tabsNumArr[0]]--
          this.numObj[this.tabsNumArr[1]]++
          this[`${this.tabList[this.tabIdx].list}`] = this[`${this.tabList[this.tabIdx].list}`].filter((service) => {
            return +service.id !== +item.id
          })
          if (!this[`${this.tabList[this.tabIdx].list}`].length) {
            this[`nothing${this.tabIdx}`] = true
          }
        })
          .catch(res => {
            this._initAll()
          })
      },
      itemUp(item) {
        let data = {
          id: item.id,
          status: 1
        }
        API.Service.serviceUpDown({data}).then((res) => {
          this.$wechat.showToast('操作成功')
          this.numObj[this.tabsNumArr[0]]--
          this.numObj[this.tabsNumArr[1]]++
          this[`${this.tabList[this.tabIdx].list}`] = this[`${this.tabList[this.tabIdx].list}`].filter((service) => {
            return +service.id !== +item.id
          })
        })
      },
      itemDelete(item) {
        this.temporaryItem = item
        this.temporaryType = 'del'
        this.showPopup = true
        this.popTip = '确定删除该服务吗？'
      },
      _serviceDel(item) {
        API.Service.serviceDel({ data: {id: item.id} }).then((res) => {
          this.$wechat.showToast('操作成功')
          this.numObj[this.tabsNumArr[1]]--
          this[`${this.tabList[this.tabIdx].list}`] = this[`${this.tabList[this.tabIdx].list}`].filter((service) => {
            return +service.id !== +item.id
          })
          if (!this[`${this.tabList[this.tabIdx].list}`].length) {
            this[`nothing${this.tabIdx}`] = true
          }
        })
          .catch(res => {
            this._initAll()
          })
      },
      async _checkActivity(item) {
        let res = await API.getServiceConect(item.id)
        if (res.error === this.$ERR_OK) {
          return res.data.length
        } else {
          this.$wechat.showToast(res.message)
          return 'error'
        }
      },
      toDetail(type, id = '') {
        this._initAll()
        let url = `/package-active/service-edit?type=${type}&id=${id}`
        wx.navigateTo({ url })
      },
      _initAll() {
        for (let i = 0; i < 2; i++) {
          this[`${this.tabList[i].list}`] = this[`${this.tabList[i].list}`].map((service) => {
            service.showEdit = false
            return service
          })
        }
      },
      _initAny() {
        this.page = 1
        this.noMore = false
        this.loaded = false
        this[`nothing${this.tabIdx}`] = false
        this.upList = []
        this.downList = []
      },
      getMore() {
        if (this.noMore) return
        this.page++
        let data = {
          page: this.page,
          status: this.tabIdx ? 0 : 1
        }
        API.Service.getServiceList({data}).then((res) => {
          if (!res.data.length) {
            this.noMore = true
            this.page--
          } else {
            this[`${this.tabList[this.tabIdx].list}`] = [...this[`${this.tabList[this.tabIdx].list}`], ...res.data]
          }
        })
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/footer-box.styl"
  .service
    width: 100%

  .header-tab
    position: fixed
    width: 100vw
    height: 45px
    top: 64px
    left: 0
    z-index: 60
    background: $color-white
    .tab-box
      width: 100%
      height: 45px
      display: flex
      .tab-item
        flex: 1
        height: 45px
        line-height: 44px
        text-align: center
        font-size: $font-size-16
        color: $color-text-assist
        font-family: $font-family-regular
        letter-spacing: 0.8px
        transition: all 0.2s
      .tab-item.active
        color: $color-text-main
        font-family: $font-family-medium
    .underline-box
      height: 3px
      position: absolute
      bottom: 0
      width: 50%
      display: flex
      justify-content: center
      transform: translate(0, 0)
      transition: all 0.3s
      .underline
        width: 30px
        height: 3px
        background: $color-main
        border-radius: 3px

  .container
    width: 100vw
    height: 100%
    overflow: hidden
    .big-container
      width: 200vw
      height: 100%
      display: flex
      transition: all 0.3s
      .container-item
        width: 100vw
        height: 100%
        box-sizing: border-box
        padding: 45px 0 0
        background: $color-background
        .list-container
          padding: 0 10px
          .list-item
            padding-top: 10px
          .nothing-box
            display: flex
            flex-direction: column
            align-items: center
            font-size: 0
            padding-top: 100px
            .nothing-img
              width: 100px
              height: 100px
              margin-bottom: 20px
            .nothing-txt
              font-size: $font-size-14
              color: $color-text-secondary
              font-family: $font-family-regular

</style>
