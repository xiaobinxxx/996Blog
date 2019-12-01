<template>
  <div class="page-table" @click="onReturnTop" v-show="is_show">
    <div class="go-top"></div>
  </div>
</template>

<script>
  export default {
    name: "GoTop",
    data(){
      return {
        is_show: false
      }
    },
    mounted() {
      //页面滑动监听
      window.addEventListener('scroll', this.handleScroll);
    },
    methods: {
      handleScroll() {
        if (window.scrollY > 0) {
          this.is_show = true;
        } else {
          this.is_show = false;
        }
      },
      /**
       * 返回顶部点击事件
       */
      onReturnTop(){
        clearInterval(this.timer);
        this.timer = setInterval(() =>{
          document.body.scrollTop = parseInt(document.body.scrollTop - 100);
          document.documentElement.scrollTop = parseInt(document.documentElement.scrollTop - 100);
          if(document.documentElement.scrollTop <= 0 && document.body.scrollTop <= 0){
            clearInterval(this.timer);
          }
        },30);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "GoTop";
</style>
