import vueCodeDiff from './src/index.vue';

/* istanbul ignore next */
vueCodeDiff.install = function (Vue) {
  Vue.component(vueCodeDiff.name, vueCodeDiff);
};

export default vueCodeDiff;
