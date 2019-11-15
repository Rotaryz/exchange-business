<template>
  <div class="service-select">
    <navigation-bar title="选择服务"></navigation-bar>
    <div class="container-item">
      <div class="list-container">
        <div class="list-item" v-for="(item, index) in serviceList" :key="index">
          <service-item :tabIdx="tabIdx"
                        :item="item"
                        :checked="item.checked"
                        @selectService="selectService">
          </service-item>
        </div>
        <empty v-if="nothing" :image="empty" :paddingTop="200" tip="暂无服务，请先新建服务"></empty>
      </div>
    </div>

    <!--保存按钮-->
    <div class="footer-fill" :style="{height: statusBarHeight > 20 ? '100px':'80px'}"></div>
    <div class="footer-box" :style="{height: statusBarHeight > 20 ? '84px' : '64px'}">
      <button class="footer-btn" @click="submitService">确定</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './modules/helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ServiceItem from './service-item/service-item'
  import Empty from '@components/empty/empty'
  import {serviceSelectComputed, serviceSelectActions} from './modules/helpers'

  const PAGE_NAME = 'SERVICE_SELECT'

  const SERVICE_LIST = [
    {
      image_url: '',
      title: '超支套装',
      stock: '20',
      platform_price: '50.00',
      showEdit: false,
      id: 1
    },
    {
      image_url: '',
      title: '超支套装',
      stock: '20',
      platform_price: '50.00',
      showEdit: false,
      id: 2
    }
  ]

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      ServiceItem,
      Empty
    },
    data() {
      return {
        serviceList: SERVICE_LIST,
        nothing: false,
        currentItem: {},
        page: 1,
        noMore: false,
        type: ''
      }
    },
    computed: {
      ...serviceSelectComputed
    },
    onLoad(options) {
      this.type = options.type || 1
    },
    onShow() {
      this._getServiceList()
    },
    onHide() {
      this.page = 1
      this.noMore = false
      this.nothing = false
    },
    onReachBottom() {
      this.getMore()
    },
    methods: {
      ...serviceSelectActions,
      _getServiceList() {
        let data = {
          page: this.page,
          status: 1,
          is_available: 1,
          except_promotion_type: this.type
        }
        API.Service.getServiceList({data, loading: true})
          .then((res) => {
            this.$wechat.hideLoading()
            this.serviceList = res.data.map(item => {
              if (this.selectItem.id && (item.id === this.selectItem.id)) {
                item.checked = true
              } else {
                item.checked = false
              }
              return item
            })
            if (!res.data.length) {
              this.nothing = true
            }
          })
          .catch(res => {
            this.$wechat.hideLoading()
          })
      },
      selectService(item) {
        this.serviceList = this.serviceList.map(service => {
          if (+item.id === +service.id) {
            service.checked = true
            this.currentItem = item
          } else {
            service.checked = false
          }
          return service
        })
      },
      submitService() {
        this.currentItem.id && this.setItem(this.currentItem)
        wx.navigateBack({ delta: 1 })
      },
      getMore() {
        if (this.noMore) return
        this.page++
        let data = {
          page: this.page,
          status: 1,
          is_available: 1,
          except_promotion_type: this.type
        }
        API.Service.getServiceList({data}).then((res) => {
          if (!res.data.length) {
            this.noMore = true
            this.page--
          } else {
            this.serviceList = [...this.serviceList, ...res.data]
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/footer-box.styl"

  .service-select
    width: 100%
    .container-item
      width: 100vw
      background: $color-F6F6F6
      overflow: hidden
      .list-container
        padding: 0 10px
        .list-item
          padding-top: 10px
        .nothing-box
          display: flex
          flex-direction: column
          align-items: center
          font-size: 0
          padding-top: 200px
          .nothing-img
            width: 100px
            height: 80px
            margin-bottom: 5px
          .nothing-txt
            font-size: $font-size-12
            color: $color-CCCCCC
            font-family: $font-family-regular
</style>
