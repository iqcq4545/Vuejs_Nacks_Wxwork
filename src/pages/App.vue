<template>
  <div class="app">
    <router-view></router-view>
    <Tabbar></Tabbar>
    <Toast v-if="ToastOption.isShow" :ToastOption="ToastOption"></Toast>
    <Confirm v-if="ConfirmOption.isShow" :ConfirmOption="ConfirmOption"></Confirm>
    <div class="hide">
      <img src="@/images/gear.gif" />
    </div>
  </div>
</template>

<script>
  import Tabbar from '@/components/Tabbar';
  import Toast from '@/components/Toast';
  import Confirm from '@/components/Confirm';

  export default {
    name: 'App',
    provide() {
      return {
        reload: this.reload,
        Toast: this.Toast,
        Confirm: this.Confirm
      }
    },
    data() {
      return {
        isReload: true,
        ToastOption: { text: undefined, icon: undefined, timer: undefined, isShow: false },
        ConfirmOption: { text: undefined, icon: undefined, action: undefined, isShow: false }
      }
    },
    components: {
      Tabbar: Tabbar,
      Toast: Toast,
      Confirm: Confirm
    },
    created() {
    },
    watch: {
    },
    mounted() {
      window.onresize = function () { fontSize(); }
      if (localStorage.getItem("logout") === "true" & location.pathname.indexOf("login.html") === -1) {
        var path = (location.hostname.replace(/\./g, "") > 0) ? "/login.html" : "/web/login.html";
        location.replace(path);
      }
    },
    methods: {
      reload() {
        this.isReload = false;
        this.$nextTick(function () {
          this.isReload = true;
        })
      },
      Toast(option, duration = 2000) {
        var that = this, k = ["text", "icon"];
        if (duration === 0) {
          that.ToastOption.isShow = false;
          document.body.style.overflow = "";
          return false;
        }
        return new Promise((reslove, reject) => {
          clearTimeout(that.ToastOption.timer);
          for (var i in k) {
            that.ToastOption[k[i]] = option[k[i]];
          }
          that.ToastOption.isShow = true;
          document.body.style.overflow = "hidden";
          that.ToastOption.timer = setTimeout(function () { that.ToastOption.isShow = false; document.body.style.overflow = ""; reslove(true); }, duration);
        });
      },
      Confirm(option) {
        var that = this, k = ["text", "action"];
        for (var i in k) {
          that.ConfirmOption[k[i]] = option[k[i]];
        }
        that.ConfirmOption.isShow = true;
        document.body.style.overflow = "hidden";
      }
    }
  }
</script>

<style>
  @import "../css/app.css";
</style>