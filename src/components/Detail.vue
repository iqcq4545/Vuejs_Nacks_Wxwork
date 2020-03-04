<template>
  <div class="Detail full">
    <div class="container" id="wrap">
      <div v-if="DetailOption.image" class="previewImg">
        <img class="img" :src="DetailOption.image===true?noImg:DetailOption.image" />
        <img v-if="DetailOption.maskImg" class="maskImg" :src="DetailOption.maskImg" />
        <div v-if="DetailOption.editable" class="camera">
          <input type="file" accept="image/*" @change="chooseImg($event)" />
          <img src="@/images/camera.png">
        </div>
      </div>

      <div class="form1 head">
        <div v-if="DetailOption.title" class="wrap">
          <p v-if="DetailOption.title" class="title">{{DetailOption.title}}</p>
          <p v-if="DetailOption.desc" class="desc">{{DetailOption.desc}}</p>
        </div>
      </div>

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
      </div>

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
      }
    },
    mounted() {
      document.body.style.overflow = "hidden";
      console.log(this.DetailOption)
    },
    computed: {

    },
    methods: {
      itemValue(key) {
        return this.DetailOption.value === 'string' ? (key || "--") : (eval("this.DetailOption.data." + key) || "--");
      },
      split(val, str) {
        return val.split(str);
      },
      chooseImg() {
        this.$emit("chooseImg", event);
      },
      popup(data) {
        if (data.length > 1) {
          this.$emit("showPopup", data);
        }
      },
      close() {
        this.DetailOption.isShow = false;
        document.body.style.overflow = "";
      }
    },
  }
</script>

<style>
  .Detail {
    z-index: 10;
    overflow-x: hidden;
    overflow-y: scroll;
    background: #f4f5f5 !important;
    -webkit-overflow-scrolling: touch;
  }

  .Detail .previewImg {
    width: 7.5rem;
    height: 4.2rem;
    background: #000
  }

  .Detail .previewImg .img,
  .Detail .previewImg .maskImg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 7.5rem;
    height: 4.2rem;
    background: #fff;
    background: #000;
    -o-object-fit: contain;
    object-fit: contain
  }

  .Detail .previewImg .img {
    z-index: 1
  }

  .Detail .previewImg .maskImg {
    z-index: 2
  }

  .Detail .previewImg .camera {
    position: absolute;
    top: .25rem;
    right: .25rem;
    z-index: 3;
    overflow: hidden;
    padding: .1rem;
    width: .4rem;
    height: .4rem;
    border-radius: .3rem;
    background: rgb(255, 255, 255, .25)
  }

  .Detail .previewImg .camera img,
  .Detail .previewImg .camera input {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0
  }

  .Detail .previewImg .camera img {
    z-index: 1;
    margin: auto;
    width: .4rem
  }

  .Detail .previewImg .camera input {
    z-index: 2;
    width: .6rem;
    height: .6rem;
    opacity: 0
  }

  .Detail .submit {
    position: fixed;
    margin-top: .15rem;
    width: 7.5rem;
    font-size: .28rem;
    line-height: .9rem
  }

  .Detail .container {
    margin: 0;
    width: 100%
  }

  .form1.body .wrap:last-child {
    margin-bottom: 1.1rem
  }

  .form1 .icon {
    position: absolute;
    top: .03rem;
    right: .05rem;
    height: .24rem
  }

  .form1 .table {
    padding-right: .55rem;
    width: 4.5rem
  }

  .form1 .table span {
    overflow: hidden;
    width: 100%;
    height: .3rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: .3rem
  }

  .title {
    width: 100%;
    font-weight: 700;
    font-size: .3rem;
    line-height: .35rem
  }

  .desc {
    padding-top: .25rem;
    width: 100%;
    font-size: .25rem;
    line-height: .3rem
  }

  .process {
    width: 7.5rem;
    padding: .3rem 0;
    margin: 0 0 1.1rem 0;
  }

  .process .dot {
    position: absolute;
    width: .1rem;
    height: .1rem;
    background: #eee;
    border-radius: 50%;
    left: 2.5rem;
    top: 50%;
    margin: -.04rem;
  }

  .process p {
    width: 100%;
    line-height: .5rem;
    font-size: .28rem;
    color: #999;
    white-space: nowrap;

  }

  .process .left {
    padding: .3rem .4rem .3rem .3rem;
    width: 1.8rem;
  }

  .process .right {
    padding: .3rem .3rem .3rem .4rem;
    border-left: 1px #eee solid;
    width: 4.2rem;
  }

  .process ul li:first-child p {
    color: #000
  }
</style>

<style src="../css/form.css"></style>