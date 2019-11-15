<template>
  <scroll-view :scroll-into-view="toView" scroll-x="true" scroll-with-animation="true" class="zb-scroll-menu">
    <div class="scroll-menu">
      <div v-for="(item,i) in data" :key="item[valueKey]" :id="'id'+item[valueKey]" class="menu-item name" :class="{active:value===item[valueKey]}" :style="{width:itemWidth+'px'}" @click="changeView(item,i)">
        {{item.name}}
      </div>
      <div :style="{transform:'translateX('+transformX+')'}" class="slider-line-wrap">
        <div class="line-wrap"></div>
      </div>
    </div>
  </scroll-view>

</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'ZB_SCROLL_MENU'

  export default {
    name: COMPONENT_NAME,
    props: {
      data: {
        default: () => {
          return []
        }
      },
      valueKey: {
        default: 'id',
        type: String
      },
      currentView: {
        default: '0',
        type: String
      },
      itemWidth: {
        default: 84,
        type: Number
      },
      viewIndex: {
        default: 0,
        type: Number
      },
      value: {
        default: '',
        type: [String, Number]
      }
    },
    watch: {
      value() {
        // console.log(3333)
        if (!this.data.length) return
        let index = this.data.findIndex(item => item[this.valueKey] === Number(this.value))
        if (index < 0) index = 0
        let newIndex = index < 3 ? 0 : index > this.data.length - 3 ? this.data.length - 1 : index - 2
        this.toView = 'id' + this.data[newIndex][this.valueKey]
        this.transformX = index * this.itemWidth + 'px'
      },
      data() {
        if (!this.data.length) return
        // console.log(555555555, this.data, this.value, this.valueKey)
        let index = this.data.findIndex(item => {
          // console.log(item[this.valueKey], Number(this.value), item)
          return item[this.valueKey] === Number(this.value)
        })
        if (index < 0) index = 0
        // console.log(index)
        let newIndex = index < 3 ? 0 : index > this.data.length - 3 ? this.data.length - 1 : index - 2
        // console.log(newIndex)
        this.toView = 'id' + this.data[newIndex][this.valueKey]
        this.transformX = index * this.itemWidth + 'px'
      }
    },
    mounted() {
      // console.log(1111111111111111)
    },
    data() {
      return {
        toViewValue: null,
        transformX: '0px',
        toView: 'id' + this.viewIndex
      }
    },
    methods: {
      changeView(item, i) {
        // console.log(i, 'i', item, item[this.valueKey])
        this.toViewValue = item[this.valueKey]
        this.$emit('update:value', item[this.valueKey])
        this.$emit('change', this.toViewValue)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .zb-scroll-menu
    background-color $color-white

    .scroll-menu
      display flex
      align-items center
      flex-wrap: no-wrap
      height: 45px
      position relative

      .menu-item
        font-size $font-size-16
        padding: 14px 10px
        box-sizing border-box
        flex-shrink 0
        text-align center
        white-space nowrap
        overflow-x hidden
        text-overflow ellipsis

        &.active
          font-family $font-family-medium

      .slider-line-wrap
        position absolute
        bottom: 0
        padding: 0 27px
        transition all 0.3s

        .line-wrap
          height: 3px
          width: 30px
          border-radius 2px
          background-color $color-money

</style>
