<template>
  <div class="page">
    <div class="list">
      <div v-if="!loading&&(!itemList||!itemList.length)" class="MSG">暂无数据</div>
      <div class="Top bgw">
        <Search :SearchOption="SearchOption" @SearchTop="search"></Search>
        <div class="container tab">
          <ul v-if="libList">
            <li v-for="(item,i) in libList" :key="i" :class="tabOn(i)">
              <b @click="link(item.path)" style="font-weight:normal">{{item.name}}</b>
            </li>
          </ul>
        </div>
        <div class="filter" @click="showFilter()">
          <img src="@/images/arrow_down.png" />
        </div>
      </div>

      <div class="container item">
        <div v-for="(item,i) in itemList" :key="i" class="row bgw">
          <div class="top" @click="showContent(i)">
            <div class="img"><img :src="reqIcon(item.FileInfo.Path)" /></div>
            <dl class="txt">
              <dt>
                <img v-if="item.FileInfo.ExtensionName" class="attachment" src="@/images/attachment.png" />{{item.Name}}
              </dt>
              <dd>
                <h3>知识类型 :</h3>
                <p>{{item.KnowledgeType.Name||"--"}}</p>
              </dd>
              <dd>
                <h3>文档附件 :</h3>
                <p>{{item.FileInfo.ExtensionName||"--"}}</p>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <div v-if="ItemOption.isShow" class="content full bgw">

      <div class="form1 head">
        <div class="wrap">
          <p class="title">{{ItemOption.data.Name}}</p>
        </div>
      </div>

      <div class="form1 body">
        <div v-if="ItemOption.data.FileInfo.Name" class="wrap">

          <ul class="libTab bgw fs26">
            <li v-for="(item,i) in tab.list" :key="i" :class="i===tab.current?'on':''" @click="changeTab(i)">
              {{item}}
            </li>
          </ul>
        </div>

        <div class="wrap iframe" :class="tab.current==0?'show':'hide'">
          <div class="row bgw">
            <div v-html="ItemOption.data.Content" class="textarea richText">
            </div>
          </div>
        </div>
      </div>

      <div v-if="ItemOption.data.FileInfo.Name&&fileSupport(ItemOption.data.FileInfo.ExtensionName)" class="iframe"
        :class="tab.current==1?'show':'hide'">
        <!-- <iframe :src="'http://view.officeapps.live.com/op/view.aspx?src='+ItemOption.data.FileInfo.Path"></iframe> -->

        <ul class="attachment bgw">
          <li>
            <a class="" :href="ItemOption.data.FileInfo.Path">
              <img :src="reqIcon(ItemOption.data.FileInfo.Path)" />
              <p>
                <b>{{ItemOption.data.FileInfo.Name}}</b>
                <span>文件类型：{{ItemOption.data.FileInfo.ExtensionName}}文件</span>
              </p>
              <em class="fr">查看</em>
            </a>
          </li>
        </ul>
      </div>
      <a class="submit btn" @click="close()">关 闭</a>
    </div>

    <Sider v-if="SiderOption.isShow" :SiderOption="SiderOption" @ok="SiderOk()"></Sider>

  </div>
</template>

<script>
  import Search from "@/components/Search";
  import Sider from "@/components/Sider";

  import {
    cookiesValue
  } from '../../../utils/cookies';

  export default {
    inject: [/*"reload",*/ "Toast", "Confirm"],
    data() {
      return {
        APPID: "wx4588d46085d5c9c8",
        libList: [{ name: "知识", path: "knowledge.html" }, { name: "经验", path: "experience.html" }, { name: "规章", path: "regulation.html" }, { name: "资料", path: "document.html" }],
        itemList: undefined,
        loading: true,
        SearchOption: {
          keyword: "",
          placeholder: "请输入关键字"
        },
        typeList: [],
        SiderOption: {
          isShow: false,
          data: undefined,
          selected: [
            { id: 0, uid: "" },
          ]
        },
        ItemOption: {
          isShow: false,
          data: undefined
        },
        pageOption: {
          index: 1,
          size: 10,
          max: 2
        },
        selected: undefined,
        lrzResult: undefined,
        icon: {
          txt: require("@/images/icon_txt.png"),
          word: require("@/images/icon_word.png"),
          excel: require("@/images/icon_excel.png"),
          ppt: require("@/images/icon_ppt.png"),
          pdf: require("@/images/icon_pdf.png")
        },
        tab: { list: ["文档内容", "文档附件"], current: 0 },
        fileName: undefined
      }
    },
    components: {
      Search: Search,
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

    },

    mounted() {
      this.init();
      this.getType();
      this.getList();
    },

    methods: {
      init() {
        this.itemList = [];
        this.pageOption.index = 1;
        this.pageOption.max = 2;
      },

      getType() {
        this.$ReqLibrary.knowledgeType().then((res) => {
          this.typeList = res.data.list;
          this.initSider();
        });
      },

      initSider() {
        var data = [{
          dt: "知识类型",
          dd: [
            { name: "全部", id: "", on: "on" }]
        }];

        for (var i in this.typeList) {
          var item = this.typeList[i];
          data[0].dd.push({ name: item.Name, id: item.Id, on: "" });
        }
        this.SiderOption.data = data;
      },

      SiderOk() {
        this.init();
        this.getList();
      },

      changeTab(i) {
        this.tab.current = i;
      },

      tabOn(i) {
        if (this.$route.path.indexOf(this.libList[i].path) > -1) {
          return "on";
        }
      },

      getList(add = 0) {
        if (this.pageOption.max > this.pageOption.index) {
          this.loading = true;
          this.Toast({ text: "正在加载", icon: "loading" }, 20000);
          this.pageOption.index += add;
          this.$ReqLibrary.getKnowledge({ pageIndex: 1, pageSize: this.pageOption.index * this.pageOption.size, knowledgeTypeId: this.SiderOption.selected[0].uid, name: this.SearchOption.keyword }).then((res) => {
            Array.prototype.push.apply(this.itemList, res.data.list);
            this.pageOption.max = Math.ceil(res.data.recordCount / this.pageOption.size);
            this.Toast({}, 0);
            this.loading = false;
          });
        }
      },

      updateList() {
        this.$ReqLibrary.getKnowledge({ pageIndex: 1, pageSize: this.pageOption.index * this.pageOption.size, knowledgeTypeId: this.SiderOption.selected[0].uid, name: this.SearchOption.keyword }).then((res) => {
          this.itemList = res.data.list;
        });
      },

      search() {
        this.init();
        this.getList();
      },

      showFilter() {
        this.SiderOption.isShow = true;
      },

      link(path) {
        location.replace(path);
      },

      showContent(i) {
        this.$ReqLibrary.getKnowledgeById({ id: this.itemList[i].Id }).then((res) => {
          this.ItemOption.data = this.itemList[i];
          this.imgHost(decodeURIComponent(res.data.content).replace(/\+/g, ' '));
          this.ItemOption.isShow = true;
        });
      },

      imgHost(str) {
        this.ItemOption.data.Content = str.replace(/(src=")/g, "$1" + /*location.protocol + "\/\/" + location.hostname*/"http://device.nacks.com:9002");
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
      },

      close() {
        this.ItemOption.isShow = false;
      },

      reqIcon(url) {
        switch (url.split(".").slice(-1)[0]) {
          case "docx": {
            return this.icon.word;
          }
          case "excel": {
            return this.icon.pdf;
          }
          case "pdf": {
            return this.icon.pdf;
          }
          default: {
            return this.icon.txt;
          }
        }
      },

      fileSupport(str) {
        //var list = ["doc", "xls", "pdf"];
        var list = [""];
        for (var i = 0; i < list.length; i++) {
          if (str.indexOf(list[i]) > -1) {
            return true;
          }
        }
        return false;
      }

    },
  }
</script>

<style>
  .list .tab ul {
    width: auto
  }

  .list .tab ul li a {
    color: #9ca0b8
  }

  .list .tab ul li.on a {
    color: #3f51b5;
  }

  .content {
    background: #f4f5f5;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch
  }

  .iframe {
    position: fixed;
    width: 100%;
    left: 0;
    right: 0;
    bottom: 1.05rem;
    top: 2.52rem;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch
  }

  .iframe iframe {
    border: medium none;
    width: 100%;
    height: 100%;
  }

  .submit {
    position: fixed;
    margin-top: .15rem;
    width: 7.5rem;
    font-size: .28rem;
    line-height: .9rem;
  }

  .title {
    width: 100%;
    font-weight: 700;
    font-size: .3rem;
    line-height: .35rem
  }

  /* .body .wrap:last-child {
    margin-bottom: 1.1rem
  } */

  .form1 .wrap.iframe {
    margin-bottom: 0rem;
  }

  .richText {
    margin: .20rem 0 0 0;
  }

  .richText p,
  .richText span {
    font-size: .28rem !important;
    line-height: .48rem !important;
  }

  .richText img {
    margin-top: 5px;
    width: 6.9rem;
  }

  .richText table {
    min-width: 6.9rem;
    border-collapse: collapse;
    border-spacing: 0;
  }

  .richText table th,
  .richText table td {
    padding: 5px;
    border: 1px #eee solid;
  }

  .item .row .top .img {
    background: none !important;
  }

  .libTab {
    width: 6.9rem;
  }

  .libTab li {
    background: #f9f9f9;
    padding: .16rem .3rem;
    margin: 0 .3rem 0 0;
    color: #666;
  }

  .libTab li.on {
    background: #f2f8fb;
    color: #0072ac;
    border-radius: .05rem;
  }

  ul.attachment {
    width: 6.9rem;
    padding: 0 .3rem;
  }

  ul.attachment li {
    width: 100%;
    padding: .3rem 0;
    border-bottom: 1px #eee solid;
    position: relative;
  }

  ul.attachment li:last-child {
    border-bottom: none;
  }

  ul.attachment li a {
    width: 100%;
  }

  ul.attachment li a img {
    width: .7rem;
    height: .7rem;
  }

  ul.attachment li a p {
    width: 4.9rem;
    height: .64rem;
    margin: .03rem 0 .03rem .3rem;
  }

  ul.attachment li a p b {
    font-size: .28rem;
    line-height: .34rem;
    height: .34rem;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    text-overflow: ellipsis;
    font-weight: bold;
  }

  ul.attachment li a p span {
    margin: .08rem 0;
    color: #999;
    width: 100%;
  }

  ul.attachment li a em {
    color: #0072ac;
    border: 1px #0072ac solid;
    padding: 0 .1rem;
    border-radius: .05rem;
    margin: .15rem 0 0 0;
    font-size: .24rem;
    line-height: .38rem;
  }

  img.attachment {
    vertical-align: center;
    line-height: .3rem;
    padding: 0 .05rem 0 0;
    width: .28rem;
    height: .28rem;
  }
</style>

<style src="../../../css/list.css"></style>

<style src="../../../css/form.css"></style>