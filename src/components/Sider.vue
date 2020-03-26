<template>
  <div class="mask full" @click="close()">
    <transition name="fade">
      <div v-if="show" class="Sider" @click.stop="">

        <dl v-for="(item,i) in SiderOption.data" class="col bgw">
          <dt>{{item.dt}}</dt>
          <dd v-for="(dd,j) in item.dd" :class="SiderOption.selected[i].id===j&&'on'" @click="change(i,j)">{{dd.name}}
          </dd>
        </dl>
        <div class="siderBtn">
          <a @click="close()">取消</a>
          <a @click="ok()">确认</a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: "Sider",
    props: ["SiderOption"],
    data() {
      return {
        submitStyle: undefined,
        show: false,
        timer: undefined
      }
    },
    mounted() {
      this.show = true;
      document.body.style.overflow = "hidden";
    },
    computed: {

    },
    methods: {
      change(i, j) {
        var item = this.SiderOption.data[i].dd[j];
        this.SiderOption.selected[i].id = j;
        this.SiderOption.selected[i].uid = item.id;
      },

      close() {
        var that = this;
        that.show = false;
        document.body.style.overflow = "";
        that.timer = setTimeout(function () {
          that.SiderOption.isShow = false;
          clearTimeout(that.timer);
        }, 250);
      },
      ok() {
        this.$emit("ok");
        this.close();
      },
    },
  }
</script>
<style>
  .Sider {
    width: 6.6rem;
    height: 100%;
    position: fixed;
    right: 0;
    top: 0;
    background: #f4f5f5;
  }

  .Sider dl.col {
    width: 100%;
    margin: 0 0 .5rem 0
  }

  .Sider dl.col dt {
    width: 100%;
    line-height: .9rem;
    font-size: .30rem;
    border-bottom: 1px #eee solid;
    text-indent: .3rem;
    margin: 0 0 .3rem 0;
  }

  .Sider dl.col dd {
    width: 1.6rem;
    padding: .1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 0 .3rem .3rem;
    line-height: .4rem;
    font-size: .26rem;
    text-align: center;
    background: #f9f9f9;
    color: #666;
    border-radius: .05rem;
  }

  .Sider dl.col dd.on {
    background: #f2f8fb;
    color: #0072ac
  }

  .siderBtn {
    width: 6.6rem;
    position: fixed;
    bottom: 0;
    right: 0;
    text-align: center;
  }

  .siderBtn a {
    width: 3.3rem;
    box-sizing: border-box;
    line-height: .9rem;
    height: .9rem;
    background: #fff;
    font-size: .3rem;
    border-top: 1px #eee solid;

  }

  .siderBtn a:last-child {
    color: #fff;
    background: #0072ac;
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
    transform: translate(100%, 0)
  }
</style>

<style scoped>
  .mask {
    background: rgba(0, 0, 0, .25)
  }
</style>