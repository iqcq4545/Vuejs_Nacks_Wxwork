<template>
  <div class="page">
    <div class="user">
      <!--v-if="userInfo"-->
      <div class="bg" :style="'background: url('+userbg+') center no-repeat;background-size:100% 100%'">
        您好{{userInfo.UserName ? "，"+userInfo.UserName:""}}
      </div>
      <div class="form2">
        <div class="row bgw" style="margin-top:0">
          <img class="icon" src="@/images/user_icon_1.png" /><label>企业微信号</label>
          <p>{{userInfo.wxUserId||"--"}}</p>
        </div>
        <div class="row bgw"><img class="icon" src="@/images/user_icon_2.png" /><label>平台账号</label>
          <p>{{userInfo.UserId||"--"}}</p>
        </div>
        <!-- <div class="row bgw"><img class="icon" src="@/images/user_icon_3.png" /><label>性别</label>
          <p></p>
        </div> -->
        <div class="row bgw"><img class="icon" src="@/images/user_icon_4.png" /><label>部门</label>
          <p>{{userInfo.Department.Name||"--"}}</p>
        </div>
        <div class="row bgw" @click="changePassword()" style="margin-bottom:0">
          <img class="icon" src="@/images/user_icon_5.png" /><label>修改密码</label>
          <p><img class="icon" src="@/images/repair_btn_more.png" /></p>
        </div>

        <div class="logout row bgw" @click="checkConfirm('logout')">退出登录</div>
      </div>
    </div>
    <modal v-if="modalOption.isShow" :modalOption="modalOption" @checkSubmit="checkSubmit"></modal>

  </div>
</template>

<script>
  import md5 from 'js-md5';
  import { cookiesValue } from '../../../utils/cookies';
  import modal from "./modal";

  export default {
    name: 'Info',
    inject: [/*"reload",*/ "Toast", "Confirm"],
    data() {
      return {
        deviceManage: [],
        userbg: require("@/images/user_bg_img.png"),
        modalOption: { isShow: false, data: undefined, animate: { show: false, timer: undefined } },
        userInfo: {
          wxUserId: "",
          UserName: "",
          UserId: "",
          Department: {
            Name: ""
          }
        },
      }
    },
    components: {
      modal: modal
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
      var cookieUserInfo = cookiesValue("ZT_DevicePlatForm_UserInfo");
      if (cookieUserInfo) {
        var userInfo = JSON.parse(decodeURIComponent(cookieUserInfo));
        this.userInfo.wxUserId = cookiesValue("ZT_DevicePlatForm_WxUserId");
        this.userInfo.UserName = userInfo.UserName;
        this.userInfo.UserId = userInfo.UserId;
        this.userInfo.Department.Name = userInfo.Department.Name;
      }
      else {
        this.Toast({ text: "用户信息获取失败" });
      }
    },
    methods: {
      filter(url) {
        return (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? url.substr(28) : url;
      },
      changePassword() {
        this.modalOption.isShow = true;
      },

      checkConfirm(act) {
        var list = {
          logout: {
            text: "确认退出登录？",
            func: this.logout
          }
        }
        this.Confirm({ text: list[act]["text"], action: { yes: list[act]["func"] } });
      },

      logout() {
        this.$ReqUser.logout().then((res) => {
          //this.Toast({ text: res.data.successMsg }).then(() => {
          var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
          if (keys) {
            for (var i = keys.length; i--;) {
              document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
            }
          }
          localStorage.clear();
          localStorage.setItem("logout", true);
          setTimeout(() => {
            history.go(-1);
            //location.replace("../login.html");
            WeixinJSBridge.call("closeWindow");
          }, 500);
        });
        //});
      },

      checkSubmit() {
        var that = this;
        this.Toast({ text: "正在提交", icon: "loading" }, 20000);
        this.$ReqUser.postPassword({ userId: that.userInfo.UserId, password: md5(that.modalOption.data.password) }).then((res) => {
          this.Toast({ text: res.data.successMsg });
        });
        that.modalOption.animate.show = false;
        that.modalOption.animate.timer = setTimeout(function () {
          that.modalOption.isShow = false;
          clearTimeout(that.modalOption.animate.timer);
        }, 250);
      },
    },
  }
</script>

<style>
  .user {
    width: 7.5rem;
  }

  .bg {
    width: 7.5rem;
    height: 3.49rem;
    border-bottom: 1px #eee solid;
  }

  .bg {
    line-height: 3.49rem;
    color: #fff;
    font-size: .5rem;
    text-align: center;
  }

  .form2 {
    margin: .2rem 0;
    width: 7.5rem;
  }

  .user .form2 .row {
    height: .28rem;
    padding: .28rem .3rem;
    margin: .05rem 0;
    font-size: .28rem;
    line-height: .28rem;
    border: 1px #eee solid;
    border-left: none;
    border-right: none;

  }

  .form2 .icon {
    height: .26rem;
    position: absolute;
    padding: .01rem;
  }

  .form2 .row label {
    color: #9ca0b8;
    margin: 0 0 0 .6rem;
    font-size: .28rem;
    line-height: .28rem;
  }

  .form2 .row p {
    font-size: .28rem;
    line-height: .28rem;
    float: right;
  }

  .form2 .row p img {
    position: relative;
    float: right;
  }

  .user .form2 .logout {
    color: #e54545;
    text-align: center;
    margin: .2rem 0 0 0;
  }


  /*@import "../../../css/user.css";*/
</style>