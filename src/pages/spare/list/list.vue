<template>
  <div class="page">
    <div class="list">
      <div v-if="!loading&&(!itemList||!itemList.length)" class="MSG">暂无数据</div>
      <div class="Top bgw">
        <Search :SearchOption="SearchOption" @SearchTop="search"></Search>
      </div>

      <div class="container tbody">
        <dl v-for="(item,i) in itemList" :key="i" class="bgw">
          <dt>{{item.Name}}</dt>
          <dd><b>型号规格</b>{{item.Style}}</dd>
          <dd><b>备件编号</b>{{item.SN}}</dd>
          <dd><b>库存数量</b>{{item.StockNum}}</dd>
        </dl>
      </div>
    </div>
  </div>

</template>

<script>
  import Search from '@/components/Search';
  import Detail from '@/components/Detail';

  import {
    cookiesValue
  } from '../../../utils/cookies';

  export default {
    inject: [/*"reload",*/ "Toast", "Confirm"],
    data() {
      return {
        itemList: undefined,
        loading: true,
        SearchOption: {
          keyword: "",
          placeholder: "请输入备件名称"
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

    },

    mounted() {
      this.init();
      this.getList();
    },

    methods: {
      init() {
        this.itemList = [];
        this.pageOption.index = 1;
        this.pageOption.max = 2;
      },

      getList(add = 0) {
        if (this.pageOption.max > this.pageOption.index) {
          this.loading = true;
          this.Toast({ text: "正在加载", icon: "loading" }, 20000);
          this.pageOption.index += add;
          this.$ReqJob.sparePartList({ pageIndex: this.pageOption.index, pageSize: this.pageOption.size, name: this.SearchOption.keyword }).then((res) => {
            Array.prototype.push.apply(this.itemList, res.data.list);
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

<style src="../../../css/table.css"></style>