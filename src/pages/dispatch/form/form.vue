<template>
  <div class="page">
    <form v-if="repairInfo" id="form">
      <div class="info">
        <div class="row">
          <label class="title">维修单号 : </label>
          <p class="text">{{jobInfo.SN}}</p>
          <input type="hidden" name="sn" v-model="jobInfo.SN" />
        </div>

        <div class="row">
          <label class="title">工单类型 : </label>
          <p class="text">{{jobInfo.WorkOrderType.Name}}</p>
          <input type="hidden" name="workOrderTypeId" v-model="jobInfo.WorkOrderType.Id" />
        </div>

        <div v-if="jobInfo.WorkOrderType.Id===JobType.repair.Id" class="row">
          <label class="title">设备名称 : </label>
          <p class="text">{{repairInfo.Device.Name}}</p>
        </div>
      </div>

      <div class="container form">
        <div class="wrap">

          <div class="row bgw">
            <label>紧急程度</label>
            <select class="input withIcon rtl" name="levelId">
              <option v-for="(item,i) in urgency" :value="item.Id">{{item.Name}}</option>
            </select>
            <img class="icon" src="@/images/repair_btn_more.png" />
          </div>
          <div class="row bgw">
            <label>维修人员</label>
            <select class="input withIcon rtl" name="receiverId">
              <option v-for="(item,i) in workerList" :value="item.UserId">{{item.UserName}}</option>
            </select>
            <img class="icon" src="@/images/repair_btn_more.png" />
          </div>
          <div class="row bgw">
            <label>备注</label>
            <textarea class="textarea" name="remark" rows="4" v-model="content" placeholder="请输入派单备注"></textarea>
          </div>
          <a class="submit btn" @click="check()">提 交</a>

        </div>

      </div>
    </form>

  </div>

</template>

<script>
  import { cookiesValue } from '../../../utils/cookies';
  import { JobType } from '../../type';

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
        JobType: JobType,
        device: {},
        content: undefined,
        repairInfo: undefined,
        jobInfo: {},
        workerList: [],
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
      this.getUrgency();

      this.jobInfo = JSON.parse(localStorage.getItem("jobInfo"));
      this.query = this.$route.query;

      switch (this.jobInfo.WorkOrderType.Id) {
        case (JobType.repair.Id): {
          this.getRepairInfo();
          break;
        }
        case (JobType.check.Id): {
          this.getCheckInfo();
          break;
        }
        case (JobType.maintain.Id): {
          this.getMaintainInfo();
          break;
        }
      }
    },

    methods: {
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

      getRepairInfo() {
        this.$ReqRepair.getRepairInfo({ sn: this.jobInfo.BusinessSN }).then((res) => {
          this.repairInfo = res.data.repairInfo;
          this.getWorkerList();
        });
      },

      getCheckInfo() {
        this.$ReqCheck.getCheckInfo({ sn: this.jobInfo.BusinessSN }).then((res) => {
          this.repairInfo = res.data.checkTask;
          this.getWorkerList();

        });
      },

      getMaintainInfo() {
        this.$ReqMaintain.getMaintainInfo({ sn: this.jobInfo.BusinessSN }).then((res) => {
          this.repairInfo = res.data.maintainTask;
          this.getWorkerList();
        });
      },

      getWorkerList() {
        switch (this.jobInfo.WorkOrderType.Id) {
          case (JobType.repair.Id): {
            this.$ReqDispatch.getWorkerList({ deviceSN: this.repairInfo.Device.SN }).then((res) => {
              this.workerList = res.data.list;
            });
            break;
          }
          case (JobType.check.Id): {
            this.$ReqCheck.getCheckerList({ repairGroupId: this.repairInfo.RepairGroup.Id }).then((res) => {
              this.workerList = res.data.list;
            });
            break;
          }
          case (JobType.maintain.Id): {
            this.$ReqMaintain.getWorkerList({ repairGroupId: this.repairInfo.RepairGroup.Id }).then((res) => {
              this.workerList = res.data.list;
            });
            break;
          }
        }
      },

      check() {
        /*if (!this.device.SN) {
          this.Toast({ text: "设备信息不能为空" });
          return false;
        }*/

        this.Confirm({ text: "确认分派" + this.jobInfo.WorkOrderType.Name + "？", action: { yes: this.submit } });
      },

      submit() {
        this.Toast({ text: "正在提交", icon: "loading" }, 20000);
        var data = new FormData(document.getElementById("form"));
        this.$ReqDispatch.submit(data).then((res) => {
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