<template>
  <div class="select-picker" :style="{height: height + 'px'}">
    <div @click="handleToggle">
      <slot name="content"></slot>
    </div>
    <p :style="{height: paddingVertical[0] + 'px'}"></p>
    <picker-view :indicator-sytle="'height:'+singleHeight+'px'"  :style="'height:'+singleHeight*layer+'px;padding:0 '+paddingHorizontal[1]+'px 0 '+paddingHorizontal[0]+'px'" :value="value" @change="bindChange">
      <block v-for="(child,cIdx) in sources" :key="cIdx">
        <picker-view-column>
          <div v-for="(item, itemIndex) in child.list" :key="itemIndex" :style="'height: '+singleHeight+'px ;line-height: '+singleHeight+'px;text-align: center;'">{{item}}{{child.text}}</div>
        </picker-view-column>
      </block>
    </picker-view>
    <p :style="{height: paddingVertical[1] + 'px'}" class="border-bottom-1px"></p>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'SELECT_PICKER'

  const SINGLE_HEIGHT = 34 // 单层最小高度34
  const LAYER = 3
  const PADDING_HEIGHT = 15

  export default {
    name: COMPONENT_NAME,
    props: {
      sources: { // 数据源
        type: Array,
        default: () => []
      },
      value: { // 显示数据源 此处有坑，value如果不传，有时日期会被重置
        type: Array,
        default: () => []
      },
      slotHeight: { // 插槽高度
        type: Number,
        default: 0
      },
      singleHeight: { // 选择器单行高度
        type: Number,
        default: SINGLE_HEIGHT
      },
      layer: { // 选择器行数
        type: Number,
        default: LAYER
      },
      paddingVertical: { // 垂直padding
        type: Array,
        default: () => [PADDING_HEIGHT, PADDING_HEIGHT]
      },
      paddingHorizontal: { // 水平padding
        type: Array,
        default: () => [10, 0]
      },
      disabled: {
        type: String,
        default: false
      }
    },
    data() {
      return {
        height: this.slotHeight
      }
    },
    computed: {
      fullHeight() {
        return this.singleHeight * this.layer + this.slotHeight + this.paddingVertical.reduce((total, num) => total + num)
      }
    },
    onUnload() {
      this.height = this.slotHeight
    },
    methods: {
      bindChange: function(e) {
        let value = JSON.parse(JSON.stringify(e.target.value))
        let source = JSON.parse(JSON.stringify(this.sources))
        let arr = [
          source[0].list[value[0]],
          source[1].list[value[1]],
          source[2].list[value[2]]
        ]
        this.$emit('changePicker', arr, value)
      },
      handleToggle() {
        if (this.disabled) return
        const toOpen = this.height === this.slotHeight
        this.height = toOpen ? this.fullHeight : this.slotHeight
        this.$emit('toggle', toOpen) // true 打开 false 关闭
      },
      closePicker() {
        if (this.disabled) return
        this.height = this.slotHeight
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .select-picker
    width: 100%
    background :#fff
    transition :height 0.3s
    overflow :hidden

</style>
