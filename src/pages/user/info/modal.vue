<template>
  <div class="mask full" @click="close()">
    <transition name="fade">
      <div v-if="modalOption.animate.show" class="modal" @click.stop="">
        <div class="head">
          <h3 class="fwb"></h3><a @click="close()" class="close fr">x</a>
        </div>
        <div class="body">
          <table border="0" cellpadding="0" cellspacing="0">
            <tbody>
              <!-- <tr>
                <td>原密码</td>
                <td><input type="password" placeholder="请输入原密码" /></td>
              </tr> -->
              <tr>
                <td>新密码</td>
                <td><input type="password" placeholder="请输入新密码" v-model="modalOption.data.password" /></td>
              </tr>
              <tr>
                <td>确认新密码</td>
                <td><input type="password" placeholder="请再次输入新密码确认" v-model="modalOption.data.password_" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="foot">
          <p>( 两次输入的密码必须相同 )</p><a @click="checkSubmit()" class="submit fr"
            :class="(!modalOption.data.password||!modalOption.data.password_)&&'disable'">提交</a>
        </div>
      </div>
    </transition>
  </div>
</template>

<style>
  .modal {
    z-index: 999;
    float: left;
    box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, .15);
    transform: translate(0, 0);
    width: 7.5rem;
    height: 8rem;
    background: #fff;
    position: absolute;
    bottom: 0;
  }

  .modal .head {
    width: 6.9rem;
    background: #f4f5f5;
    padding: .25rem .30rem;
    border-bottom: 1px #e4e5e5 solid;
    line-height: .3rem;
  }

  .modal .head a.close {
    width: .3rem;
    background: #9ca0b8;
    border-radius: .15rem;
    text-align: center;
    font-size: .24rem;
    color: #fff;
  }

  .modal .body {
    height: 6.5rem;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch
  }

  .modal .foot {
    height: .7rem;
    line-height: .7rem;
    width: 100%;
    border-top: 1px #f6f7f8 solid;
  }

  .modal .foot p {
    line-height: .7rem;
    color: #999;
    margin: 0 0 0 .4rem;
  }

  .modal .foot .submit {
    background: #0072ac;
    color: #fff;
    width: 2rem;
    text-align: center;
    font-size: .26rem;
    border-top: 1px #0072ac solid;
    margin: -1px 0 0 0;
  }

  .fade-enter-active,
  .fade-leave-active {
    -webkit-transition: all .25s ease-out;
    -moz-transition: all .25s ease-out;
    -o-transition: all .25s ease-out;
    transition: all .25s ease-out
  }

  .fade-enter,
  .fade-leave-to {
    /*opacity: 0;*/
    transform: translate(0, 100%);
  }

  .mask {
    background: rgba(0, 0, 0, .25);
  }

  .modal table {
    border-collapse: collapse;
    text-align: left;
    width: 6.9rem;
    margin: .30rem .30rem;
    float: left;
  }

  .modal table th,
  .modal table td {
    border: 1px #f6f7f8 solid;
    line-height: .40rem;
    padding: .1rem .15rem;
    font-size: .26rem;
  }

  .modal table tr td:first-child {
    color: #9ca0b8;
  }

  .modal input[type="checkbox"] {
    margin: 0 .2rem 0 0;
  }

  .modal input[type="text"],
  .modal input[type="password"] {
    width: 100%;
    line-height: .40rem;
  }

  .modal input::-webkit-input-placeholder,
  .modal textarea::-webkit-input-placeholder {
    color: #bbb;
    font-size: .24rem;
    line-height: .40rem;
  }

  .modal input:-moz-placeholder,
  .modal textarea::-webkit-input-placeholder {
    color: #bbb;
    font-size: .24rem;
    line-height: .40rem;
  }

  .modal input:-ms-input-placeholder,
  .modal textarea::-webkit-input-placeholder {
    color: #bbb;
    font-size: .24rem;
    line-height: .40rem;
  }

  .disable {
    border-top-color: #ccc !important;
    background: #ccc !important;
  }
</style>
<script>
  export default {
    name: "modal",
    inject: [/*"reload",*/ "Toast", "Confirm"],
    props: ["modalOption"],
    data() {
      return {
        submitStyle: undefined,
      }
    },
    created() {
      this.modalOption.data = { password: "", password_: "" }
    },
    mounted() {
      document.body.style.overflow = "hidden";
      this.modalOption.animate.show = true;
      console.log(this.DetailOption)
    },
    computed: {

    },
    methods: {
      close() {
        var that = this;
        that.modalOption.animate.show = false;
        document.body.style.overflow = "";
        that.modalOption.animate.timer = setTimeout(function () {
          that.modalOption.isShow = false;
          clearTimeout(that.modalOption.animate.timer);
        }, 250);
      },
      checkSubmit() {
        if (!this.modalOption.data.password || !this.modalOption.data.password_) {
          return false;
        }
        if (this.modalOption.data.password !== this.modalOption.data.password_) {
          this.Toast({ text: "新密码与确认密码不一致" });
          return false;
        }
        this.Confirm({ text: "确认修改密码？", action: { yes: this.submit } });
      },
      submit() {
        this.$emit("checkSubmit");
      }

    },
  }
</script>


<style src="../../../css/form.css"></style>