<template>
  <div class="full">
    <div class="Toast">
      <img v-if="ToastOption.icon" :src="icon[ToastOption.icon]">{{ToastOption.text}}
    </div>
  </div>
</template>

<script>
  export default {
    name: "Toast",
    props: ["ToastOption"],
    data() {
      return {
        icon: {
          loading: require("@/images/gear.gif")
        }
      }
    },
    mounted() {

    },
    methods: {

    },
  }
</script>

<style>
.Toast{position:fixed;top:50%;left:50%;z-index:999;float:left;padding:.25rem .3rem;border-radius:.1rem;background:rgba(0,0,0,.66);color:#fff;font-size:.28rem;line-height:.38rem;transform:translate(-50%,-50%)}
.Toast img{padding:0 .1rem;width:.38rem;height:.38rem;object-fit:contain;-o-object-fit:contain}
</style>