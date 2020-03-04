<template>
  <div class="page">
    <div class="list">
      <div v-if="!loading&&(!itemList||!itemList.length)" class="MSG">暂无数据</div>
      <div class="Top bgw">
        <Search :SearchOption="SearchOption" @SearchTop="search"></Search>
        <!-- <div class="container tab">
          <ul v-if="statusList" :style="'width:'+tabWidth+'rem;'">
            <li :class="status.id===0&&'on'" @click="changeStatus(0)">全部</li>
            <li v-for="(item,i) in statusList" :key="i" :class="status.id===i+1&&'on'" @click="changeStatus(i+1)">
              {{item.Name}}</li>
          </ul>
        </div> -->

      </div>

      <div class="container item">
        <div v-for="(item,i) in itemList" :key="i" class="row bgw">
          <div class="top" @click="showDetail(i)">
            <div class="img"><img :src="item.Pic||require('@/images/item_img.jpg')" /></div>
            <dl class="txt">
              <dt>
                <em class="statusbg normal" :class="">{{item.DeviceStatus.Name}}</em>{{item.Name}}
              </dt>
              <dd>
                <h3>设备型号 :</h3>
                <p>{{item.Style||"--"}}</p>
              </dd>
              <dd>
                <h3>所属部门 :</h3>
                <p>{{item.Department.Name||"--"}}</p>
              </dd>
            </dl>
          </div>

          <div class="bot">

          </div>

        </div>
      </div>
    </div>
    <Detail v-if="DetailOption.isShow" :DetailOption="DetailOption" @chooseImg="chooseImg"></Detail>
  </div>

</template>

<script>
  import Search from '@/components/Search';
  import Detail from '@/components/Detail';

  import {
    cookiesValue
  } from '../../../utils/cookies';

  import {
    sortObj
  } from '../../../utils/Array';


  export default {
    inject: [/*"reload",*/ "Toast", "Confirm"],
    data() {
      return {
        APPID: "wx4588d46085d5c9c8",
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
          value: undefined,
          maskImg: undefined,
          editable: true
        },
        pageOption: {
          index: 1,
          size: 10,
          max: 2
        },
        selected: undefined,
        lrzResult: undefined
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
      //this.wxjssdkInit();

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

      wxjssdkInit() {
        this.$ReqDevice.signature({ type: 2 }).then((res) => {
          this.$wx.config({
            debug: true,
            appId: this.APPID,
            timestamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            signature: res.data.sign,
            jsApiList: ["chooseImage"]
          });
        });
      },

      chooseImg(e) {
        var that = this,
          files = e.target.files;
        for (var i = 0; i < files.length; i++) {
          that.$lrz(files[i]).then(function (result) {
            that.lrzResult = result;
            that.DetailOption.maskImg = result.base64;
            that.Confirm({ text: "确认上传新的设备图片？", action: { yes: that.updateImg, no: that.noUpdateImg } });
          }).catch((error) => { }).always(() => { });
        }
      },

      updateImg() {
        var that = this;
        that.Toast({ text: "正在上传图片", icon: "loading" }, 20000);
        that.lrzResult.formData.append("pic", 0);
        that.$ReqDevice.uploadImg(that.lrzResult.formData).then((res) => {
          that.Toast({ text: "图片上传完成，正在修改设备图片", icon: "loading" }, 20000);
          that.$ReqDevice.updateImg({ sn: that.DetailOption.data.SN, picName: res.data.maskName }).then((res) => {
            that.Toast({ text: "设备图片修改完成", icon: "loading" }, 2000);
            that.updateList();
          });
        });
      },

      noUpdateImg() {
        this.DetailOption.maskImg = undefined;
      },

      getStatus() {
        this.statusStr = "";
        this.$ReqRepair.getStatus({ status: 1 }).then((res) => {
          this.statusList = res.data.list;
          for (var i in this.statusList) {
            this.statusStr += this.statusList[i].Name;
          }
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
          this.$ReqDevice.getList({ pageIndex: this.pageOption.index, pageSize: this.pageOption.size, name: this.SearchOption.keyword, random: Math.random() }).then((res) => {
            Array.prototype.push.apply(this.itemList, res.data.list);
            this.pageOption.max = Math.ceil(res.data.recordCount / this.pageOption.size);
            this.Toast({}, 0);
            this.loading = false;
          });
        }
      },

      updateList() {
        this.$ReqDevice.getList({ pageIndex: 1, pageSize: this.pageOption.index * this.pageOption.size, name: this.SearchOption.keyword }).then((res) => {
          this.itemList = res.data.list;
        });
      },

      checkCancel(i) {
        this.selected = i;
        this.Confirm({ text: "确认撤销设备报修？", action: { yes: this.getCancel } });
      },

      getCancel() {
        this.Toast({ text: "正在撤销", icon: "loading" }, 20000);
        this.$ReqRepair.getCancel({ sn: this.itemList[this.selected].SN }).then((res) => {
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
        this.selected = i;
        this.detailInit();

        this.DetailOption.field = [
          [{ name: "设备名称", value: "deviceInfo.Name", class: "input" },
          { name: "设备型号", value: "deviceInfo.Style", class: "input" },
          { name: "设备编码", value: "deviceInfo.AssetSN", class: "input" },
          { name: "设备编号", value: "deviceInfo.SN", class: "input" },
          { name: "部门", value: "Department.CascadeName", class: "input" },
          { name: "状态", value: "DeviceStatus.Name", class: "input" }]];
        this.$ReqDevice.getDeviceInfo({ sn: this.itemList[i].SN }).then((res) => {
          var data = this.itemList[i];
          data.deviceInfo = res.data.device;
          this.DetailOption.title = data.Name;
          this.DetailOption.desc = "";
          this.DetailOption.image = data.Pic || true;
          this.DetailOption.data = data;
          this.DetailOption.isShow = true;
          this.Toast({}, 0);
        });

      },

      detailInit() {
        this.Toast({ text: "正在加载", icon: "loading" }, 20000);
        this.DetailOption.image = false;

        this.DetailOption.type = "form";
        this.DetailOption.maskImg = undefined;

        this.DetailOption.title = undefined;
        this.DetailOption.desc = undefined;

        this.DetailOption.data = undefined;
        this.DetailOption.field = [];
        this.DetailOption.value = undefined;
      }
    },
  }
</script>

<style>
  .list .Top {
    height: .7rem !important;
  }

  .list .item {
    margin-top: 1.1rem;
  }
</style>

<style src="../../../css/list.css"></style>