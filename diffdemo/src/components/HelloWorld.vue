<template>
  <div>
    <div style="display: flex">
      <div style="width: 50%; height: 100%">
        <button @click="generateString">原组件渲染 3k行数据</button>
        <span>{{ "花费:" + time }}</span>
        <code-diff
          :old-string="oldStr"
          outputFormat="side-by-side"
          :new-string="newStr"
          :context="10000"
        />
      </div>
      <div style="width: 50%; height: 100%">
        <button @click="generateString_">
          虚拟列表优化后的组件 渲染3k行数据
        </button>
        <span>{{ "花费:" + time_ }}</span>
        <vue-code-diff
          class="codeDiff"
          :draw-file-list="false"
          :height="400"
          :old-string="oldStr_"
          :new-string="newStr_"
          :context="10000"
          output-format="side-by-side"
        />
      </div>
    </div>
    <br />
    <p>
      虚拟列表的大概原理就是，固定容器的高度和每一行的高度，在滚动时动态的计算应该展示的内容，其他不可见的内容不做渲染，并且动态计算padding的值，使滚动条的长度不发生改变,
      在用户的感官上就像是渲染了全部
    </p>
  </div>
</template>

<script>
import CodeDiff from "vue-code-diff";
import vueCodeDiff from "@/components/vue-code-diff";
export default {
  components: { CodeDiff, vueCodeDiff },
  data() {
    return {
      oldStr: "old code ",
      newStr: "new code",
      oldStr_: "old code",
      newStr_: "new code",
      time: "",
      time_: "",
    };
  },
  methods: {
    generateString() {
      const timeS = new Date().getTime();
      for (let i = 0; i < 3000; i++) {
        this.oldStr += `${i}line \n`;
        this.newStr += `${i + 1}line \n`;
      }
      this.$nextTick(() => {
        this.time = Number(new Date().getTime() - timeS);
      });
    },
    generateString_() {
      const timeS = new Date().getTime();
      for (let i = 0; i < 3000; i++) {
        this.oldStr_ += `${i}line \n`;
      }
      this.$nextTick(() => {
        this.time_ = Number(new Date().getTime() - timeS);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
:deep(.d2h-files-diff) {
  display: block !important;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
