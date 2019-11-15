<template>
  <div class="my-address">
    <navigation-bar title="我的地址"></navigation-bar>
    <div v-if="list.length" class="page-container">
      <ul>
        <li v-for="(item,i) in list" :key="item.id" class="address-item" @click="saveAddress(item)">
          <div class="person">
            <span class="name">{{item.name}}</span>
            <span class="phone">{{item.mobile}}</span>
          </div>
          <div class="address">
            {{item.province}}{{item.city}}{{item.district}}{{item.address}}
          </div>
          <div class="operate-wrap">
            <div class="operate-item-wrap" @click.stop="changeDefaultAddress(item,i)">
              <zb-checkbox :type="item.is_default ? 'checked' :''"></zb-checkbox>
              <span class="operate-label">默认地址</span>
            </div>
            <div class="right">
              <div class="operate-item-wrap" @click.stop="editAddress(item,i)">
                <img class="icon" src="./icon-edit@2x.png">
                <span class="operate-label">编辑</span>
              </div>
              <div class="operate-item-wrap delete-btn" @click.stop="deleteAddress(item,i)">
                <img class="icon" src="./icon-del_dz@2x.png">
                <span class="operate-label">删除</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <button class="button-primary" @click="goToAdd">新建地址</button>
    </div>
    <div v-else class="page-empty">
      <empty tip="您还没有收货地址哦！"
             buttonStyle="color:#fff;background:#D83F35;height:35px;line-height:35px;width:115px;border:none;margin-top:25px;box-sizing:border-box"
             buttonText="新建地址"
             :image="require('./pic-address@2x.png')"
             :url="$routes.personalCenter.NEW_ADDRESS"
      ></empty>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ZbCheckbox from '@components/checkbox/checkbox'
  import Empty from '@components/empty/empty'
  import GetOptions from '@mixins/get-options'

  const PAGE_NAME = 'MY_ADDRESS'

  export default {
    name: PAGE_NAME,
    components: {
      ZbCheckbox,
      NavigationBar,
      Empty
    },
    mixins: [GetOptions],
    data() {
      return {
        isSave: false,
        list: []
      }
    },
    onLoad(options) {
      this.isSave = options.save || 0
    },
    onShow() {
      this._getAddressList()
    },
    methods: {
      saveAddress(item) {
        // console.log(this.isSave, 1111)
        if (this.isSave) {
          this.$storage('address', item)
          wx.navigateBack({ delta: 1 })
        }
      },
      _getAddressList() {
        API.Address.getAddressList({ data: { limit: 0 } }).then((res) => {
          this.list = res.data
        })
      },
      changeDefaultAddress(item, i) {
        API.Address.setDefaultAddress({ data: { id: item.id } }).then((res) => {
          wx.showToast({ title: '设置成功', icon: 'none' })
          this._getAddressList()
        })
      },
      editAddress(item, i) {
        wx.navigateTo({
          url: this.$routes.personalCenter.NEW_ADDRESS + '?id=' + item.id
        })
      },
      deleteAddress(item, i) {
        API.Address.deleteAddress({ data: { id: item.id } }).then((res) => {
          wx.showToast({ title: '删除成功', icon: 'none' })
          this._getAddressList()
        })
      },
      goToAdd() {
        wx.navigateTo({ url: this.$routes.personalCenter.NEW_ADDRESS })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .my-address
    height: 100vh
    display: flex
    flex-direction: column

    .page-empty
      flex: 1
      background-color: $color-white

    .page-container
      flex: 1
      padding: 10px
      .address-item
        background: $color-white
        border-radius: 3px
        padding-left: 10px
        margin-bottom: 10px

        .person
          padding: 15px  10px 10px 0px
          color: $color-text-main
          display: flex

          .name
            display: inline-block
            width: 65px
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
            font-family: $font-family-medium
            font-size: $font-size-16
            letter-spacing: 0.6px

          .phone
            margin-left: 14px
            font-family: $font-family-medium
            font-size: $font-size-16
            letter-spacing: 0.6px

      .address
        line-height: 16px
        padding: 0 10px 5px 0
        min-height: 37px
        font-size: $font-size-13
        font-family: $font-family-regular
        color: $color-text-secondary

      .operate-wrap
        display: flex
        justify-content: space-between
        padding-right: 10px
        border-top-1px(#EFEEF5)
        height: 40px

        .icon
          width: 13px
          height: 13px

        .right
          display: flex
          align-items: center

          .delete-btn
            margin-left: 20px

        .operate-item-wrap
          display: flex
          align-items: center

        .operate-label
          margin-left: 5px
          font-size: $font-size-14
          letter-spacing: 0.6px

      .button-primary
        margin-top: 20px

        height: 45px
        line-height: 45px
        border-radius 2px

</style>
