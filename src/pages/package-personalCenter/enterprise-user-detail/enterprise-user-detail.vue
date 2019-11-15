<template>
  <div class="enterprise-user-detail">
    <navigation-bar title="企业用户详情"></navigation-bar>
    <div class="img-wrap">
      <img v-if="detail.shop_level_id * 1 === 0" mode="widthFix" class="vip-icon" src="./pic-ptbyh_xq@2x.png">
      <img v-else-if="detail.shop_level_id * 1 === 1" mode="widthFix" class="vip-icon" src="./pic-bzyh_xq@2x.png">
      <img v-else-if="detail.shop_level_id * 1 === 2" mode="widthFix" class="vip-icon" src="./pic-qnyh_xq@2x.png">
    </div>
    <div class="info-wrap">
      <div class="info-item">
        <div class="label">公司名称</div>
        <div class="value">{{detail.name}}</div>
      </div>
      <div class="info-item">
        <div class="label">用户名</div>
        <div class="value">{{detail.truename}}</div>
      </div>
      <div class="info-item">
        <div class="label">联系方式</div>
        <div class="value">{{detail.mobile}}</div>
      </div>
      <div class="info-item">
        <div class="label">创建时间</div>
        <div class="value">{{detail.created_at}}</div>
      </div>
      <div class="info-item">
        <div class="label">认证状态</div>
        <div class="value">{{detail.certificate_status * 1 === 1 ? '已认证' : '未认证'}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'ENTERPRISE_USER_DETAIL'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    onLoad(options) {
      this.id = options.id
      this.getDetail()
    },
    data() {
      return {
        id: 0,
        detail: {
          vipType: 'versatile', // standard versatile common
          name: '',
          companyName: '',
          phone: '',
          creatTime: '',
          status: ''
        }
      }
    },
    methods: {
      getDetail() {
        API.Mine.getUserInfo({
          data: {id: this.id},
          loading: false
        })
          .then((res) => {
            this.detail = res.data.shop_info
          })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .enterprise-user-detail
    width: 100%
    height 100vh
    background-color $color-white

  .img-wrap
    padding: 10px 10px 0
    background-color: #f5f5f9

    .vip-icon
      width: 100%
      display: block

  .info-wrap
    border-bottom-1px()
    padding-left: 10px

    .info-item
      border-bottom-1px()
      height: 50px
      display flex
      align-items center
      justify-content space-between
      padding-right: 10px

      .label
        color: #606972
        font-size $font-size-14

      .value
        color: #1D2023
        font-size $font-size-14


</style>
