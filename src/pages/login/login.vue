<template>
  <div class="page">

    <div class="container login">
      <img src="@/images/login_img_logo.png" class="logo" />

      <form id="form" action="javascript:return true" @keyup.enter="submit">
        <div class="wrap">
          <div class="row username">
            <input type="text" placeholder="请输入账号" v-model="username" />
            <img class="icon" src="@/images/login_icon_1.png" />
          </div>
          <div class="row password">
            <input type="password" placeholder="请输入密码" v-model="password" />
            <img class="icon" src="@/images/login_icon_2.png" />
          </div>
          <div class="row">
            <a class="submit" @click="submit()">登　陆</a>
          </div>
        </div>

      </form>
    </div>
  </div>

</template>

<script>
  import md5 from 'js-md5';

  export default {
    inject: [/*"reload",*/ "Toast"],
    data() {
      return {
        username: undefined,
        password: undefined,
        ua: ""
      }
    },
    created() {
      var that = this;
      window.addEventListener("scroll", function (e) {
        if (((e.target.documentElement.scrollTop || e.target.body.scrollTop) + e.target.documentElement.clientHeight) > (e.target.body.clientHeight - 1)) {
        }
      });
    },
    computed: {
    },
    mounted() {
      //alert(document.cookie);
    },
    methods: {
      submit() {
        var data = new FormData();
        if (!this.username || !this.password) {
          this.Toast({ text: "请输入用户名和密码" }, 1000);
          return false;
        }
        data.append("userId", this.username);
        data.append("password", md5(this.password));
        this.Toast({ text: "正在登陆", icon: "loading" }, 20000);

        this.$ReqLogin.userLogin(data).then((res) => {
          if (res.data.result === "error") {
            this.Toast({ text: res.data.errorMsg });
            return false;
          }
          localStorage.setItem("logout", false);
          this.Toast({ text: "登陆成功" }, 1000).then(() => {
            location.replace("index.html");
          });
          //document.cookie = "ZT_DevicePlatForm_UserId=" + this.username;
        });
      },
    },
  }
</script>

<style src="../../css/login.css"></style>