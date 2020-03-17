<template>
  <div class="page">
    <div class="index">
      <div class="container total" :style="'background: url('+totalbg+') center no-repeat;background-size:100%'">
        <div class="deviceTotal">
          <h3 class="fn">设备总数</h3>
          <p>{{statis.device}}</p>
        </div>
        <ul class="deviceState">
          <li @click="link(statis.dispatch,'dispatch')">
            <h3 class="fn">我的派单</h3>
            <p>{{statis.dispatch}}</p>
          </li>
          <li @click="link(statis.job,'job')">
            <h3 class="fn">我的工单</h3>
            <p>{{statis.job}}</p>
          </li>
          <li @click="link(statis.task,'task')">
            <h3 class="fn">今日任务</h3>
            <p>{{statis.task}}</p>
          </li>
        </ul>
      </div>
      <div class="deviceManage">
        <div class="container bgw">
          <!-- <h3 class="title">设备管理</h3> -->
          <ul v-if="deviceManage.length" style="margin:.10rem 0 .15rem 0;">
            <li v-for="(item,i) in deviceManage" :key="i">
              <a :class="'align'+i%3" :href="dev?filter(item.Url):item.Url">
                <img class="icon" :src="item.Icon">
                <p>{{item.Name}}</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
  import { cookiesValue } from '../../utils/cookies';

  export default {
    name: 'Index',
    inject: [/*"reload",*/ "Toast"],
    data() {
      return {
        dev: false,
        statis: { device: 0, dispatch: 0, job: 0, task: 0 },
        deviceManage: [],
        totalbg: require("@/images/home_bg_img.png")
      }
    },
    created() {
      var that = this;
      that.$route.query.code == 11001 ? that.$router.push({ path: "/register" }) : undefined;
      window.addEventListener("scroll", function (e) {
        if (((e.target.documentElement.scrollTop || e.target.body.scrollTop) + e.target.documentElement.clientHeight) > (e.target.body.clientHeight - 1)) {
        }
      });
    },
    computed: {
    },
    mounted() {
      var that = this;
      window.onpageshow = function (e) {
        that.getStatis();
      }
      that.loading();

      if (location.hostname.replace(/\./g, "") > 0) {
        that.dev = true;
        document.cookie = "ZT_DevicePlatForm_UserId=weixiu";
      }
    },
    methods: {
      loading() {
        this.$ReqIndex.moduleList({ userId: cookiesValue("ZT_DevicePlatForm_UserId") }).then((res) => {
          this.deviceManage = res.data.list;
        });
      },
      getStatis() {
        this.$ReqIndex.getStatis({ receiverId: cookiesValue("ZT_DevicePlatForm_UserId"), random: Math.random() }).then((res) => {
          this.statis.device = res.data.deviceTotalCount;
          this.statis.dispatch = res.data.workOrderCountForDistribute;
          this.statis.job = res.data.myWorkOrderCount;
          this.statis.task = res.data.todayWorkJobCount;
        });
      },
      link(num, str) {
        var url;
        if (num) {
          switch (str) {
            case ("dispatch"): {
              url = "dispatch/list.html";
              break;
            }
            case ("job"): {
              url = "job/list.html";
              break;
            }
            case ("task"): {
              url = "tools/calendar.html";
              break;
            }
          }
          location.assign(url);
        }
      },

      /* DEV */
      filter(url) {
        return url.substr(url.indexOf("/web") + 4);
      }
    }
  }
</script>

<style scope>
  @import "../../css/index.css";
</style>