<script>
import { createPatch } from "diff";
import * as Diff2Html from "diff2html";
// import hljs from 'highlight.js';
import "highlight.js/styles/googlecode.css";
import "diff2html/bundles/css/diff2html.min.css";
import Item from "./item.vue";
import VirtualList from "vue-virtual-scroll-list";
export default {
  name: "VueCodeDiff",
  props: {
    height: {
      type: String,
      default: "300",
    },
    oldString: {
      type: String,
      default: "",
    },
    newString: {
      type: String,
      default: "",
    },
    context: {
      type: Number,
      default: 5,
    },
    outputFormat: {
      type: String,
      default: "line-by-line",
    },
    drawFileList: {
      type: Boolean,
      defalut: false,
    },
    renderNothingWhenEmpty: {
      type: Boolean,
      default: true,
    },
    diffStyle: {
      type: String,
      default: "word",
    },
    fileName: {
      type: String,
      default: "",
    },
    isShowNoChange: {
      type: Boolean,
      default: false,
    },
    keeps: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      itemComponent: Item,
    };
  },
  computed: {
    html() {
      return this.createdHtml(
        this.oldString,
        this.newString,
        this.context,
        this.outputFormat,
        this.drawFileList,
        this.renderNothingWhenEmpty,
        this.fileName,
        this.isShowNoChange
      );
    },
  },
  watch: {},
  created() {},
  mounted() {
    const eles = this.$refs["codeDiff"].getElementsByClassName("VirtualList");
    Array.from(eles).forEach((ele, index) => {
      ele.addEventListener("scroll", (e) => {
        const otherIndex = [0, 1].filter((i) => i !== index)[0];
        eles[otherIndex].scrollTop = e.target.scrollTop;
      });
    });
  },
  methods: {
    createdHtml(
      oldString,
      newString,
      context,
      outputFormat,
      drawFileList,
      renderNothingWhenEmpty,
      fileName,
      isShowNoChange
    ) {
      function hljs(html) {
        return html.replace(
          /<span class="d2h-code-line-ctn">(.+?)<\/span>/g,
          '<span class="d2h-code-line-ctn"><code>$1</code></span>'
        );
      }

      function trtd2div(html) {
        return html
          .replaceAll(/(<tr|<td)/g, "<div")
          .replaceAll(/(tr>|td>)/g, "div>");
      }
      if (isShowNoChange) {
        oldString = "=================OldString=================\n" + oldString;
        newString = "=================NewString=================\n" + newString;
      }
      const args = [
        fileName,
        oldString,
        newString,
        "",
        "",
        { context: context },
      ];
      const dd = createPatch(...args);
      // diff.js 输出对比后内容
      const outStr = Diff2Html.parse(dd, {
        inputFormat: "diff",
        outputFormat: outputFormat,
        drawFileList: drawFileList,
        matching: "lines",
        renderNothingWhenEmpty: renderNothingWhenEmpty,
      });

      let html = Diff2Html.html(outStr, {
        inputFormat: "json",
        outputFormat: outputFormat,
        drawFileList: drawFileList,
        matching: "lines",
        renderNothingWhenEmpty: renderNothingWhenEmpty,
      });
      html = trtd2div(html);
      return hljs(html);
    },
  },

  render(h) {
    const that = this;
    function findTrs() {
      let i = 0;
      const arr = [];
      const box = document.createElement("div");
      let html = that.html;
      html = html.replaceAll(/<(tr|td|tbody|table)/g, "<div");
      html = html.replaceAll(/\/(tr|td|tbody|table)>/g, "/div>");
      box.innerHTML = html;
      window.html = html;
      while (i < 2) {
        const tbodys = Array.from(box.getElementsByClassName("d2h-diff-tbody"));
        const tbody = tbodys[i];
        const trs = Array.from(tbody.children);
        const trChilds = trs.map((tr, index) => {
          return {
            uid: index + tr.innerHTML.slice(0, 50),
            innerHTML: tr.innerHTML,
          };
        });
        arr.push(trChilds);
        i++;
      }
      return arr;
    }
    const diffTrs = findTrs();
    const mainHtml = h(
      "div",
      {
        class: "d2h-wrapper",
        ref: "codeDiff",
      },
      [
        h(
          "div",
          {
            class: "d2h-file-wrapper",
          },
          [
            h(
              "div",
              {
                class: "d2h-files-diff",
              },
              [
                h("div", { class: "d2h-file-side-diff" }, [
                  h("div", { class: "d2h-code-wrapper" }, [
                    h("div", { class: "d2h-diff-table" }, [
                      h("div", { class: "d2h-diff-tbody" }, [
                        h(VirtualList, {
                          class: "VirtualList",
                          style: {
                            borderRight: "1px solid #f2f2f2",
                            height: "400px",
                            overflowY: "auto",
                          },
                          props: {
                            "data-key": "uid",
                            "data-sources": diffTrs[0],
                            "data-component": this.itemComponent,
                            keeps: this.keeps,
                          },
                        }),
                      ]),
                    ]),
                  ]),
                ]),
                h("div", { class: "d2h-file-side-diff" }, [
                  h("div", { class: "d2h-code-wrapper" }, [
                    h("div", { class: "d2h-diff-table" }, [
                      h("div", { class: "d2h-diff-tbody" }, [
                        h(VirtualList, {
                          class: "VirtualList",
                          style: {
                            height: "400px",
                            borderRight: "1px solid #f2f2f2",
                            overflowY: "auto",
                          },
                          props: {
                            "data-key": "uid",
                            "data-sources": diffTrs[1],
                            "data-component": this.itemComponent,
                            keeps: this.keeps,
                          },
                        }),
                      ]),
                    ]),
                  ]),
                ]),
              ]
            ),
          ]
        ),
      ]
    );
    return h(
      "div",
      {
        attrs: {
          id: "app",
        },
      },
      [h("div", {}, [mainHtml])]
    );
  },
};
</script>

<style scoped>
.VirtualList > div[role="group"] {
  width: max-content;
  min-width: 100%;
}
/* 固定高度 */
/* .d2h-diff-tbody {
  display: block;
  height: 300px;
  overflow-y: scroll;
} */
/* 去除行数绝对定位，一起滚动 */
/* .d2h-code-side-linenumber {
  position: inherit;
} */
/* 取消外部横向滚动条 */
.d2h-file-side-diff {
  overflow-x: hidden;
}

.d2h-code-side-linenumber {
  height: 20px !important;
}

/* .d2h-diff-tbody {
  overflow: hidden;
} */

/* 文本距离行数padding */
/* .d2h-code-side-line {
    padding-left: 1.5em;
} */
/* .d2h-info {
  height: 14px;
} */
.d2h-file-side-diff {
  margin-right: 0;
}

.hljs {
  display: inline-block;
  padding: 0;
  background: transparent !important;
  vertical-align: middle;
  height: 17px;
  overflow: inherit;
}

.d2h-wrapper {
  position: relative;
}

.d2h-wrapper .d2h-file-header {
  display: none;
}

.d2h-wrapper .d2h-files-diff {
  position: relative;
}

.d2h-wrapper .d2h-file-side-diff {
  margin-bottom: -5px;
}

.d2h-wrapper .d2h-files-diff > .d2h-file-side-diff ~ .d2h-file-side-diff {
  /* position: absolute; */
}

.d2h-wrapper .d2h-code-side-emptyplaceholder {
  max-height: 19px;
}

.d2h-wrapper .d2h-code-side-line,
.d2h-wrapper .d2h-code-line {
  display: block;
  width: auto;
}

.d2h-wrapper .d2h-code-side-line.d2h-info {
  height: 18px;
}

.d2h-wrapper .d2h-code-linenumber,
.d2h-code-side-linenumber {
  height: 19px;
}
</style>
