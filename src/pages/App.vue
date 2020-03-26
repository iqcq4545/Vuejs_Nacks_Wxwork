<template>
  <div class="app">
    <router-view></router-view>
    <Tabbar></Tabbar>
    <Toast v-if="ToastOption.isShow" :ToastOption="ToastOption"></Toast>
    <Confirm v-if="ConfirmOption.isShow" :ConfirmOption="ConfirmOption" @setScroll="setScroll"></Confirm>
    <div class="hide">
      <img src="@/images/gear.gif" />
    </div>
  </div>
</template>

<script>
  import Tabbar from "@/components/Tabbar";
  import Toast from "@/components/Toast";
  import Confirm from "@/components/Confirm";



  export default {
    name: "App",
    provide() {
      return {
        reload: this.reload,
        Toast: this.Toast,
        Confirm: this.Confirm
      };
    },
    data() {
      return {
        isReload: true,
        ToastOption: {
          text: undefined,
          icon: undefined,
          timer: undefined,
          isShow: false
        },
        ConfirmOption: {
          text: undefined,
          icon: undefined,
          action: undefined,
          isShow: false
        },
        overflow: undefined,
      };
    },
    components: {
      Tabbar: Tabbar,
      Toast: Toast,
      Confirm: Confirm
    },
    created() { },
    watch: {},
    mounted() {
      window.onresize = function () {
        fontSize();
      };
      if (
        (localStorage.getItem("logout") === "true") &
        (location.pathname.indexOf("login.html") === -1)
      ) {
        var path =
          location.hostname.replace(/\./g, "") > 0
            ? "/login.html"
            : "/web/login.html";
        location.replace(path);
      }
    },
    methods: {
      reload() {
        this.isReload = false;
        this.$nextTick(function () {
          this.isReload = true;
        });
      },
      Toast(option, duration = 2000) {
        var that = this,
          k = ["text", "icon"];
        document.body.style.overflow = "hidden";
        if (duration === 0) {
          that.ToastOption.isShow = false;
          that.setScroll();
          return false;
        }
        return new Promise((reslove, reject) => {
          clearTimeout(that.ToastOption.timer);
          for (var i in k) {
            that.ToastOption[k[i]] = option[k[i]];
          }
          that.ToastOption.isShow = true;
          that.ToastOption.timer = setTimeout(function () {
            that.ToastOption.isShow = false;
            that.setScroll();
            reslove(true);
          }, duration);
        });
      },
      Confirm(option) {
        var that = this,
          k = ["text", "action"];
        for (var i in k) {
          that.ConfirmOption[k[i]] = option[k[i]];
        }
        that.ConfirmOption.isShow = true;
      },

      setScroll() {
        if (document.body.getAttribute("overflow")) {
          document.body.style.overflow = "hideen"
        } else {
          document.body.style.overflow = "";
        }
      }
    }
  };
</script>

<style>
  @import "../css/app.css";
</style>