<template>
  <div class="page">

    <div class="container form">
      <form id="form">
        <div class="wrap">
          <div class="row bgw">
            <label>设备名称</label>
            <p class="input withIcon" :class="!device.Name?'PH':''" @click="scanQRCode()">{{device.Name||"待扫码"}}</p>
            <img class="icon" src="@/images/repair_btn_scan.png" />
          </div>
          <div class="row bgw">
            <label>设备型号</label>
            <p class="input withIcon" :class="!device.Style?'PH':''">{{device.Style||"--"}}</p>
            <img class="icon" src="@/images/space.png" @click="getDevice('TYSB-637103649454643057-6')" />
          </div>
          <div class="row bgw">
            <label>紧急程度</label>
            <select class="input withIcon" name="levelId">
              <option v-for="(item,i) in urgency" :value="item.Id">{{item.Name}}</option>
            </select>
            <img class="icon" src="@/images/repair_btn_more.png" />
          </div>
          <div class="row bgw">
            <label>故障描述</label>
            <textarea class="textarea" name="faultDesc" rows="4" v-model="content" placeholder="请输入故障描述"></textarea>
          </div>
          <input type="hidden" name="deviceSN" v-model="device.SN" />
          <a class="submit btn" @click="check()">提 交</a>

        </div>

      </form>
    </div>

  </div>

</template>

<script>

  /*import {
    recursionData,
    fmtPrice,
    analyTrend,
    addToArray,
    rmFromArray,
    compareArray,
  } from '../utils/util';*/
  import md5 from 'js-md5';


  export default {
    inject: [/*"reload",*/ "Toast", "Confirm"],
    data() {
      return {
        APPID: "wx4588d46085d5c9c8",
        urgency: [],
        device: {
          Name: undefined,
          Style: undefined
        },
        content: undefined
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
      this.wxjssdkInit();
      this.getUrgency();
    },
    methods: {
      wxjssdkInit() {
        this.$ReqRepair.signature({ type: 1 }).then((res) => {
          this.$wx.config({
            // debug: true,
            appId: this.APPID,
            timestamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            signature: res.data.sign,
            jsApiList: ["scanQRCode"]
          });
        });
      },

      scanQRCode() {
        var that = this;
        that.$wx.scanQRCode({
          desc: 'scanQRCode desc',
          needResult: 1,
          scanType: ["qrCode", "barCode"],
          success: function (res) {
            if (res.resultStr) {
              that.getDevice(res.resultStr);
            }
          },
          error: function (res) {
            that.Toast({ text: res });
          }
        });
      },

      getUrgency() {
        this.$ReqRepair.getUrgency({ status: 1 }).then((res) => {
          this.urgency = res.data.list;
          this.$forceUpdate();
        });
      },

      getDevice(sn) {
        this.$ReqRepair.getDevice({ sn: sn }).then((res) => {
          this.device = res.data.device;
        });
      },

      check() {
        if (!this.device.SN) {
          this.Toast({ text: "设备信息不能为空" });
          return false;
        }
        this.Confirm({ text: "确认提交设备报修？", action: { yes: this.submit } })
      },

      submit() {
        this.Toast({ text: "正在提交", icon: "loading" }, 20000);
        var data = new FormData(document.getElementById("form"));
        this.$ReqRepair.submit(data).then((res) => {
          if (res.data.result === "error") {
            this.Toast({ text: res.data.errorMsg });
            return false;
          }
          this.Toast({ text: res.data.successMsg }).then(() => {
            history.go(-1);
          });
        });
      },
    },
  }
</script>

<style src="../../../css/form.css"></style>