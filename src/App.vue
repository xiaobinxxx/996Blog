<template>
  <div id="app">
<!--    导航组件-->
    <navigation></navigation>
    <div class="all">
      <router-view/>
      <blogs-right></blogs-right>
    </div>
    <footer-page></footer-page>
  </div>
</template>

<script>
  import Navigation from './components/Navigation/Navigation'
  import BlogsRight from './components/BlogsRight/BlogsRight'
  import FooterPage from './components/Footer/Footer'
  export default {
    name: 'App',
    components:{
      Navigation,
      BlogsRight,
      FooterPage,
    },
    created(){
      if(localStorage.getItem('MemberInfo')){
        var MemberInfo = JSON.parse(localStorage.getItem('MemberInfo'));
        this.Global.member_id = MemberInfo.member_id;
        this.Global.MemberInfo = MemberInfo;
      }
    },
    mounted() {
    }
  }
</script>

<style lang="scss">
  @import "../static/css/pubilc.css";
  @import "../static/font/iconfont.css";
  @import "../static/css/Elephant.css";
  body{
    background-color: #f2f2f2;
  }
  .all{
    position: relative;
    display: flex;
    width: 1024px;
    margin: 0 auto;
  }
  // 进场动画
  @keyframes bounceInUp {
    0%, 60%, 75%, 90%, 100% {
      -webkit-transition-timing-function: cubic-bezier(0.215,0.610,0.355,1.000);
      transition-timing-function: cubic-bezier(0.215,0.610,0.355,1.000);
    }
    0% {
      opacity: 0;
      -webkit-transform: translate3d(0,100px,0);
      transform: translate3d(0,100px,0);
    }
    60% {
      opacity: 1;
    }
    100% {
      -webkit-transform: translate3d(0,0,0);
      transform: translate3d(0,0,0);
    }
  }
</style>
