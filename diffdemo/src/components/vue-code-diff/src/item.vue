<template>
  <div ref="tr" class="item" v-html="source.innerHTML"></div>
</template>

<script>
// 解决滚动渲染问题
// 1、组件内渲染时机
// 2、弃用diff2Html ，自行拼装
import hljs from 'highlight.js';
export default {
  name: 'ItemComponent',
  directives: {
    highlight: function (el, binding) {
      console.log(binding.value.timer);
      const blocks = el.querySelectorAll('code');
      binding.value.timer = setTimeout(() => {
        blocks.forEach((block) => {
          hljs.highlightBlock(block);
        });
      }, 1000);
    }
  },
  props: {
    // index: {
    //   type: Number
    // },
    source: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      that: this,
      timer: null
    };
  },
  watch: {
    source(v) {
      v.innerHtml;
    }
  },
  mounted() {
    const el = this.$refs['tr'];
    this.timer = setTimeout(() => {
      const blocks = el.querySelectorAll('code');
      blocks.forEach((block) => {
        hljs.highlightBlock(block);
      });
    }, 0);
  },
  destroyed() {
    clearTimeout(this.timer);
    this.timer = null;
  }
};
</script>
<style lang="scss" scoped>
.item {
  position: relative;
  height: 20px;
  line-height: 20px;
  overflow: hidden; /**fix：文本溢出 */
}
.item:nth-child(1) {
  height: 20px !important;
}

::v-deep .hljs {
  height: 20px !important;
  padding: 0 !important;
}

</style>
