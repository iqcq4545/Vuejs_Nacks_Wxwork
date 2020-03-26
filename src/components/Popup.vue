<template>
  <div class="mask full" @click="close()">
    <transition name="fade">
      <div v-if="show" class="Popup" @click.stop>
        <div class="head">
          <h3 class="fwb"></h3>
          <a @click="close()" class="close fr">x</a>
        </div>
        <div class="body">
          <table border="0" cellpadding="0" cellspacing="0">
            <tbody v-for="(item,i) in PopupOption.table">
              <tr>
                <th colspan="2">{{item.th}}</th>
              </tr>
              <tr v-for="(itemI,j) in item.td">
                <td>{{itemI.name}}</td>
                <td>{{itemI.value}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="foot">
          <a @click="close()" class="btnsm submit fr">关闭</a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: "Popup",
    props: ["PopupOption"],
    data() {
      return {
        submitStyle: undefined,
        show: false,
        timer: undefined
      };
    },
    mounted() {
      this.show = true;
      document.body.style.overflow = "hidden";
      document.body.setAttribute("overflow", "hidden");
      console.log(this.DetailOption);
    },
    computed: {
      itemValue() {
        return function (key) {
          if (this.DetailOption.value === "string") {
            return key || "--";
          } else {
            return eval("this.DetailOption.data." + key) || "--";
          }
        };
      }
    },
    methods: {
      close() {
        var that = this;
        that.show = false;
        that.$emit("setScroll");
        that.timer = setTimeout(function () {
          that.PopupOption.isShow = false;
          clearTimeout(that.timer);
        }, 250);
      }
    }
  };
</script>
<style src="../css/form.css"></style>

<style scoped src="../css/popup.css"></style>

<style scoped>
  .mask {
    background: rgba(0, 0, 0, 0.25);
  }
</style>