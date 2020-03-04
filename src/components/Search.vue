<template>
  <div class="container search">
    <div class="row">
      <img class="icon" src="@/images/magnifier.png" />
      <form action="javascript:return true" class="ps">
        <input type="text" v-model="SearchOption.keyword" :placeholder="SearchOption.placeholder"
          @keyup.enter="search" />
        <img v-if="SearchOption.keyword" class="clearbtn" src="@/images/btn_x.png" @click="clear" />
        <span class="searchbtn" @click="search()">搜索</span>
      </form>
    </div>
  </div>
</template>
<script>
  import {
    trim
  } from '../utils/utils';

  export default {
    name: 'Search',
    props: ["SearchOption"],
    data() {
      return {
      }
    },
    mounted() {

    },

    methods: {
      search(e) {
        this.SearchOption.keyword = trim(this.SearchOption.keyword);
        this.$emit("SearchTop");
        if (e) {
          e.target.blur();
        }
      },
      clear() {
        this.SearchOption.keyword = "";
      }
    },
  }
</script>

<style>
.searchbtn,img.clearbtn{position:absolute;z-index:2;text-align:center}
.clearbtn{right:1.1rem}
.searchbtn{position:absolute;right:.15rem;padding:0 .2rem 0 0;font-size:.26rem;line-height:.7rem}
</style>