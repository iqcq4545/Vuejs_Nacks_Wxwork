<template>
  <div class="page">
    <div class="list">
      <div v-if="!loading&&(!msgList||!msgList.length)" class="MSG">暂无数据</div>
      <div class="Top bgw">
        <Search :SearchOption="SearchOption" @SearchTop="search"></Search>
        <!-- <div class="container tab">
          <ul v-if="statusList">
            <li>全部</li>
            <li>已读</li>
            <li>未读</li>
          </ul>
        </div> -->
      </div>

      <div class="container item">
        <div v-for="(item,i) in msgList" :key="i" class="row bgw">
          <dl class="msg">
            <dt>{{item.Content}}</dt>
            <dd class="time">{{item.ReceiveTime}}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import Search from '@/components/Search';

  import {
    cookiesValue
  } from '../../../utils/cookies';

  export default {
    inject: [/*"reload",*/ "Toast", "Confirm"],
    data() {
      return {
        status: { id: 0, uid: undefined },
        statusStr: undefined,
        msgList: undefined,
        loading: true,
        SearchOption: {
          keyword: "",
          placeholder: "请输入短消息内容"
        },
        pageOption: {
          index: 1,
          size: 20,
          max: 2
        },
        selected: undefined
      }
    },
    components: {
      Search: Search,
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
      this.getList();
    },

    methods: {
      init() {
        this.msgList = [];
        this.pageOption.index = 1;
        this.pageOption.max = 2;
      },


      getList(add = 0) {
        if (this.pageOption.max > this.pageOption.index) {
          this.loading = true;
          this.Toast({ text: "正在加载", icon: "loading" }, 20000);
          this.pageOption.index += add;
          this.$ReqUser.getMessage({ pageIndex: this.pageOption.index, pageSize: this.pageOption.size, content: this.SearchOption.keyword, receiveId: cookiesValue("ZT_DevicePlatForm_UserId"), }).then((res) => {
            Array.prototype.push.apply(this.msgList, res.data.list);
            this.pageOption.max = Math.ceil(res.data.recordCount / this.pageOption.size);
            this.Toast({}, 0);
            this.loading = false;
          });
        }
      },

      search() {
        this.init();
        this.getList();
      },

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

  .msg {
    width: 6.3rem;
  }

  .msg dt {
    width: 100%;
    padding: 0 0 .15rem 0;
    font-size: .28rem;
    line-height: .36rem;
  }

  .msg dd.time {
    color: #ccc;
  }
</style>

<style src="../../../css/list.css"></style>