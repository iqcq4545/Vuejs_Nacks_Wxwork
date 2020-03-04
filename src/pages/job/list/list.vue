<template>
  <div class="page">
    <div class="list">
      <div v-if="!loading&&(!itemList||!itemList.length)" class="MSG">暂无数据</div>
      <div class="Top bgw">
        <Search :SearchOption="SearchOption" @SearchTop="search"></Search>
        <div class="container tab">
          <ul v-if="statusList" :style="'width:'+tabWidth+'rem;'">
            <li v-for="(item,i) in SiderOption.data[1].dd" :class="SiderOption.selected[1].id===i&&'on'"
              @click="changeStatus(i)">{{item.name}}</li>
          </ul>
        </div>
        <div class="filter" @click="showFilter()">
          <img src="@/images/arrow_down.png" />
        </div>
      </div>

      <div class="container item">
        <div v-for="(item,i) in itemList" :key="i" class="row bgw">
          <div class="top" @click="showDetail(i)">
            <div class="img">
              <img v-if="item.WorkOrderType.Name==='维修工单'" src="@/images/list_repair.png" />
              <img v-if="item.WorkOrderType.Name==='点检工单'" src="@/images/list_check.png" />
              <img v-if="item.WorkOrderType.Name==='整改工单'" src="@/images/list_maintain.png" />
            </div>

            <dl class="txt">
              <dt>{{item.Title}}</dt>
              <dd>
                <h3>工单类型 :</h3>
                <p>{{item.WorkOrderType.Name}}</p>
              </dd>
              <dd>
                <h3>报修时间 :</h3>
                <p>{{item.ReceiveTime}}</p>
              </dd>
            </dl>
          </div>

          <div class="bot">
            <a v-if="item.Status.Id===statusList[1].Id" class="btn" @click="checkConfirm('acceptJob',i)">接单</a>
            <a v-if="item.Status.Id===statusList[2].Id&&item.WorkOrderType.Id===JobType.repair.Id" class="btn"
              @click="sparePart(i)">待备件</a>
            <a v-if="item.Status.Id===statusList[2].Id" class="btn" @click="completeRepair(i)">完成</a>
            <a class="btn" @click="showProcess(i)">查看流程</a>
          </div>
          <div v-if="!SiderOption.selected[1].id" class="status">
            <p><img src="@/images/status_icon.png" />{{item.Status.Name}}</p>
          </div>

        </div>
      </div>
    </div>
    <Detail v-if="DetailOption.isShow" :DetailOption="DetailOption" @showPopup="showPopup"></Detail>
    <Popup v-if="PopupOption.isShow" :PopupOption="PopupOption"></Popup>
    <Sider v-if="SiderOption.isShow" :SiderOption="SiderOption" @ok="SiderOk()"></Sider>

  </div>

</template>

<script>
  import Search from "@/components/Search";
  import Detail from "@/components/Detail";
  import Popup from "@/components/Popup";

  import Sider from "@/components/Sider";

  import { cookiesValue } from "../../../utils/cookies";
  import { sortObj } from "../../../utils/Array";
  import { JobType } from "../../type";

  export default {
    inject: [/*"reload",*/ "Toast", "Confirm"],
    data() {
      return {
        statusStr: undefined,
        statusList: undefined,
        JobType: JobType,
        itemList: undefined,
        loading: true,
        selected: undefined,
        SearchOption: {
          keyword: "",
          placeholder: "请输入工单名称"
        },
        pageOption: {
          index: 1,
          size: 10,
          max: 2
        },
        DetailOption: {
          isShow: false,
          image: false,
          type: "form",
          data: undefined,
          field: undefined,
          table: {
            data: undefined,
            field: undefined
          },
          value: undefined
        },
        PopupOption: {
          isShow: false,
          table: undefined,
        },
        SiderOption: {
          isShow: false,
          data: undefined,
          selected: [
            { id: 0, uid: "" },
            { id: 0, uid: "" }
          ]
        }
      }
    },
    components: {
      Search: Search,
      Detail: Detail,
      Popup: Popup,
      Sider: Sider
    },

    created() {
      var that = this;
      window.addEventListener("scroll", function (e) {
        if (((e.target.documentElement.scrollTop || e.target.body.scrollTop) + e.target.documentElement.clientHeight) > (e.target.body.clientHeight - 1)) {
          that.getList(1);
        }
      });
    },
    computed: {
      tabWidth() {
        if (this.statusStr && this.statusList) {
          return this.statusStr.length * .35 + this.statusList.length * .6 + 1.2;
        }
      },
    },

    mounted() {
      var that = this;
      that.init();
      that.getStatus();
      window.onpageshow = function (e) {
        that.getList();
      }
    },

    methods: {
      init() {
        this.itemList = [];
        this.pageOption.index = 1;
        this.pageOption.max = 2;
      },

      getStatus() {
        this.statusStr = "";
        this.$ReqDispatch.getStatus({ status: 1 }).then((res) => {
          this.statusList = res.data.list;
          for (var i in this.statusList) {
            this.statusStr += this.statusList[i].Name;
          }
          this.initSider();
          console.log(this.statusStr);
        })
      },

      initSider() {
        var data = [{
          dt: "工单类型",
          dd: [
            { name: "全部", id: "", on: "on" }]
        }, {
          dt: "工单状态",
          dd: [
            { name: "全部", id: "", on: "on" }]
        }];
        for (var i in JobType) {
          var item = JobType[i];
          data[0].dd.push({ name: item.Name, id: item.Id, on: "" });
        }
        for (var i in this.statusList) {
          var item = this.statusList[i];
          data[1].dd.push({ name: item.Name, id: item.Id, on: "" });
        }
        this.SiderOption.data = data;
      },

      changeStatus(i) {
        this.SiderOption.selected[0].id = 0;
        this.SiderOption.selected[0].uid = "";
        this.SiderOption.selected[1].id = i;
        this.SiderOption.selected[1].uid = this.SiderOption.data[1].dd[i].id;
        this.init();
        this.getList();
      },

      getList(add = 0) {
        if (this.pageOption.max > this.pageOption.index) {
          this.loading = true;
          this.Toast({ text: "正在加载", icon: "loading" }, 20000);
          this.pageOption.index += add;
          this.$ReqDispatch.getList({ pageIndex: this.pageOption.index, pageSize: this.pageOption.size, createrId: cookiesValue("ZT_DevicePlatForm_UserId"), workOrderTypeId: this.SiderOption.selected[0].uid, flag: 0, statusId: this.SiderOption.selected[1].uid, title: this.SearchOption.keyword, random: Math.random() }).then((res) => {
            Array.prototype.push.apply(this.itemList, res.data.list);
            this.pageOption.max = Math.ceil(res.data.recordCount / this.pageOption.size);
            this.Toast({}, 0);
            this.loading = false;
          });
        }
      },

      checkConfirm(act, i) {
        this.selected = i;
        var list = {
          acceptJob: {
            text: "确认接收" + this.itemList[i].WorkOrderType.Name + "？",
            func: this.acceptJob
          },
        }
        this.Confirm({ text: list[act]["text"], action: { yes: list[act]["func"] } });
      },

      acceptJob(sn, typeId) {
        this.Toast({ text: "正在加载", icon: "loading" }, 20000);
        this.$ReqJob.acceptJob({ sn: this.itemList[this.selected].SN, workOrderTypeId: this.itemList[this.selected].WorkOrderType.Id }).then((res) => {
          this.Toast({ text: res.data.successMsg }).then(() => {
            if (res.data.result === "success") {
              this.init();
              this.getList();
            }
          });
        });
      },

      sparePart(i, typeId) {
        localStorage.setItem("jobInfo", JSON.stringify(this.itemList[i]));
        location.assign("form.html?act=spare");
      },

      completeRepair(i) {
        localStorage.setItem("jobInfo", JSON.stringify(this.itemList[i]));
        location.assign("form.html");
      },

      search() {
        this.init();
        this.getList();
      },

      SiderOk() {
        this.init();
        this.getList();
      },

      showDetail(i) {
        this.detailInit();
        switch (this.itemList[i].WorkOrderType.Id) {
          case (JobType.repair.Id): {
            this.itemRepair(i);
            break;
          }
          case (JobType.check.Id): {
            this.itemCheck(i);
            break;
          }
          case (JobType.maintain.Id): {
            this.itemMaintain(i);
            break;
          }
        }
      },

      //维修工单
      itemRepair(i) {
        this.$ReqRepair.getRepairInfo({ sn: this.itemList[i].BusinessSN }).then((res) => {
          var data = this.itemList[i];
          data.repairInfo = res.data.repairInfo;
          this.DetailOption.field = [[
            { name: "工单类型", value: data.WorkOrderType.Name, class: "input" },
            { name: "紧急程度", value: data.Level.Name, class: "input" },
            { name: "状态", value: data.Status.Name, class: "input" },
            { name: "备注", value: data.Remark, class: "input" }], [
            { name: "设备名称", value: data.repairInfo.Device.Name, class: "input" },
            { name: "设备型号", value: data.repairInfo.Device.Style, class: "input" },
            { name: "设备编码", value: data.repairInfo.Device.AssetSN, class: "input" },
            { name: "设备编号", value: data.repairInfo.Device.SN, class: "input" },
            { name: "部门", value: data.repairInfo.Device.Department.Name, class: "input" },
            { name: "报修人", value: data.repairInfo.Creater.UserName, class: "input" },
            { name: "报修时间", value: data.repairInfo.CreateTime, class: "input" },
            { name: "状态", value: data.repairInfo.Status.Name, class: "input" }]];

          this.DetailOption.value = "string";
          this.DetailOption.data = data;
          //this.DetailOption.image = data.Pic || true;
          this.DetailOption.title = data.Title;
          this.DetailOption.desc = data.repairInfo.FaultDesc;

          this.$ReqRepair.sparePartList({ workOrderSN: this.itemList[i].SN }).then((res) => {
            var table = [],
              value = "",
              list = res.data.list;
            for (var i = 0; i < list.length; i++) {
              var tbody = {
                th: list[i].Name,
                td: [
                  { name: "型号", value: list[i].Style },
                  { name: "编号", value: list[i].SN },
                  { name: "数量", value: list[i].Nums }]
              }
              table.push(tbody);
              value += list[i].Name + (i < list.length - 1 ? ", " : "");
            }
            this.DetailOption.field.push([{ name: "使用备件", data: table, value: value, class: "table" }]);

            this.DetailOption.data = data;
            //this.DetailOption.image = data.Pic || true;

            this.DetailOption.isShow = true;
            this.Toast({}, 0);
          });

          this.$ReqRepair.getRepairIssue({ repairSN: this.itemList[i].BusinessSN }).then((res) => {
            var table = [],
              value = "",
              list = res.data.list;
            for (var i = 0; i < list.length; i++) {
              var tbody = {
                th: list[i].Question,
                td: [
                  { name: "处理情况", value: list[i].DoCase },
                ]
              }
              table.push(tbody);
              value += list[i].Question + (i < list.length - 1 ? ", " : "");
            }
            this.DetailOption.field.push([{ name: "问题事项", data: table, value: value, class: "table" }]);

            this.DetailOption.data = data;
            //this.DetailOption.image = data.Pic || true;

            this.DetailOption.isShow = true;
            this.Toast({}, 0);
          });

        });
      },

      //点检工单
      itemCheck(i) {
        this.detailInit();

        var data = this.itemList[i],
          th = "Name";

        this.DetailOption.field = [[{ name: "工单类型", value: data.WorkOrderType.Name, class: "input" },
        { name: "紧急程度", value: data.Level.Name, class: "input" },
        { name: "状态", value: data.Status.Name, class: "input" }]];

        this.DetailOption.table.field = [];

        this.$ReqCheck.getCheckInfo({ sn: this.itemList[i].BusinessSN }).then((res) => {
          var check = res.data.checkTask,
            length = {
              spare: check.CheckSpareDeviceList && check.CheckSpareDeviceList.length,
              issue: check.CheckQuestionList && check.CheckQuestionList.length
            },
            table = { spare: [], issue: [] },
            value = { spare: "", issue: "" };
          var checkList = res.data.checkTask.CheckDeviceList;

          for (var j = 0; j < checkList.length; j++) {
            let table = [],
              value = "",
              checkItem = checkList[j].CheckItemList;
            for (var k = 0; k < checkItem.length; k++) {
              var tbody = {
                th: checkItem[k].Name,
                td: [
                  { name: "部位", value: checkItem[k].Position },
                  { name: "内容", value: checkItem[k].Content },
                  { name: "方法", value: checkItem[k].Way }]
              }
              table.push(tbody);
              value += checkItem[k].Name + (k < checkItem.length - 1 ? ", " : "");
            }
            var ary = [
              { name: "设备名称", value: checkList[j].Name, class: "input" },
              { name: "设备编码", value: checkList[j].AssetSN, class: "input" },
              { name: "设备型号", value: checkList[j].Style, class: "input" },
              { name: "点检标准", value: checkList[j].CheckStandard.Name, class: "input" },
              { name: "点检项目", data: table, value: value, class: "table" }];

            this.DetailOption.field.push(ary);
          }

          for (var i = 0; i < length.spare; i++) {
            var item = check.CheckSpareDeviceList[i];
            table.spare.push({
              th: item.Name,
              td: [
                { name: "编号", value: item.SN },
                { name: "规格型号", value: item.Style },
                { name: "数量", value: item.Nums }]
            });
            value.spare += item.Name + (i < length.spare - 1 ? "，" : "");
          }
          this.DetailOption.field.push([{ name: "设备备件", data: table.spare, value: value.spare, class: "table" }])

          for (var i = 0; i < length.issue; i++) {
            var item = check.CheckQuestionList[i];
            table.issue.push({
              th: item.Question,
              td: [
                { name: "处理情况", value: item.DoCase }]
            });
            value.issue += item.Question + (i < length.issue - 1 ? "，" : "");
          }
          this.DetailOption.field.push([{ name: "问题事项", data: table.issue, value: value.issue, class: "table" }])

          this.DetailOption.title = data.Title;
          data.checkList = check.CheckDeviceList;

          this.DetailOption.value = "string";
          this.DetailOption.isShow = true;

          this.Toast({}, 0);
        });
      },


      //保养工单
      itemMaintain(i) {
        this.detailInit();
        var data = this.itemList[i];

        this.DetailOption.field = [];

        this.$ReqMaintain.getMaintainInfo({ sn: this.itemList[i].BusinessSN }).then((res) => {
          var maintain = res.data.maintainTask,
            length = {
              device: maintain.MaintainDeviceList && maintain.MaintainDeviceList.length,
              spare: maintain.MaintainSpareDeviceList && maintain.MaintainSpareDeviceList.length,
              cost: maintain.MaintainCostList && maintain.MaintainCostList.length,
              issue: maintain.MaintainQuestionList && maintain.MaintainQuestionList.length
            },
            table = { device: [], spare: [], cost: [], issue: [] },
            value = { device: "", spare: "", cost: "", issue: "" };
          for (var i = 0; i < length.device; i++) {
            var item = maintain.MaintainDeviceList[i];
            table.device.push({
              th: item.Name,
              td: [
                { name: "编号", value: item.AssetSN },
                { name: "型号", value: item.Style }]
            });
            value.device += item.Name + (i < length.device - 1 ? "，" : "");

          }
          for (var i = 0; i < length.spare; i++) {
            var item = maintain.MaintainSpareDeviceList[i];
            table.spare.push({
              th: item.Name,
              td: [
                { name: "编号", value: item.SN },
                { name: "规格型号", value: item.Style },
                { name: "数量", value: item.Nums }]
            });
            value.spare += item.Name + (i < length.spare - 1 ? "，" : "");
          }

          for (var i = 0; i < length.cost; i++) {
            var item = maintain.MaintainCostList[i];
            table.cost.push({
              th: item.Name,
              td: [
                { name: "数量", value: item.Nums },
                { name: "总额", value: item.TotalCost }]
            });
            value.cost += item.Name + (i < length.cost - 1 ? "，" : "");
          }

          for (var i = 0; i < length.issue; i++) {
            var item = maintain.MaintainQuestionList[i];
            table.issue.push({
              th: item.Question,
              td: [
                { name: "处理情况", value: item.DoCase }]
            });
            value.issue += item.Question + (i < length.issue - 1 ? "，" : "");
          }

          this.DetailOption.field = [[
            { name: "工单类型", value: data.WorkOrderType.Name, class: "input" },
            { name: "紧急程度", value: data.Level.Name, class: "input" },
            { name: "状态", value: data.Status.Name, class: "input" }], [
            { name: "责任人", value: maintain.DutyMan.UserName, class: "input" },
            { name: "责任部门", value: maintain.DutyMan.Department.Name, class: "input" },
            { name: "开始时间", value: maintain.BeginDate, class: "input" },
            { name: "结束时间", value: maintain.EndDate, class: "input" }], [
            { name: "整改设备", data: table.device, value: value.device, class: "table" },
            { name: "设备备件", data: table.spare, value: value.spare, class: "table" }], [
            { name: "问题事项", data: table.issue, value: value.issue, class: "table" },

            /*{ name: "相关费用", data: table.cost, value: value.cost, class: "table" }*/]];

          this.DetailOption.title = maintain.Name;
          //this.DetailOption.desc = maintain.CreateTime;

          this.DetailOption.value = "string";
          this.DetailOption.isShow = true;

          this.Toast({}, 0);
        });
      },

      showPopup(data) {
        this.PopupOption.table = data;
        this.PopupOption.isShow = true;
      },


      showProcess(i) {
        this.detailInit();
        var data = this.itemList[i];
        this.DetailOption.value = "string";
        this.$ReqDispatch.getProcess({ workOrderSN: this.itemList[i].SN }).then((res) => {
          //res.data.list.sort(sortObj("CreateTime"));
          this.DetailOption.field = [];
          var ary = [];
          for (var i = 0; i < res.data.list.length; i++) {
            var item = res.data.list[i];
            var obj = { name: item.CreateTime, value: item.WorkOrderFlowType.Name + " " + item.Creater.UserName, class: "input" }
            ary.push(obj);
          }
          this.DetailOption.field[0] = ary;

          this.DetailOption.title = data.Title;
          this.DetailOption.isShow = true;
          this.DetailOption.type = "process";

          this.Toast({}, 0);
        });
      },

      showFilter() {
        this.SiderOption.isShow = true;
      },

      detailInit() {
        this.Toast({ text: "正在加载", icon: "loading" }, 20000);
        this.DetailOption.image = false;

        this.DetailOption.type = "form";

        this.DetailOption.title = undefined;
        this.DetailOption.desc = undefined;

        this.DetailOption.data = undefined;
        this.DetailOption.field = [];
        this.DetailOption.value = undefined;
      },

    },
  }
</script>

<style src="../../../css/list.css"></style>