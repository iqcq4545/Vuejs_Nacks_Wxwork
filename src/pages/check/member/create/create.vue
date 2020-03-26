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

          <!-- <div class="row bgw">
            <label>任务名称</label>
            <input type="text" name="name" class="input withIcon" v-model="title" placeholder="请输入任务名称">
          </div> -->

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
            <label>设备编码</label>
            <p class="input withIcon" :class="!device.AssetSN?'PH':''">{{device.AssetSN||"--"}}</p>
          </div>

          <div class="row bgw">
            <label>设备型号</label>
            <p class="input withIcon" :class="!device.Style?'PH':''">{{device.Style||"--"}}</p>
          </div>

          <div class="row bgw" @click="openDate('beginDate')">
            <label>开始日期</label>
            <p class="input withIcon">{{beginDate}}</p>
            <img class="icon" src="@/images/repair_btn_more.png" />
          </div>

          <div class="row bgw" @click="openDate('endDate')">
            <label>结束日期</label>
            <p class="input withIcon">{{endDate}}</p>
            <img class="icon" src="@/images/repair_btn_more.png" />
          </div>

          <!-- <div class="row bgw">
            <label>紧急程度</label>
            <select class="input rtl withIcon" name="levelId">
              <option v-for="(item,i) in urgency" :value="item.Id">{{item.Name}}</option>
            </select>
            <img class="icon" src="@/images/repair_btn_more.png" />
          </div> -->

          <div class="row bgw">
            <label>备注</label>
            <textarea class="textarea" name="remark" rows="4" v-model="content" placeholder="请输入备注"></textarea>
          </div>

          <input type="hidden" name="deviceSN" v-model="device.SN" />
          <input type="hidden" name="userId" v-model="createrId" />
          <input type="hidden" name="beginDate" v-model="beginDate" />
          <input type="hidden" name="endDate" v-model="endDate" />

        </div>
        <!-- <a class="submit btn" @click="back()">返 回</a> -->
        <a class="submit btn" @click="check()">提 交</a>

      </form>
    </div>
    <Table v-if="TableOption.isShow" :TableOption="TableOption" @TableSearch="deviceList" @ok="tableok"></Table>

    <div class="mask full" v-if="DatepickOption.mask" @click="closeDate()">
      <transition name="fade">
        <div class="Datepick" v-if="DatepickOption.isShow" @click.stop>
          <Calendar ref="Calendar" :markDate="DatepickOption.rest" :markDateMore="DatepickOption.arr"
            @isToday="clickToday" @choseDay="clickDay" @changeMonth="clickMonth"></Calendar>
          <div class="btnGroup">
            <a style="color:#0072ac" @click="clickToday()">今天</a>
            <a @click="closeDate()">确认</a>
          </div>
        </div>
      </transition>
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
  import Calendar from "@/components/Calendar";

  import md5 from 'js-md5';
  import { cookiesValue } from '../../../../utils/cookies';
  import Table from '@/components/Table';

  export default {
    inject: [/*"reload",*/ "Toast", "Confirm"],
    data() {
      return {
        APPID: "wx4588d46085d5c9c8",
        type: 0,
        urgency: [],
        createrId: undefined,
        DatepickOption: {
          mask: false,
          isShow: false,
          key: undefined,
          rest: [],
          arr: [],
        },
        teamId: undefined,
        device: {
          Name: undefined,
          AssetSN: undefined,
          Style: undefined
        },
        beginDate: undefined,
        endDate: undefined,
        title: undefined,
        content: undefined,

        TableOption: { isShow: false, data: undefined, field: undefined, selected: undefined, single: true, placeholder: "请输入设备名称/编码" },
        pageOption: { index: 1, size: 10, max: 2, keyword: "" },
      }
    },
    components: {
      Calendar: Calendar,
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

      this.getTeamId();

      this.wxjssdkInit();
      this.getUrgency();

      this.beginDate = this.endDate = this.format();
    },
    methods: {
      format(date = undefined) {
        date = date ? new Date(date) : new Date();
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      },

      clickToday(data) {
        this[this.DatepickOption.key] = this.format();
        this.closeDate();
      },
      clickDay(data) {
        this[this.DatepickOption.key] = data;
      },
      clickMonth(data) {
        console.log("clickDay")
      },

      openDate(key) {
        this.DatepickOption.key = key;
        this.DatepickOption.mask = true;
        this.$nextTick(() => {
          this.DatepickOption.isShow = true;
        });
      },

      closeDate() {
        var that = this;
        that.DatepickOption.isShow = false;
        setTimeout(() => {
          that.DatepickOption.mask = false;
        }, 250);
      },

      wxjssdkInit() {
        this.$ReqRepair.signature({ type: 3 }).then((res) => {
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

      getUrgency() {
        this.$ReqRepair.getUrgency({ status: 1 }).then((res) => {
          this.urgency = res.data.list;
          this.$forceUpdate();
        });
      },

      getTeamId() {
        this.$ReqDevice.getTeamId({ userId: this.createrId }).then((res) => {
          this.teamId = res.data.repairGroup.Id;
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
        this.$ReqCheck.getDeviceList({ pageIndex: this.pageOption.index, pageSize: this.pageOption.size, repairGroupId: this.teamId, name: opt.keyword }).then((res) => {
          var list = res.data.list;
          for (var i = 0; i < list.length; i++) {
            list[i].disable = (!list[i].CheckStandard ? "disable" : "");
          }
          if (list.length > 0) {
            Array.prototype.push.apply(this.TableOption.data, list);
            this.pageOption.max = res.data.recordCount / this.pageOption.size;
            this.TableOption.field = {
              dt: { name: "设备名称", value: "Name", class: "input" },
              dd: [
                { name: "设备编码", value: "AssetSN", class: "input" },
                { name: "设备型号", value: "Style", class: "input" },
                { name: "设备编号", value: "SN", class: "input" }]
            };
            this.$set(this.TableOption.data, 0, this.TableOption.data[0]);
          }
          if (!this.TableOption.isShow) {
            this.TableOption.isShow = true;
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
        this.$ReqCheck.submit(data).then((res) => {
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

<style src="../../../../css/form.css"></style>
<style>
  .Datepick {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    background: #fff;
    min-height: 7.72rem;
  }

  .Datepick .btnGroup {
    border-top: 1px #f6f7f8 solid;
    width: 6.9rem;
    margin: 0 .3rem;
    position: absolute;
    bottom: 0;
  }

  .Datepick .btnGroup a {
    width: 50%;
    float: left;
    line-height: .8rem;
    text-align: center;
  }

  .form .tab {
    width: 7.5rem;
  }

  .previewImage {
    position: relative;
    width: 7.06rem
  }

  .form .inner {
    padding: 0 .3rem;
    width: 6.3rem;
  }

  .wrap {
    position: fixed;
    top: .85rem;
    bottom: 1.5rem;
    left: .3rem;
    right: .3rem;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch
  }

  .uploadRate {
    line-height: .32rem;
    position: absolute;
    top: .3rem;
    right: .3rem;
    color: #999;
  }


  .imageBox {
    position: relative;
    margin: .3rem .3rem 0 0;
    width: 1.9rem;
    height: 1.9rem;
    color: #999;
    background: #f6f7f8
  }

  .imageBox .inputImg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 1.9rem;
    height: 1.9rem;
    opacity: 0
  }

  .imageBox .image {
    width: 100%;
    height: 100%
  }

  .imageBox .rmImage {
    position: absolute;
    top: .1rem;
    right: .1rem;
    z-index: 2;
    padding: .1rem;
    width: .3rem;
    height: .3rem;
    border-radius: .05rem;
    background: #363431;
    opacity: .66
  }

  .plus {
    padding: .25rem 0 .1rem 0;
    width: 100%;
    text-align: center;
    font-weight: 100;
    font-size: 1.25rem;
    line-height: 1rem;
  }

  .desc {
    width: 100%;
    text-align: center
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
    /*opacity:0;*/
    transform: translate(0, 100%);
  }
</style>