import 'babel-polyfill';

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueTouch from 'vue-touch'
import config from '@/common/config';
import routes from '@/router/router';
//import store from '@/store';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueTouch, {name: 'v-touch'})

import { ReqLogin } from '../api/login';
import { ReqIndex } from '../api/index';
import { ReqUser } from '../api/user';
import { ReqRepair } from '../api/repair';
import { ReqJob } from '../api/job';
import { ReqDispatch } from '../api/dispatch';
import { ReqCheck } from '../api/check';
import { ReqMaintain } from '../api/maintain';
import { ReqDevice } from '../api/device';
import { ReqTools } from '../api/tools';
import { ReqLibrary } from '../api/library';

import lrz from 'lrz';
import wx from 'weixin-js-sdk';

Vue.prototype.$wx = wx;
Vue.prototype.$lrz = lrz;

Vue.prototype.$ReqLogin = ReqLogin;
Vue.prototype.$ReqIndex = ReqIndex;
Vue.prototype.$ReqUser = ReqUser;
Vue.prototype.$ReqRepair = ReqRepair;
Vue.prototype.$ReqJob = ReqJob;
Vue.prototype.$ReqDispatch = ReqDispatch;
Vue.prototype.$ReqCheck = ReqCheck;
Vue.prototype.$ReqMaintain = ReqMaintain;
Vue.prototype.$ReqDevice = ReqDevice;
Vue.prototype.$ReqTools = ReqTools;
Vue.prototype.$ReqLibrary = ReqLibrary;

Vue.prototype.getViewportSize = function () {
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  };
};

export default {
  init(component) {
    routes.push({
      path: location.pathname,
      component
    });

    const router = new VueRouter({
      mode: config.vueRouterMode,
      routes
    });

    new Vue({
      router,
      //store,
      template: '<App/>',
      components: { App },
      created() {

        if (router.mode === 'hash' && !location.hash) {
          this.$router.push(location.pathname)
        }
      }
    }).$mount('#app');
  }
}
