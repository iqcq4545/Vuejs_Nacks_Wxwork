<template>
  <div class="mask full" @click="no()">
    <transition name="fade">
      <div v-if="show" class="Confirm" @click.stop="">
        <p>{{ConfirmOption.text}}</p>
        <ul>
          <li class="yes" @click="yes()">确认</li>
          <li class="no" @click="no()">取消</li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: "Confirm",
    props: ["ConfirmOption"],
    data() {
      return {
        icon: {
          loading: require("@/images/gear.gif")
        },
        show: false,
        timer: undefined
      }
    },
    mounted() {
      this.show = true;
      document.body.style.overflow = "hidden";
    },
    methods: {
      yes() {
        if (this.ConfirmOption.action.hasOwnProperty("yes")) {
          this.ConfirmOption.action.yes();
        }
        this.close();
      },
      no() {
        if (this.ConfirmOption.action.hasOwnProperty("no")) {
          this.ConfirmOption.action.no();
        }
        this.close();
      },
      close() {
        var that = this;
        that.show = false;
        that.$emit("setScroll");
        that.ConfirmOption.text = undefined;
        that.ConfirmOption.action = undefined;
        that.timer = setTimeout(function () {
          that.ConfirmOption.isShow = false;
          clearTimeout(that.timer);
        }, 250);
      }
    },
  }
</script>

<style scoped>
  .Confirm {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 999;
    float: left;
    width: 5rem;
    border-radius: .1rem;
    background: #fff;
    box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, .15);
    transform: translate(-50%, -50%)
  }

  .Confirm p {
    float: left;
    padding: .5rem .6rem;
    width: 3.8rem;
    font-size: .3rem;
    line-height: .4rem
  }

  .Confirm ul {
    float: left;
    overflow: hidden;
    width: 5rem;
    border-top: .5px #f3f3f3 solid
  }

  .Confirm ul li {
    float: left;
    box-sizing: border-box;
    width: 50%;
    text-align: center;
    font-weight: 700;
    font-size: .28rem;
    line-height: .88rem;
    user-select: none
  }

  .Confirm ul li:first-child {
    border-right: .5px #f3f3f3 solid
  }

  .Confirm ul li.yes {
    color: #06f
  }

  .Confirm ul li.no {
    color: #333
  }

  .Confirm img {
    padding: 0 .1rem;
    width: .38rem;
    height: .38rem;
    object-fit: contain;
    -o-object-fit: contain
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
    opacity: 0;
    transform: translate(-50%, -60%)
  }

  .mask {
    background: rgba(0, 0, 0, .25)
  }
</style>