<template>
  <div class="page">
    <form v-if="repairInfo" id="form">
      <div class="info">
        <div class="row">
          <label class="title">{{jobInfo.WorkOrderType.Name.substr(0,2)}}单号 : </label>
          <p class="text">{{jobInfo.SN}}</p>
          <input type="hidden" name="sn" v-model="jobInfo.SN" />
        </div>

        <div class="row">
          <label class="title">工单类型 :</label>
          <p class="text">{{jobInfo.WorkOrderType.Name}}</p>
          <input type="hidden" name="workOrderTypeId" v-model="jobInfo.WorkOrderType.Id" />
        </div>

        <div v-if="jobInfo.WorkOrderType.Id===JobType.repair.Id" class="row">
          <label class="title">设备名称 :</label>
          <p class="text">{{repairInfo.Device.Name}}</p>
        </div>
      </div>

      <div class="container form pb110">

        <div class="wrap">

          <div v-if="jobInfo.WorkOrderType.Id===JobType.repair.Id&&action!=='spare'&&faultList.length" class="section">
            <label class="title">故障类型</label>
            <div class="row bgw">
              <select class="normal" name="faultTypeId">
                <option v-for="(item,i) in faultList" :value="item.Id">{{item.Name}}</option>
              </select>
              <img class="icon" src="@/images/repair_btn_more.png" />
            </div>
          </div>


          <div v-if="action==='spare'" class="section">
            <label class="title">通知主管</label>
            <div class="row bgw">
              <select class="normal" name="managerId">
                <option v-for="(item,i) in supervisor" :value="item.UserId">{{item.UserName}}</option>
              </select>
              <img class="icon" src="@/images/repair_btn_more.png" />
            </div>
          </div>

          <div v-if="jobInfo.WorkOrderType.Id===JobType.check.Id" class="section check">
            <label class="title">点检设备</label>
            <ul class="ul">
              <li v-for="(item,i) in deviceList" :key="i" class="row bgw">
                <p>{{item.Name}}</p>
                <em class="rm fr" @click="checkItem(item.CheckItemList)">点检</em>
              </li>
            </ul>
          </div>

          <div v-if="jobInfo.WorkOrderType.Id===JobType.maintain.Id" class="section check">
            <label class="title">整改设备</label>
            <ul class="ul">
              <li v-for="(item,i) in deviceList" :key="i" class="row bgw">
                <p>{{item.Name}}</p>
              </li>
            </ul>
          </div>

          <div class="section spare list">
            <label class="title">{{action==="spare"?"缺少":"使用"}}备件</label>
            <a class="btnsm" @click="sparePartList()">添加</a>
            <input type="hidden" name="spareDeviceList" v-model="JSON.stringify(spareParts)" />
            <div class="row bgw">
              <ul class="ul">
                <li v-if="!spareParts.length" class="null">
                  备件列表为空，您可以<a class="fn" @click="sparePartList()">新增</a>备件。
                </li>
                <li v-for="(item,i) in spareParts" :key="i">
                  <p>
                    <b>{{item.Name}}</b>
                    <em class="rm fr" @click="remove(i)">删除</em>
                  </p>
                  <p>
                    <span>{{item.Style}}</span>
                    <span class="NumBox fr">
                      <i @click="calc(item,'Nums',-1)">-</i>
                      <input type="number" class="tac" v-model="item.Nums" @change="update(item,'Nums')" />
                      <i @click="calc(item,'Nums',1)">+</i>
                    </span>
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="issue.length>0" class="section issue">
            <label class="title">备注</label>
            <div v-for="(item,i) in issue" :key="i" class="row bgw">
              <label class="lab1">不良事项</label>
              <textarea class="textarea issue" rows="1" v-model="item.Question" placeholder="请简述不良事项"></textarea>
              <a v-if="issue.length>1" class="icon" @click="rmIssue(i)">删除</a>
              <div class="border"></div>
              <label class="lab1">处理情况</label>
              <textarea class="textarea issue" rows="1" v-model="item.DoCase" placeholder="请描述处理情况"></textarea>
            </div>
            <a class="row bgw add btn" @click="addIssue()"><em>+</em>添加</a>
          </div>

          <!-- <a class="submit btn" @click="back()">返 回</a> -->
          <a class="submit btn" @click="check()">提 交</a>
        </div>

      </div>
    </form>

    <Table v-if="TableOption.isShow" :TableOption="TableOption" @TableSearch="sparePartList" @ok="tableok"></Table>
    <modal v-if="modalOption.isShow" :modalOption="modalOption" @checkSubmit="checkSubmit"></modal>

  </div>

</template>

<script>
  import { cookiesValue } from '../../../utils/cookies';
  import { unique, uniqueAdd } from '../../../utils/Array';
  import { JobType } from '../../type';

  import Table from '@/components/Table';
  import modal from "./modal";

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
        action: undefined,
        urgency: [],
        supervisor: [],
        faultList: [],
        JobType: JobType,
        device: {},
        content: undefined,
        repairInfo: undefined,
        deviceList: undefined,
        jobInfo: {},
        spareParts: [],
        TableOption: { isShow: false, data: undefined, selected: undefined, field: undefined, placeholder: "请输入备件名称" },
        modalOption: { isShow: false, data: undefined, animate: { show: false, timer: undefined } },
        pageOption: { index: 1, size: 10, max: 2, keyword: "" },
        issue: [],

      }
    },
    components: {
      Table: Table,
      modal: modal
    },
    created() {
      var that = this;
      that.action = that.$route.query.act;
      window.addEventListener("scroll", function (e) {
        if (((e.target.documentElement.scrollTop || e.target.body.scrollTop) + e.target.documentElement.clientHeight) > (e.target.body.clientHeight - 1)) {
        }
      });
      this.jobInfo = JSON.parse(localStorage.getItem("jobInfo"));
    },
    computed: {

    },
    mounted() {
      this.getFault();
      switch (this.jobInfo.WorkOrderType.Id) {
        case (JobType.repair.Id): {
          if (this.action === "spare") {
            this.getSupervisor();
            setTimeout(() => { document.title = "待备件" }, 1);
          }
          else {
            this.addIssue();
          }
          break;
        }
        case (JobType.check.Id): {
          this.addIssue();
          this.getCheckInfo();
          break;
        }
        case (JobType.maintain.Id): {
          this.addIssue();
          this.getMaintainInfo();
          break;
        }
      }
      this.getUrgency();

      this.$ReqRepair.getRepairInfo({ sn: this.jobInfo.BusinessSN }).then((res) => {
        this.repairInfo = res.data.repairInfo;
      });
    },

    methods: {

      getFault() {
        this.$ReqRepair.getFault().then((res) => {
          this.faultList = res.data.list;
        });
      },

      getSupervisor() {
        this.$ReqJob.getSupervisor({ sn: this.jobInfo.BusinessSN }).then((res) => {
          this.supervisor = res.data.list;
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

      getCheckInfo() {
        this.$ReqCheck.getCheckInfo({ sn: this.jobInfo.BusinessSN }).then((res) => {
          this.deviceList = res.data.checkTask.CheckDeviceList;
          for (var i = 0; i < this.deviceList.length; i++) {
            console.log(this.deviceList[i])
          }
        });
      },

      getMaintainInfo() {
        this.$ReqMaintain.getMaintainInfo({ sn: this.jobInfo.BusinessSN }).then((res) => {
          this.deviceList = res.data.maintainTask.MaintainDeviceList
        });
      },

      checkItem(data) {
        this.modalOption.isShow = true;
        this.modalOption.data = data;
      },

      checkSubmit() {
        var that = this;
        this.Toast({ text: "正在提交", icon: "loading" }, 20000);
        this.$ReqCheck.checkSubmit({ checkItemListStr: JSON.stringify(this.modalOption.data) }).then((res) => {
          this.Toast({ text: res.data.successMsg });
        });
        that.modalOption.animate.show = false;
        that.modalOption.animate.timer = setTimeout(function () {
          that.modalOption.isShow = false;
          clearTimeout(that.modalOption.animate.timer);
        }, 250);
      },

      check() {
        if (this.action === "spare" && !this.spareParts.length) {
          this.Toast({ text: "请选择备件" });
          return false;
        }
        var text = this.action === "spare" ? "确认发送备件单？" : "确认完成" + this.jobInfo.WorkOrderType.Name + "？";
        this.Confirm({ text: text, action: { yes: this.submit } });
      },

      submit() {
        this.Toast({ text: "正在提交", icon: "loading" }, 20000);
        var data = new FormData(document.getElementById("form"));
        switch (this.jobInfo.WorkOrderType.Id) {
          case (JobType.repair.Id): {
            this.repairComplete(data);
            break;
          }
          case (JobType.check.Id): {
            this.checkComplete(data);
            break;
          }
          case (JobType.maintain.Id): {
            this.maintainComplete(data);
            break;
          }
        }
      },

      repairComplete(data) {
        data.append("repairQuestionListStr", JSON.stringify(this.issue));
        if (this.action === "spare") {
          this.$ReqJob.sparePart(data).then((res) => {
            this.completeRes(res);
          });
        }
        else {
          this.$ReqJob.complete(data).then((res) => {
            this.completeRes(res);
          });
        }
      },

      checkComplete(data) {
        data.append("checkQuestionListStr", JSON.stringify(this.issue));
        this.$ReqCheck.complete(data).then((res) => {
          this.completeRes(res);
        });
      },

      maintainComplete(data) {
        data.append("maintainQuestionListStr", JSON.stringify(this.issue));
        this.$ReqMaintain.complete(data).then((res) => {
          this.completeRes(res);
        });
      },

      completeRes(res) {
        if (res.data.result === "error") {
          this.Toast({ text: res.data.errorMsg });
          return false;
        }
        this.Toast({ text: res.data.successMsg }).then(() => {
          history.go(-1);
        });
      },

      sparePartList(opt = { keyword: "", add: 0 }) {
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
        this.$ReqJob.sparePartList({ pageIndex: this.pageOption.index, pageSize: this.pageOption.size, name: opt.keyword }).then((res) => {
          if (res.data.list.length > 0) {
            Array.prototype.push.apply(this.TableOption.data, res.data.list);
            this.pageOption.max = res.data.recordCount / this.pageOption.size;
            this.TableOption.field = {
              dt: { name: "备件名称", value: "Name", class: "input" },
              dd: [
                { name: "型号规格", value: "Style", class: "input" },
                { name: "备件编号", value: "SN", class: "input" },
                { name: "库存数量", value: "StockNum", class: "input" },]
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
        for (var i in ary) {
          ary[i].Nums = 1;
        }
        unique(ary, "SN");
        Array.prototype.push.apply(ary, this.spareParts);
        uniqueAdd(ary, "SN", "Nums");
        this.spareParts = ary;
      },

      remove(i) {
        this.spareParts.splice(i, 1);
      },

      addIssue() {
        var obj = { Question: "", DoCase: "" };
        switch (this.jobInfo.WorkOrderType.Id) {
          case (JobType.repair.Id): {
            break;
          }
          case (JobType.check.Id): {
            obj["CheckTask"] = { SN: this.jobInfo.BusinessSN };
            break;
          }
          case (JobType.maintain.Id): {
            obj["MaintainTaskSN"] = this.jobInfo.BusinessSN;
            break;
          }
        }
        this.issue.push(obj);
      },

      rmIssue(i) {
        this.issue.splice(i, 1);
      },

      update(item, field) {
        item[field] = Math.min(Math.max(parseInt(item[field]), 1), 100);
        this.$forceUpdate();
      },

      calc(item, field, and) {
        item[field] = Math.min(Math.max(parseInt(item[field]) + and, 1), 100);
        this.$forceUpdate();
      },

      back() {
        history.go(-1);
      }
    },
  }
</script>

<style>
  .submit.btn {
    width: 7.5rem;
    line-height: .9rem;
    margin: 0 !important;
    border-radius: 0;

  }

  .form .spare .row {
    margin-top: .10rem
  }

  .form .spare .ul li:first-child {
    border-top: none;
    padding-top: .05rem;
  }

  .form .spare .ul li:last-child {
    padding-bottom: .05rem;
  }

  .form .spare .ul li {
    border-top: 1px #f6f7f8 solid;
  }

  .form .spare .ul li p {
    width: 100%;
    line-height: .40rem;
    font-size: .28rem;
  }

  .form .spare .ul li p:first-child {
    margin: 0 0 .10rem 0;
  }

  .form .spare .ul li p b {
    font-weight: normal;
  }

  .form .spare .ul li p span {
    color: #999;
  }

  .form .spare .ul li em {
    color: #0072ac;
    font-size: .26rem
  }

  .NumBox {}

  .NumBox i,
  .NumBox input {
    width: .4rem;
    line-height: .4rem;
    background: #f6f7f8;
    text-align: center;
    font-size: .26rem;
  }

  .NumBox input {
    width: .5rem;
    padding: 0 .05rem;
    margin: 0 .025rem;
  }

  .form .list .ul li .input.issue {
    border: 1px #eee solid;
    width: 3.6rem;
    border-radius: .05rem;
    line-height: .4rem;
    color: #333;
    margin-right: 0;
    padding: 0 .175rem;

  }

  .form .issue .row {
    margin-top: .10rem;
  }

  .form .issue .icon {
    color: #0072ac;
    font-size: .26rem;
    line-height: .32rem;
    width: auto;
  }

  .form .issue .border {
    width: 6.3rem;
    height: 0;
    border-bottom: 1px #f6f7f8 solid;
    margin: .25rem .3rem;
  }

  .form .add.btn {
    text-align: center;
    line-height: .30rem;
    text-indent: .48rem;
    position: relative;
  }

  .form .add.btn em {
    width: .30rem;
    line-height: .30rem;
    font-size: .24rem;
    border: 1px #0072ac solid;
    border-radius: 50%;
    color: #0072ac;
    margin: -1px 0 0 -.64rem;
    position: absolute;
    top: .25rem;
    left: 50%;
    text-indent: 0;
  }

  .form .check p {
    font-size: .28rem;
    line-height: .28rem;
  }

  .form .check em {
    font-size: .28rem;
    line-height: .28rem;
    color: #0072ac;
  }
</style>
<style src="../../../css/form.css"></style>