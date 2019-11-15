<template>
  <div class="wheel-edit">
    <navigation-bar title="大转盘"></navigation-bar>
    <wheel-item v-if="!giftList.length" :item="{}" hideBottom="true" @change="handleNav"></wheel-item>
    <block v-for="(item, index) in giftList" :key="index">
      <wheel-item ref="wheel" :hasDelete="true" :hideBottom="giftList.length<5&&index===giftList.length-1" :item=item :index=index+1 @change="handleChangeGift(index)" @delete="handleDelete($event, index)" @update="handleUpdate($event, index)"></wheel-item>
    </block>
    <wheel-plus v-if="giftList.length<5" @click="handleNav"></wheel-plus>
    <article class="item-wrapper border-bottom-1px">
      <edit-select title="中奖机率" unitText="%" :dataArray="winList" :selectItem="winItem" @change="handleSelect($event, 'winItem')"></edit-select>
      <edit-select title="抽奖次数" unitText="次" :dataArray="lotteryList" :selectItem="lotteryCount" @change="handleSelect($event, 'lotteryCount')"></edit-select>
    </article>
    <article class="explain-wrapper" :class="{active: openExplain}">
      <div class="header border-bottom-1px">
        <p class="left">兑奖说明</p>
        <div class="right">
          <base-switch :status="openExplain" @changeSwitch="handleSwitch($event, 'openExplain')"></base-switch>
        </div>
      </div>
      <div class="content">
        <textarea v-if="openExplain" class="text-area" type="text" maxlength="30" placeholder="请输入兑奖说明" placeholder-class="placeholder" v-model="explain"></textarea>
      </div>
    </article>
    <article class="control-wrapper">
      <p class="left">开启大转盘</p>
      <div class="right">
        <base-switch :status="openWheel" @changeSwitch="handleSwitch($event, 'openWheel')"></base-switch>
      </div>
    </article>
    <edit-button :opacity="allowSubmit" @click="handleSubmit"></edit-button>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as WheelEditHelpers from './modules/helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import EditButton from '@components/edit-button/edit-button'
  import BaseSwitch from '@components/_base-switch/_base-switch'
  import EditSelect from '@components/edit-select/edit-select'
  import WheelItem from './wheel-item/wheel-item'
  import WheelPlus from './wheel-plus/wheel-plus'
  import wx from 'wx'
  import {formatData, resolveData} from './wheel-handle'
  import {objDeepCopy} from '@utils/common'

  const PAGE_NAME = 'WHEEL_EDIT'
  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      WheelItem,
      WheelPlus,
      EditButton,
      BaseSwitch,
      EditSelect
    },
    data() {
      return {
        giftList: [], // 奖品列表
        copyGift: [],
        openExplain: false, // 是否开启兑奖说明
        openWheel: false, // 是否关闭大转盘
        winItem: 10, // 抽奖概率
        winList: [10, 20, 50, 70, 100], // 抽奖概率列表
        lotteryCount: 1, // 抽奖次数
        lotteryList: [1, 3, 5, 10], // 抽奖次数列表
        explain: '', // 说明
        changeIndex: -1 // 替换的下标
      }
    },
    computed: {
      ...WheelEditHelpers.computed,
      allowSubmit() {
        return this.giftList.length === 5
      }
    },
    onLoad() {
      this._getDetail()
    },
    onShow() {
      this.updateList()
      console.log(this.$refs)
    },
    onUnload() {
      this['SET_SELECT_ITEM']()
      this['SET_SELECT_LIST']()
    },
    methods: {
      ...WheelEditHelpers.methods,
      _getDetail() {
        API.Wheel.getDetail().then((res) => {
          Object.assign(this, resolveData(res.data))
        })
      },
      handleNav() {
        this.changeIndex = -1
        let arr = objDeepCopy(this.giftList)
        this['SET_SELECT_LIST'](arr.map(item => item))
        wx.navigateTo({url: this.$routes.active.WHEEL_EDIT_SELECT})
      },
      updateList() {
        if (this.selectItem) {
          console.log(this.selectItem, '---')
          const item = objDeepCopy(this.selectItem)
          console.log(item)
          if (this.changeIndex === -1) {
            this.giftList.push(item)
          } else {
            this.$set(this.giftList, this.changeIndex, item)
            this.$refs.wheel && this.$refs.wheel[this.changeIndex].setData({
              itemName: item.name,
              itemStock: item.stock
            })
          }
          this['SET_SELECT_ITEM']()
        }
      },
      handleSwitch(bool, key) {
        this[key] = bool
      },
      handleSelect(item, key) {
        this[key] = item
      },
      handleChangeGift(index) {
        this.changeIndex = index
        let arr = objDeepCopy(this.giftList)
        this['SET_SELECT_LIST'](arr.map(item => item))
        wx.navigateTo({url: this.$routes.active.WHEEL_EDIT_SELECT + '?changeIndex=' + index})
      },
      handleUpdate({key, val}, index) {
        this.giftList[index][key] = val
      },
      handleDelete(item, index) {
        this.giftList.splice(index, 1)
      },
      handleSubmit() {
        const data = formatData(this)
        API.Wheel.update({data}).then(res => {
          this.$wechat.showToast('保存成功')
          wx.navigateBack()
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .m-r-10
    margin-right :10px


  .wheel-edit
    min-height :100vh
    box-sizing :border-box
    padding-bottom :(65 + 12)px


  .control-wrapper
    font-family: $font-family-regular
    font-size: 14px
    color: #606972
    line-height: 1
    background :#fff
    margin-bottom :12px
    height: 50px
    padding-left :10px
    padding-right :10px
    layout(row)
    align-items :center
    .left
      color: #606972
      flex: 1

  .explain-wrapper
    font-family: $font-family-regular
    font-size: 14px
    color: #606972
    line-height: 1
    background :#fff
    margin-bottom :12px
    height :50px
    transition :height 0.3s
    overflow :hidden
    &.active
      height :138px
    .header
      height: 50px
      margin-left :10px
      padding-right :10px
      layout(row)
      align-items :center
      .left
        flex: 1
        color: #606972
    .content
      padding :13px 10px
      .text-area
        height: 63px
        width: 100%
        font-family: $font-family-regular
        font-size: 14px
        color: #1D2023
        line-height: 1.2

  .item-wrapper
    background :#fff
    margin-bottom : 12px


</style>
