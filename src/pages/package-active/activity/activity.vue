<template>
  <div class="activity">
    <navigation-bar :title="activityName"></navigation-bar>
    <div class="header-tab border-bottom-1px" :style="{top: headerTop + 'px'}">
      <div class="tab-box">
        <div class="tab-item" :class="tabIdx === index ? 'active' : ''" v-for="(item, index) in tabList" :key="index" @click="changeTab(index, item)">
          {{item.txt}}({{numObj[tabsNumArr[index]]}})
        </div>
      </div>
      <div class="underline-box" :style="'transform: translate(' + tabIdx*100  + '%,0)'">
        <div class="underline"></div>
      </div>
    </div>
    <div class="container">
      <div class="big-container" :style="'transform: translate(-' + tabIdx*50 + '%,0)'">
        <div class="container-item">
          <div class="list-container">
            <article v-if="upList.length" class="list-item" v-for="(item, upIdx) in upList" :key="item.id + item.name">
              <div class="activity-item" :class="{'big-item' : item.endTime}">
                <div class="item-container">
                  <div class="service-content">
                    <img class="item-left" :src="item.image_url" mode="aspectFill"/>
                    <div class="item-right">
                      <div class="right-title">{{item.name}}</div>
                      <div class="right-down">
                        <div class="down-left">
                          <p class="down-txt"><span class="first-txt">库存: {{item.stock}}</span></p>
                          <p class="down-txt second">
                            <span class="first-txt">售价: <i class="small"></i><span class="red-price">¥{{item.price || item.bottom_price}}</span></span>
                            <span class="original-price">原价: {{item.goods_price}}</span>
                          </p>
                        </div>
                        <div class="down-right">
                          <div class="down-right-icon" :class="item.showEdit ? 'active' : ''" @click.stop="showEditor(item)"></div>
                        </div>
                      </div>
                    </div>
                    <div class="editor-box" :class="item.showEdit ? '' : 'hide'">
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
                  <img v-if="item.type === 2" src="./pic-label_kj@2x.png" alt="" class="activity-type">
                  <img v-if="item.type === 1" src="./pic-label_pt@2x.png" alt="" class="activity-type">
                  <div class="item-header border-top-1px" v-if="item.endTime">
                    <div class="activity-time">距开始
                      <p v-if="item.endTime && item.endTime.day && item.endTime.day>0" class="date">{{item.endTime.day}}</p><p v-if="item.endTime && item.endTime.day>0">:</p>
                      <p v-if="item.endTime && item.endTime.hour" class="date">{{item.endTime.hour}}</p>:
                      <p v-if="item.endTime && item.endTime.minute" class="date">{{item.endTime.minute}}</p>:
                      <p v-if="item.endTime && item.endTime.second" class="date">{{item.endTime.second}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
            <empty v-if="nothing0 && loaded" :image="empty" :paddingTop="100" tip="暂无活动"></empty>
          </div>
        </div>
        <div class="container-item">
          <div class="list-container">
            <article v-if="downList.length" class="list-item" v-for="(item, index) in downList" :key="item.id + item.name">
              <div class="activity-item" :class="{'big-item' : item.endTime}">
                <div class="item-container">
                  <div class="service-content">
                    <img class="item-left" :src="item.image_url" mode="aspectFill"/>
                    <div class="item-right">
                      <div class="right-title">{{item.name}}</div>
                      <div class="right-down">
                        <div class="down-left">
                          <p class="down-txt"><span class="first-txt">库存: {{item.stock}}</span></p>
                          <p class="down-txt second">
                            <span class="first-txt">售价: <i class="small"></i><span class="red-price">¥{{item.price || item.bottom_price}}</span></span>
                            <span class="original-price">原价: {{item.goods_price}}</span>
                          </p>
                        </div>
                        <div class="down-right">
                          <div class="down-right-icon" :class="item.showEdit ? 'active' : ''" @click.stop="showEditor(item)"></div>
                        </div>
                      </div>
                    </div>
                    <div class="editor-box" :class="item.showEdit ? '' : 'hide'">
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
                  <img v-if="item.type === 2" src="./pic-label_kj@2x.png" alt="" class="activity-type">
                  <img v-if="item.type === 1" src="./pic-label_pt@2x.png" alt="" class="activity-type">
                  <div class="item-header border-top-1px" v-if="item.endTime">
                    <div class="activity-time">距开始
                      <p v-if="item.endTime && item.endTime.day && item.endTime.day>0" class="date">{{item.endTime.day}}</p><p v-if="item.endTime && item.endTime.day>0">:</p>
                      <p v-if="item.endTime && item.endTime.hour" class="date">{{item.endTime.hour}}</p>:
                      <p v-if="item.endTime && item.endTime.minute" class="date">{{item.endTime.minute}}</p>:
                      <p v-if="item.endTime && item.endTime.second" class="date">{{item.endTime.second}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
            <empty v-if="nothing1 && loaded" :image="empty" :paddingTop="100" tip="暂无活动"></empty>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-fill" :style="{height: statusBarHeight > 20 ? '100px':'80px'}"></div>
    <div class="footer-box" :style="{height: statusBarHeight > 20 ? '84px' : '64px'}">
      <div class="footer-btn" @click="toDetail('new')">新建活动</div>
    </div>
    <popup popUpType="confirm" :tip="popTip" :showPopup.sync="showPopup" @confirm="modalConfirm"></popup>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  // import ActivityItem from './activity-item/activity-item'
  import Empty from '@components/empty/empty'
  import Popup from '@components/popup/popup'

  const PAGE_NAME = 'ACTIVITY'

  const TABS = [
    {txt: '已上架', id: 0, list: 'upList'},
    {txt: '已下架', id: 1, list: 'downList'}
  ]
  const TABSNUM = ['online_count', 'offline_count']

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      // ActivityItem,
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
        temporaryItem: {}, // 缓存需要处理的item
        temporaryType: '',
        showPopup: false,
        popTip: '',
        noMore: false,
        pageType: 1, // 1拼团 2砍价 3分享赚钱
        headerTop: 20,
        activityName: '拼团活动管理',
        loaded: false,
        isFirstLoad: true
      }
    },
    onLoad(options) {
      let res = mpvue.getSystemInfoSync()
      this.headerTop = res.statusBarHeight + 44 || 20
      this.pageType = +options.type || 1
      this.activityName = this.pageType === 1 ? '拼团活动管理' : '砍价活动管理'
    },
    onShow() {
      this._getActivityList()
      this.getActivityCount()
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
      handleShowEdit(item) {
        console.log(item)
        item.showEdit = !item.showEdit
      },
      getDiffer(differ) {
        let day = Math.floor(differ / (60 * 60 * 24))
        day = day >= 10 ? day : '0' + day
        let hour = Math.floor(differ / (60 * 60)) - (day * 24)
        hour = hour >= 10 ? hour : '0' + hour
        let minute = Math.floor(differ / 60) - (day * 24 * 60) - (hour * 60)
        minute = minute >= 10 ? minute : '0' + minute
        let second = Math.floor(differ) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
        second = second >= 10 ? second : '0' + second
        let times
        if (differ > 0) {
          times = {
            day,
            hour,
            minute,
            second
          }
        } else {
          times = {
            day: '00',
            hour: '00',
            minute: '00',
            second: '00'
          }
        }
        return {times, differ}
      },
      _timeRun() {
        const key = `${this.tabList[this.tabIdx].list}`
        this[key] = this[key].map(item => {
          let startAt = ((new Date(item.start_at).getTime()) - Date.now()) / 1000
          const {times, differ} = this.getDiffer(startAt)
          item.endTime = differ > 0 ? times : null
          return item
        })
        let arr = []
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this[key] = this[key].map((item, index) => {
            let startAt = ((new Date(item.start_at).getTime()) - Date.now()) / 1000
            const {times, differ} = this.getDiffer(startAt)
            item.endTime = differ > 0 ? times : null
            arr[index] = differ
            return item
          })
          if (!arr.length || arr.every(val => val <= 0)) {
            clearInterval(this.timer)
            arr = []
          }
        }, 1000)
      },
      _getActivityList() {
        let data = {
          page: this.page,
          status: this.tabIdx ? 0 : 1,
          type: this.pageType
        }
        API.Activity.getActivityList({data, loading: this.isFirstLoad})
          .then((res) => {
            this.$wechat.hideLoading()
            const key = `${this.tabList[this.tabIdx].list}`
            const arr = res.data.map(item => {
              item.showEdit = false
              return item
            })
            this.$set(this, key, arr)
            this.loaded = true
            if (!res.data.length) {
              this.noMore = true
              this[`nothing${this.tabIdx}`] = true
            } else {
              this.noMore = false
              this[`nothing${this.tabIdx}`] = false
            }
            this._timeRun()
          })
          .catch((e) => {
            console.error(e)
            this.$wechat.hideLoading()
          })
        this.isFirstLoad = false
      },
      getActivityCount() {
        API.Activity.getActivityCount({data: {type: this.pageType}})
          .then((res) => {
            this._setTabNum(res.data)
          })
      },
      _setTabNum(data) {
        this.numObj = {
          offline_count: data[0].statistic,
          online_count: data[1].statistic
        }
      },
      changeTab(idx) {
        this.tabIdx = idx * 1
        this._initAny()
        this._initAll()
        this._getActivityList()
        // wx.pageScrollTo({scrollTop: 0, duration: 0})
      },
      modalConfirm() {
        if (!this.temporaryItem.id) return
        switch (this.temporaryType) {
          case 'down':
            this._activityDown(this.temporaryItem)
            break
          case 'del':
            this._activityDel(this.temporaryItem)
            break
        }
      },
      showEditor(item) {
        this[`${this.tabList[this.tabIdx].list}`] = this[`${this.tabList[this.tabIdx].list}`].map((activity) => {
          if (+item.id === +activity.id) {
            activity.showEdit = !activity.showEdit
          } else {
            activity.showEdit = false
          }
          return activity
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
        this.popTip = '确定下架该活动吗？'
      },
      _activityDown(item) {
        let data = {
          id: item.id,
          type: this.pageType,
          status: 0
        }
        API.Activity.activityUpDown({ data }).then((res) => {
          this.$wechat.showToast('操作成功')
          this.numObj[this.tabsNumArr[0]]--
          this.numObj[this.tabsNumArr[1]]++
          this[`${this.tabList[this.tabIdx].list}`] = this[`${this.tabList[this.tabIdx].list}`].filter((activity) => {
            return +activity.id !== +item.id
          })
          if (!this[`${this.tabList[this.tabIdx].list}`].length) {
            this[`nothing${this.tabIdx}`] = true
          }
        })
          .catch(() => {
            this._initAll()
          })
      },
      itemDelete(item) {
        this.temporaryItem = item
        this.temporaryType = 'del'
        this.showPopup = true
        this.popTip = '确定删除该活动吗？'
      },
      _activityDel(item) {
        let data = {
          id: item.id,
          type: this.pageType
        }
        API.Activity.activityDel({ data }).then((res) => {
          this.$wechat.showToast('操作成功')
          this.numObj[this.tabsNumArr[1]]--
          this[`${this.tabList[this.tabIdx].list}`] = this[`${this.tabList[this.tabIdx].list}`].filter((activity) => {
            return +activity.id !== +item.id
          })
          if (!this[`${this.tabList[this.tabIdx].list}`].length) {
            this[`nothing${this.tabIdx}`] = true
          }
        })
          .catch(() => {
            this._initAll()
          })
      },
      toDetail(type, id = '') {
        this._initAll()
        // 砍价类型为4
        let pageType = this.pageType
        if (this.pageType === 4) {
          pageType = 2
        }
        let url = `/package-active/activity-edit?type=${type}&id=${id}&pageType=${pageType}`
        wx.navigateTo({ url })
      },
      _initAll() {
        for (let i = 0; i < 2; i++) {
          this[`${this.tabList[i].list}`] = this[`${this.tabList[i].list}`].map((activity) => {
            activity.showEdit = false
            return activity
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
          status: this.tabIdx ? 0 : 1,
          type: this.pageType
        }
        API.Activity.getActivityList({data, loading: false}).then((res) => {
          if (!res.data.length) {
            this.noMore = true
            this.page--
          } else {
            const arr = res.data.map(item => {
              item.showEdit = false
              return item
            })
            this[`${this.tabList[this.tabIdx].list}`] = [...this[`${this.tabList[this.tabIdx].list}`], ...arr]
          }
          this._timeRun()
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/footer-box.styl"

  .activity
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

  .activity-item
    width: 100%
    padding-top: 100px
    height: 0
    background: $color-white
    border-1px($color-line, 2px)
    position: relative
    .item-container
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      box-sizing: border-box
      padding: 0 10px

    .item-header
      width: 100%
      height: 31%
      display: flex
      align-items: center
      justify-content: space-between
      .activity-time
        font-size: 14px
        display: flex
        align-items: center
        color: $color-text-main
        .date
          width: 18px
          height: 18px
          line-height: 18px
          text-align: center
          background: #17273A
          border-radius: 2px
          margin: 0 2px
          font-size: $font-size-10
          color: $color-white
          &:first-child
            min-width: 12px
            text-align: center
            margin-left: 4px
            width: auto
            padding: 0 3px
    .activity-type
      width: 10vw
      height: 10vw
      position: absolute
      left: -2px
      top: -1px
    .service-content
      width: 100%
      height: 100%
      box-sizing: border-box
      padding: 15px 0
      display: flex
      align-items: center
      position: relative
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
              overflow: hidden
              text-overflow: ellipsis
              white-space: nowrap
              .small
                font-style: normal
                font-size: 12px
                color: $color-main
                display: inline-block
              .red-price
                color: $color-main
                font-family: $font-family-medium
              .original-price
                color: $color-text-secondary
                font-size: $font-size-12
                opacity: 0.6
                text-decoration: line-through
                margin-left: 10px
            .second
              margin-top: 8px
              color: $color-text-secondary
              font-size: $font-size-14
              display: flex
              align-items: baseline
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
  .big-item
    padding-top: 42%
    .service-content
      height: 69%
</style>
