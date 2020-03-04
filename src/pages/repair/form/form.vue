<template>
  <div class="page">

    <div class="container form">
      <div class="tab">
        <ul>
          <li :class="type===0?'on':''" @click="changeType(0)">二维码</li>
          <li :class="type===1?'on':''" @click="changeType(1)">查找</li>
        </ul>
      </div>
      <form id="form">

        <div class="wrap">

          <div v-if="type===1" class="row bgw">
            <label>设备名称</label>
            <p class="input withIcon" :class="!device.Name?'PH':''" @click="deviceList()">{{device.Name||"请选择"}}</p>
            <img class="icon" src="@/images/repair_btn_more.png" />
          </div>

          <div v-if="type===0" class="row bgw">
            <label>设备名称</label>
            <p class="input withIcon" :class="!device.Name?'PH':''" @click="scanQRCode()">{{device.Name||"待扫码"}}</p>
            <img class="icon" src="@/images/repair_btn_scan.png" />
          </div>

          <div class="row bgw">
            <label>设备型号</label>
            <p class="input withIcon" :class="!device.Style?'PH':''">{{device.Style||"--"}}</p>
            <!-- <img class="icon" src="@/images/space.png" @click="getDevice('')" /> -->
          </div>

          <div class="row bgw">
            <label>紧急程度</label>
            <select class="input rtl withIcon" name="levelId">
              <option v-for="(item,i) in urgency" :value="item.Id">{{item.Name}}</option>
            </select>
            <img class="icon" src="@/images/repair_btn_more.png" />
          </div>

          <div class="row bgw">
            <label>故障描述</label>
            <textarea class="textarea" name="faultDesc" rows="4" v-model="content" placeholder="请输入故障描述"></textarea>
          </div>

          <input type="hidden" name="deviceSN" v-model="device.SN" />
          <input type="hidden" name="createrId" v-model="createrId" />
          <!-- <a class="submit btn" @click="back()">返 回</a> -->
          <a class="submit btn" @click="check()">提 交</a>

        </div>
      </form>
    </div>
    <Table v-if="TableOption.isShow" :TableOption="TableOption" @TableSearch="deviceList" @ok="tableok"></Table>

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
  import { cookiesValue } from '../../../utils/cookies';
  import Table from '@/components/Table';

  export default {
    inject: [/*"reload",*/ "Toast", "Confirm"],
    data() {
      return {
        APPID: "wx4588d46085d5c9c8",
        type: 0,
        urgency: [],
        createrId: undefined,
        device: {
          Name: undefined,
          Style: undefined
        },
        content: undefined,
        TableOption: { isShow: false, data: undefined, field: undefined, selected: undefined, single: true, placeholder: "请输入设备名称" },
        pageOption: { index: 1, size: 10, max: 2, keyword: "" },
      }
    },
    components: {
      Table: Table,
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
      this.createrId = cookiesValue("ZT_DevicePlatForm_UserId");
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

      deviceList(opt = { keyword: "", add: 0 }) {
        if (opt.add) {
          this.pageOption.index += 1;
        }
        else {
          this.pageOption.index = 1;
          this.pageOption.max = 2;
          this.TableOption.data = [];
        }
        if (!this.pageOption.max > this.pageOption.index) {
          return false;
        }
        this.Toast({ text: "正在加载", icon: "loading" }, 20000);
        this.$ReqRepair.deviceList({ pageIndex: this.pageOption.index, pageSize: this.pageOption.size, name: opt.keyword }).then((res) => {
          if (res.data.list.length > 0) {
            Array.prototype.push.apply(this.TableOption.data, res.data.list);
            this.pageOption.max = res.data.recordCount / this.pageOption.size;
            this.TableOption.field = {
              dt: { name: "设备名称", value: "Name", class: "input" },
              dd: [
                { name: "设备型号", value: "Style", class: "input" },
                { name: "设备编号", value: "SN", class: "input" }]
            };
            this.$set(this.TableOption.data, 0, this.TableOption.data[0]);
          }
          if (!this.TableOption.isShow) {
            this.TableOption.isShow = true
          }
          this.Toast({}, 0);
        });
      },

      tableok(ary) {
        var that = this;
        that.getDevice(ary[0].SN);
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

      changeType(code) {
        this.type = code;
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

      back() {
        history.go(-1);
      }
    },
  }
</script>

<style src="../../../css/form.css"></style>
<style>
  .form .tab {
    margin: 0 0 0 -.3rem;
    width: 7.5rem;
  }
</style>