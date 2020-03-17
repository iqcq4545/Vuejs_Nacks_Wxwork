<template>
  <div class="Table full" id="Table">
    <div class="Top bgw">
      <Search :SearchOption="SearchOption" @SearchTop="search"></Search>
    </div>
    <div v-if="TableOption.data.length>0" class="container tbody">
      <dl v-for="(item,i) in TableOption.data" :key="i" class="bgw" :class="item.on||''" @click="select(i)">
        <dt>{{item[TableOption.field.dt.value]}}</dt>
        <dd v-for="(field,j) in TableOption.field.dd" :key="j"><b>{{field.name}}</b>
          <p>{{item[field.value]||"--"}}</p>
        </dd>
      </dl>
    </div>

    <a v-if="selected.length===0" class="submit btn" @click="close()">关 闭</a>
    <a v-if="selected.length>0" class="submit btn" @click="ok()">确 认</a>
  </div>
</template>

<script>
  import Search from '@/components/Search';

  export default {
    name: "Table",
    props: ["TableOption"],
    data() {
      return {
        SearchOption: {
          keyword: "",
          placeholder: this.TableOption.placeholder
        },
        submitStyle: undefined,
        selected: [],
        last: undefined,
      }
    },
    components: {
      Search: Search
    },
    computed: {
      itemValue() {
        return function (key) {

        }
      }
    },
    created() {

    },
    mounted() {
      document.body.style.overflow = "hidden";
      var that = this;
      document.getElementById("Table").addEventListener("scroll", function (e) {
        if ((e.target.scrollTop + e.target.clientHeight) > (e.target.scrollHeight - 1)) {
          that.search(1);
        }
      });
    },

    methods: {
      close() {
        this.TableOption.isShow = false;
        document.body.style.overflow = "";
      },

      ok() {
        this.$emit("ok", this.selected);
        this.close();
      },

      search(add = 0) {
        typeof (add) === "object" ? add = 0 : undefined;
        var opt = { keyword: this.SearchOption.keyword || "", add: add }
        this.$emit("TableSearch", opt);
      },

      select(i) {
        var item = this.TableOption.data[i];
        if (this.TableOption.single) {
          this.selected = [];
          if (this.last !== undefined) {
            this.TableOption.data[this.last].on = "";
          }
        }
        if (!item.on) {
          item.on = "on";
          this.selected.push(item);
        }
        else {
          item.on = "";
          for (var j = 0; j < this.selected.length; j++) {
            if (!this.selected[j].on) {
              this.selected.splice(j, 1);
              j -= 1;
            }
          }
        }
        this.last = i;
        this.$forceUpdate();
      }
    },
  }
</script>

<style src="../css/table.css"></style>
<style src="../css/form.css"></style>