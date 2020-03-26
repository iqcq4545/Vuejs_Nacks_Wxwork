<template>
  <div class="Detail full">
    <div class="container" id="wrap">
      <!-- 预览图片 -->
      <div v-if="DetailOption.image" class="previewImg">
        <img class="img" :src="DetailOption.image===true?noImg:DetailOption.image" />
        <img v-if="DetailOption.maskImg" class="maskImg" :src="DetailOption.maskImg" />
        <!-- 上传图片 -->
        <div v-if="DetailOption.editable" class="camera">
          <input type="file" accept="image/*" @change="chooseImg($event)" />
          <img src="@/images/camera.png">
        </div>
      </div>
      <!-- 滚动图片 -->
      <div v-if="DetailOption.slide.length>0&&false" class="slide">
        <v-touch v-on:swipeleft="slideLeft" v-on:swiperight="slideRight">
          <ul class="slide-ul" :style="'width:'+7.5*DetailOption.slide.length+'rem;left:-'+7.5*slideIndex+'rem'">
            <li class="slide-li" v-for="(item,i) in DetailOption.slide" :key="i"
              :data-count="DetailOption.slide.length">
              <img class="slide-img" :src="item.Url" alt="" :data-count="DetailOption.slide.length" />
            </li>
          </ul>
        </v-touch>
        <ul class="slide-pagination">
          <li class="slide-circle" :class="i===slideIndex&&'on'" v-for="(item,i) in DetailOption.slide" :key="i">●</li>
        </ul>
      </div>
      <!-- 标题和描述 -->
      <div class="form1 head">
        <div v-if="DetailOption.title" class="wrap">
          <p v-if="DetailOption.title" class="title">{{DetailOption.title}}</p>
          <p v-if="DetailOption.desc" class="desc">{{DetailOption.desc}}</p>
        </div>
      </div>
      <!-- 详情内容 -->
      <div v-if="DetailOption.type==='form'" class="form1 body">
        <div v-for="(item,i) in DetailOption.field" :key="i" class="wrap">
          <div v-for="(itemI,j) in item" class="row bgw">
            <label class="lab1">{{itemI.name}}</label>
            <p :class="itemI.class" @click="(itemI.class==='table')&&popup(itemI.data)">
              <span :class="itemI.class==='table'&&itemI.data.length&&'more'">{{itemValue(itemI.value)}}</span>
              <img v-if="itemI.class==='table'&&itemI.data.length" class="icon" src="@/images/repair_btn_more.png" />
            </p>
          </div>
        </div>
        <!-- 详情图片 -->
        <div class="wrap" v-if="DetailOption.slide.length>0">
          <div class="row bgw">
            <label class="lab1">报修图片</label>
            <div class="imgScroll">
              <ul class="imgWrap" :style="'width:'+2*DetailOption.slide.length+'rem'">
                <li v-for="(item,i) in DetailOption.slide">
                  <img :src="item.Url" @click="imgzoom(i)">
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- 流程 -->
      <div v-if="DetailOption.type==='process'" class="process bgw">
        <ul v-for="(item,i) in DetailOption.field" :key="i">
          <li v-for="(itemI,j) in item">
            <div class="left tar">
              <p v-for="(v,k) in split(itemI.name,' ')">{{v}}</p>
            </div>
            <em class="dot"></em>
            <div class="right fr">
              <p v-for="(v,k) in split(itemValue(itemI.value),' ')">{{v}}</p>
            </div>
          </li>
        </ul>
      </div>

      <a class="submit btn" @click="close()">关 闭</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Detail",
    props: ["DetailOption"],
    data() {
      return {
        submitStyle: undefined,
        noImg: require('@/images/item_img.jpg'),
        slideIndex: 0,
      }
    },
    mounted() {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("overflow", "hidden");
    },
    computed: {

    },
    methods: {

      slideLeft(e) {
        if (parseInt(e.target.dataset.count) - 1 - this.slideIndex) {
          this.slideIndex += 1;
        }
        else {
          return false
        }
      },
      slideRight(e) {
        if (this.slideIndex > 0) {
          this.slideIndex -= 1;
        }
      },

      itemValue(key) {
        return this.DetailOption.value === 'string' ? (key || "--") : (eval("this.DetailOption.data." + key) || "--");
      },
      split(val, str) {
        return val.split(str);
      },
      chooseImg() {
        this.$emit("chooseImg", event);
      },
      imgzoom(i) {
        var option = { index: i };
        this.$emit("showImgzoom", option);
      },
      popup(data) {
        if (data.length > 0) {
          this.$emit("showPopup", data);
        }
      },
      close() {
        this.DetailOption.isShow = false;
        this.$emit("setScroll");
      },
    },
  }
</script>

<style>
  .imgScroll {
    width: 100%;
    overflow-x: auto;
    margin-top: .3rem;
  }

  .imgScroll ul {
    float: left;
  }

  .imgScroll ul li {
    margin: 0 .1rem 0 0;
    width: 1.9rem;
    height: 1.9rem;
  }

  .imgScroll ul li img {
    background: #000;
    width: 100%;
    height: 100%;
    -o-object-fit: contain;
    object-fit: contain;
    border-radius: .1rem;
    overflow: hidden;
  }
</style>

<style src="../css/detail.css"></style>
<style src="../css/form.css"></style>