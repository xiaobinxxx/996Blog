// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Global from './tool/Global'
import util from './tool/util'
import GoTop from './components/GoTop/GoTop'

Vue.use(ElementUI);

Vue.config.productionTip = false;
// 原型挂载
Vue.prototype.Global = Global;
Vue.prototype.util = util;

// 全局组件挂载
Vue.component('go-top',GoTop);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
