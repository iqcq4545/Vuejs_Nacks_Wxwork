<template>
  <div class="mask full" @click="close()">
    <transition name="fade">
      <div v-if="modalOption.animate.show" class="Popup" @click.stop="">
        <div class="head">
          <h3 class="fwb"></h3><a @click="close()" class="close fr">x</a>
        </div>
        <div class="body">
          <table border="0" cellpadding="0" cellspacing="0">
            <tbody v-for="(item,i) in modalOption.data">
              <tr>
                <th colspan="2">{{item.Name}}</th>
              </tr>
              <tr>
                <td>部位</td>
                <td>{{item.Position}}</td>
              </tr>
              <tr>
                <td>内容</td>
                <td>{{item.Content}}</td>
              </tr>
              <tr>
                <td>方法</td>
                <td>{{item.Way}}</td>
              </tr>
              <tr>
                <td>周期</td>
                <td><input type="text" v-model="item.CheckResult.Cycle" placeholder="请输入周期" /></td>
              </tr>
              <tr>
                <td>备注</td>
                <td><input type="text" v-model="item.CheckResult.Remark" placeholder="请输入备注" /></td>
              </tr>
              <tr>
                <td>结果</td>
                <td>
                  <label v-for="(res,j) in ['正常','异常']" class="radio" :class="item.CheckResult.Result===~j+2&&'on'">
                    <input type="radio" :name="'result'+i" :value="~j+2" v-model="item.CheckResult.Result">{{res}}
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="foot bgw">
          <a @click="checkSubmit()" class="btnsm submit fr">提交</a>
          <a @click="close()" class="btnsm fr">关闭</a>
        </div>
      </div>
    </transition>
  </div>
</template>


<script>
  export default {
    name: "modal",
    props: ["modalOption"],
    data() {
      return {
        submitStyle: undefined,
      }
    },
    mounted() {
      document.body.style.overflow = "hidden";
      this.modalOption.animate.show = true;
      console.log(this.DetailOption)
    },
    computed: {
      itemValue() {
        return function (key) {
          if (this.DetailOption.value === 'string') {
            return key || "--";
          }
          else {
            return eval("this.DetailOption.data." + key) || "--";
          }
        }
      }
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
        for (var i = 0; i < this.modalOption.data.length; i++) {
          var item = this.modalOption.data[i];
          item.CheckResult.Result = ~~item.CheckResult.Result;
        }
        this.$emit("checkSubmit");
      },

    },
  }
</script>

<style src="../../../css/form.css"></style>

<style scoped src="../../../css/popup.css"></style>

<style scoped>
  .mask {
    background: rgba(0, 0, 0, .25)
  }

  .radio {
    margin: 0 .30rem 0 0;
    color: #bbb;
  }

  .radio.on {
    color: #000;
  }

  .radio input {
    margin: -.06rem .06rem 0 0;
  }
</style>