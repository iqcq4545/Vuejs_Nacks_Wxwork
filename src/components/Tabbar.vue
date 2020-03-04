<template>
  <div v-if="selected" class="Tabbar">
    <ul>
      <li v-for="(item,i) in tabbar.list" :style="'width:'+100/tabbar.list.length+'%'">
        <!-- ​<router-link :to="baseUrl+item.pagePath"> -->
        ​<a :href="baseUrl+item.pagePath">
          <img :src="require('../images/'+(i==selected?item.selectedIconPath:item.iconPath))"></img>
          <p :style="'color:'+(i==selected?tabbar.selectedColor:tabbar.color)">{{item.text}}</p>
        </a>
        <!-- </router-link> -->
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'Tabbar',
    data() {
      return {
        selected: undefined,
        baseUrl: "/web",
        tabbar: {
          color: "#b8b8b8",
          selectedColor: "#3f51b5",
          backgroundColor: "#fff",
          list: [{
            text: "首页",
            pagePath: "/index.html",
            iconPath: "tarbar_icon_1.png",
            selectedIconPath: "tarbar_icon_1_selected.png",
          }, {
            text: "设备台账",
            pagePath: "/device/list.html",
            iconPath: "tarbar_icon_2.png",
            selectedIconPath: "tarbar_icon_2_selected.png",
          }, {
            text: "个人中心",
            pagePath: "/user/info.html",
            iconPath: "tarbar_icon_3.png",
            selectedIconPath: "tarbar_icon_3_selected.png",
          }],
          title: [{
            pagePath: "/repair/list.html",
            text: "我的报修"
          }, {
            pagePath: "/repair/form.html",
            text: "设备报修"
          }, {
            pagePath: "/dispatch/list.html",
            text: "工单派单"
          }, {
            pagePath: "/dispatch/form.html",
            text: "工单派单"
          }, {
            pagePath: "/job/list.html",
            text: "我的工单"
          }, {
            pagePath: "/job/form.html",
            text: "完成工单"
          },
          {
            pagePath: "/device/list.html",
            text: "设备台账"
          }, {
            pagePath: "/spare/list.html",
            text: "备件查询"
          }, {
            pagePath: "/user/message.html",
            text: "消息中心"
          }, {
            pagePath: "/tools/calendar.html",
            text: "工作日历"
          }, {
            pagePath: "/library/knowledge.html",
            text: "设备知识"
          }, {
            pagePath: "/library/experience.html",
            text: "维修经验"
          }, {
            pagePath: "/library/regulation.html",
            text: "规章制度"
          }, {
            pagePath: "/library/document.html",
            text: "设备资料"
          }]
        }
      }
    },
    mounted() {
      (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? this.baseUrl = "" : undefined;
      this.title();
      this.match();
    },
    watch: {
      $route(to, from) {
        this.title();
        this.match();
      }
    },
    methods: {
      title() {
        for (var i in this.tabbar.title) {
          var item = this.tabbar.title[i];
          if (this.$route.path.indexOf(item.pagePath) > -1) {
            return document.title = item.text;
          }
        }
        document.title = "设备管理平台";
      },
      match() {
        console.log(this.$route.path, "this.$route.path");
        for (var i in this.tabbar.list) {
          var item = this.tabbar.list[i]
          if (this.$route.path.indexOf(item.pagePath) > -1) {
            return this.selected = i;
          }
        }
        this.selected = undefined;
      }
    },
  }
</script>