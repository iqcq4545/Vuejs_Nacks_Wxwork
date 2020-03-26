<template>
  <div class="mask full">
    <div class="Imgzoom">
      <a class="Imgzoom-close" @click="close()">x</a>
      <v-touch v-on:swipeleft="ImgzoomLeft" v-on:swiperight="ImgzoomRight">
        <ul class="Imgzoom-ul"
          :style="'width:'+7.5*ImgzoomOption.images.length+'rem;left:-'+7.5*ImgzoomOption.index+'rem'">
          <li class="Imgzoom-li" v-for="(item,i) in ImgzoomOption.images" :key="i"
            :data-count="ImgzoomOption.images.length">
            <img class="Imgzoom-img" :src="item.Url" alt="" :data-count="ImgzoomOption.images.length" />
          </li>
        </ul>
      </v-touch>
      <ul class="Imgzoom-pagination">
        <li class="Imgzoom-circle" :class="i===ImgzoomOption.index&&'on'" v-for="(item,i) in ImgzoomOption.images"
          :key="i">●</li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Imgzoom",
    props: ["ImgzoomOption"],
    data() {
      return {

      }
    },
    mounted() {

    },
    methods: {
      ImgzoomLeft(e) {
        if (parseInt(e.target.dataset.count) - 1 - this.ImgzoomOption.index) {
          this.ImgzoomOption.index += 1;
        }
        else {
          return false
        }
      },
      ImgzoomRight(e) {
        if (this.ImgzoomOption.index > 0) {
          this.ImgzoomOption.index -= 1;
        }
      },
      close() {
        console.log("close")
        this.ImgzoomOption.isShow = false;
      }
    },
  }
</script>

<style scoped>
  .Imgzoom {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%
  }

  .mask {
    background: rgba(0, 0, 0, 1)
  }

  .Imgzoom {
    overflow: hidden;
    width: 7.5rem;
    height: 100%;
    background: #000
  }

  .Imgzoom div {
    width: 7.5rem;
    height: 100%
  }

  .Imgzoom .Imgzoom-ul {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    -webkit-transition: .5s ease;
    -moz-transition: .5s ease;
    transition: .5s ease;
    transform: translate3d(0);
    -ms-transition: .5s ease;
    -webkit-overflow-scrolling: touch
  }

  .Imgzoom .Imgzoom-li {
    width: 7.5rem;
    height: 100%
  }

  .Imgzoom .Imgzoom-img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 7.5rem;
    height: 100%;
    -o-object-fit: contain;
    object-fit: contain
  }

  .Imgzoom .Imgzoom-pagination {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    width: 7.5rem;
    height: .5rem;
    justify-content: center
  }

  .Imgzoom .Imgzoom-circle {
    margin: 0 .04rem;
    color: #fff;
    font-size: .3rem;
    line-height: .3rem;
    opacity: .9
  }

  .Imgzoom .Imgzoom-circle.on {
    color: #0072ac
  }

  .Imgzoom .Imgzoom-close {
    position: absolute;
    top: .25rem;
    right: .25rem;
    z-index: 2;
    float: left;
    width: .5rem;
    height: .5rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, .25);
    color: #fff;
    text-align: center;
    font-size: .4rem;
    line-height: .5rem
  }
</style>