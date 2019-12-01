<template>
  <div>
    <div class="navigation">
      <div class="nav">
        <div class="logo" @click="$router.push('/')">
          <img src="/static/image/logo.png" alt="">
          <div class="blogs-title">
            <span class="mark">996博客</span>
            <span class="des">值得记录，值得分享</span>
          </div>
        </div>
        <div class="menu">
          <div class="list" v-for="(item,index) in NavList" @click="onNavSkip(index,item)" :key="index">
            <span :class="{active:NavStatus===index}" @mouseover="onNavOver(index)">{{item.title}}</span>
          </div>
        </div>
        <div class="search" v-show="searchStatus">
          <input type="text" v-model="keyword" @keyup.enter="onKeyUp" placeholder="输入搜索内容" />
        </div>
        <div class="magnify" @click="searchStatus = !searchStatus">
          <span class="iconfont icon-magnify"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {ClassList} from "../../axios/api";

  export default {
    name: "Navigation",
    data() {
      return {
        // 导航菜单
        NavList: [
          {
            id: 1,
            title: '首页',
          },
          {
            id: 2,
            title: 'javascrpit',
          },
          {
            id: 3,
            title: 'java',
          },
          {
            id: 4,
            title: 'php',
          },
          {
            id: 5,
            title: '前端',
          },
        ],
        // 导航状态
        NavStatus: 0,
        // 搜索状态
        searchStatus: false,
        // 搜索值
        keyword: '',
      }
    },
    activated() {

    },
    created() {
      if (sessionStorage.getItem('NavStatus')) {
        this.NavStatus = parseInt(sessionStorage.getItem('NavStatus'));
      }
    },
    mounted() {
      ClassList().then(res => {
        this.NavList = res.data;
        this.NavList.unshift({
          title: '首页',
          class_id: 0,
        });
      })
    },
    methods: {
      /**
       * 导航点击
       */
      onNavSkip(index, item) {
        this.NavStatus = index;
        sessionStorage.setItem('NavStatus', this.NavStatus);
        if (this.NavStatus === 0) {
          this.$router.push({name: '/'});
          return;
        }
        this.$router.push({name: 'ClassifyArticle', query: {class_id: item.class_id}});
      },
      /**
       * 鼠标经过导航
       */
      onNavOver(index){
        // console.log(index);
      },
      /**
       * 键盘抬起
       */
      onKeyUp(e){
        this.$router.push({name:'SearchResult',query:{keyword: this.keyword}});
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../static/css/style";
  @import "Navigation";
</style>
