<template>
  <div class="page">
    <div class="list">
      <div v-if="!loading&&(!itemList||!itemList.length)" class="MSG">暂无数据</div>
      <div class="Top bgw">
        <Search :SearchOption="SearchOption" @SearchTop="search"></Search>
        <div class="container tab">
          <ul v-if="statusList" :style="'width:'+tabWidth+'rem;'">
            <li :class="status.id===0&&'on'" @click="changeStatus(0)">全部</li>
            <li v-for="(item,i) in statusList" :key="i" :class="status.id===i+1&&'on'" @click="changeStatus(i+1)">
              {{item.Name}}</li>
          </ul>
        </div>
        <!-- <div class="filter">
          <img src="@/images/arrow_down.png" />
        </div> -->
      </div>

      <div class="container item">
        <div v-for="(item,i) in itemList" :key="i" class="row bgw">
          <div class="top" @click="showDetail(i)">
            <div class="img"><img :src="item.Device.Pic||require('@/images/item_img.jpg')" /></div>
            <dl class="txt">
              <dt>{{item.Device.Name}}</dt>
              <dd>
                <h3>故障原因 :</h3>
                <p>{{item.FaultDesc}}</p>
              </dd>
              <dd>
                <h3>报修时间 :</h3>
                <p>{{item.CreateTime}}</p>
              </dd>
            </dl>
          </div>

          <div class="bot">
            <a v-if="item.Status.Id===statusList[0].Id" class="btn" @click="checkConfirm('cancel',i)">撤销报修</a>
            <a v-if="item.Status.Id===statusList[3].Id" class="btn" @click="checkConfirm('acceptance',i)">验收</a>
            <a class="btn" @click="showProcess(i)">查看流程</a>
          </div>
          <div v-if="!status.id" class="status">
            <p><img src="@/images/status_icon.png" />{{item.Status.Name}}</p>
          </div>

        </div>
      </div>
    </div>
    <Detail v-if="DetailOption.isShow" :DetailOption="DetailOption"></Detail>
  </div>

</template>

<script>
  import Search from '@/components/Search';
  import Detail from '@/components/Detail';

  import { cookiesValue } from '../../../utils/cookies';
  import { sortObj } from '../../../utils/Array';

  export default {
    inject: [/*"reload",*/ "Toast", "Confirm"],
    data() {
      return {
        status: { id: 0, uid: undefined },
        statusStr: undefined,
        statusList: undefined,
        itemList: undefined,
        loading: true,
        SearchOption: {
          keyword: "",
          placeholder: "请输入设备名称"
        },
        DetailOption: {
          isShow: false,
          image: false,
          type: "form",
          title: undefined,
          desc: undefined,
          data: undefined,
          field: undefined,
          value: undefined
        },
        pageOption: {
          index: 1,
          size: 10,
          max: 2
        },
        selected: undefined
      }
    },
    components: {
      Search: Search,
      Detail: Detail
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
      this.init();
      this.getStatus();
      this.getList();
    },

    methods: {
      init() {
        this.itemList = [];
        this.pageOption.index = 1;
        this.pageOption.max = 2;
      },

      getStatus() {
        this.statusStr = "";
        this.$ReqRepair.getStatus({ status: 1 }).then((res) => {
          this.statusList = res.data.list;
          for (var i in this.statusList) {
            this.statusStr += this.statusList[i].Name;
          }
          console.log(this.statusStr);
        })
      },

      changeStatus(i) {
        this.init();
        this.status.id = i;
        this.status.uid = (i === 0 ? "" : this.statusList[i - 1].Id);
        this.getList();
      },

      getList(add = 0) {
        if (this.pageOption.max > this.pageOption.index) {
          this.loading = true;
          this.Toast({ text: "正在加载", icon: "loading" }, 20000);
          this.pageOption.index += add;
          this.$ReqRepair.getList({ pageIndex: this.pageOption.index, pageSize: this.pageOption.size, createrId: cookiesValue("ZT_DevicePlatForm_UserId"), statusId: this.status.uid, deviceName: this.SearchOption.keyword, random: Math.random() }).then((res) => {
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
          cancel: {
            text: "确认撤销设备报修？",
            func: this.postCancel
          },
          acceptance: {
            text: "确认验收通过？",
            func: this.postAcceptance
          }
        }
        this.Confirm({ text: list[act]["text"], action: { yes: list[act]["func"] } });
      },

      postCancel() {
        this.Toast({ text: "正在撤销", icon: "loading" }, 20000);
        this.$ReqRepair.postCancel({ sn: this.itemList[this.selected].SN }).then((res) => {
          this.Toast({ text: res.data.successMsg }).then(() => {
            if (res.data.result === "success") {
              this.init();
              this.getList();
            }
          });
        });

      },

      postAcceptance() {
        this.Toast({ text: "正在验收", icon: "loading" }, 20000);
        this.$ReqRepair.postAcceptance({ sn: this.itemList[this.selected].SN }).then((res) => {
          this.Toast({ text: res.data.successMsg }).then(() => {
            if (res.data.result === "success") {
              this.init();
              this.getList();
            }
          });
        });
      },

      search() {
        this.init();
        this.getList();
      },

      showDetail(i) {
        this.detailInit();

        this.DetailOption.field = [[
          { name: "设备型号", value: "Device.Style", class: "input" },
          { name: "设备编码", value: "Device.AssetSN", class: "input" },
          { name: "设备编号", value: "Device.SN", class: "input" },
          { name: "紧急程度", value: "Level.Name", class: "input" },
          { name: "报修时间", value: "CreateTime", class: "input" },
          { name: "状态", value: "Status.Name", class: "input" },
        ]];

        var data = this.itemList[i];
        this.DetailOption.title = data.Device.Name;
        this.DetailOption.desc = data.FaultDesc;
        this.DetailOption.image = data.Device.Pic || true;
        this.DetailOption.data = data;
        this.DetailOption.isShow = true;
        this.Toast({}, 0);
      },

      showProcess(i) {
        this.detailInit();
        var data = this.itemList[i];
        this.DetailOption.value = "string";
        this.$ReqRepair.getProcess({ businessSN: this.itemList[i].SN }).then((res) => {
          //res.data.list.sort(sortObj("CreateTime"));
          this.DetailOption.field = [];
          var ary = [];
          for (var i = 0; i < res.data.list.length; i++) {
            var item = res.data.list[i];
            var obj = { name: item.CreateTime, value: item.WorkOrderFlowType.Name + " " + item.Creater.UserName, class: "input" }
            ary.push(obj);
          }
          this.DetailOption.field[0] = ary;

          this.DetailOption.title = data.Device.Name;
          this.DetailOption.isShow = true;
          this.DetailOption.type = "process";

          this.Toast({}, 0);
        });
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
<style>
  .tab {
    width: 6.9rem;
  }
</style>