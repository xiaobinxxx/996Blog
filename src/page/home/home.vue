<template>
  <div class="page" v-loading="loading">
<!--    banner-->
    <div class="banner">
      <el-carousel height="280px">
        <el-carousel-item v-for="(item,index) in BannerList" :key="index">
          <img :src="item.ad_cover" @click="onAdSkip(item)">
        </el-carousel-item>
      </el-carousel>
    </div>
<!--    最新发布文章-->
    <div class="new-article" v-if="NewArticleLists.length != 0">
      <div class="new-title">
        <span>最新发布</span>
      </div>
      <div class="article-list">
        <div class="list" v-for="(item,index) in NewArticleLists"
             @click="$router.push({name:'ArticleDetails',query:{article_id: item.article_id}})"
             :key="index">
          <div class="tumb">
            <img :src="item.article_cover" alt="">
          </div>
          <div class="item">
            <div class="title">
              <span class="tag">{{item.classify.classify_name}}</span>
              <span class="tit">{{item.title}}</span>
            </div>
<!--            描述-->
            <div class="describe">
              <span>{{item.description}}</span>
            </div>
<!--          时间 查看量 评论数  -->
            <div class="information">
              <div class="ico-list">
                <span class="iconfont icon-shijian"></span>
                <span>{{util.resolvingDate(item.release_time)}}</span>
              </div>
              <div class="ico-list">
                <span class="iconfont icon-pinglun"></span>
                <span>{{item.comments}}</span>
              </div>
              <div class="ico-list">
                <span class="iconfont icon-chakan"></span>
                <span>{{item.pageview}}</span>
              </div>
            </div>
          </div>
        </div>
<!--        加载更多-->
        <div class="load-more" @click="onLoadMore">
          <span v-show="dataStatus">没有更多啦</span>
          <span v-show="!dataStatus">加载更多</span>
        </div>
      </div>
    </div>

    <!--    返回顶部-->
    <go-top></go-top>
  </div>
</template>

<script>
  import {index,NewArticleList,HomeBanner} from "../../axios/api";

  export default {
    name: "home",
    data(){
      return {
        // 最新文章列表
        NewArticleLists: [],
        // 页码
        page: 1,
        // 分页数据
        page_total: {},
        // 检测是否有数据
        dataStatus: false,
        // banner 图片
        BannerList: [],
        loading: false,
        current_y:''
      }
    },
    mounted() {
      this.getData();
      this.bannerData();
      window.addEventListener('scroll', this.scrollPage);
    },
    destroyed() {
      window.removeEventListener('scroll', this.scrollPage);
    },
    methods:{
      getData(){
        this.loading = true;
        NewArticleList({
          page: this.page,
        }).then(res =>{
          this.loading = false;
          this.page_total = res.data.total;
          if(this.page === 1){
            this.NewArticleLists = res.data.data;
          }else{
            this.NewArticleLists = this.NewArticleLists.concat(res.data.data);
          }
        })
      },
      /**
       * banner 数据
       */
      bannerData(){
        HomeBanner().then(res =>{
          this.BannerList = res.data;
        })
      },
      /**
       * 加载更多点击
       */
      onLoadMore(){
        if(this.page_total != this.NewArticleLists.length){
          this.page++;
          this.getData();
        }else{
          this.dataStatus = true;
        }
      },
      /**
       * 广告跳转点击
       */
      onAdSkip(item){
        console.log(item);
        switch (item.ad_skip) {
          case 0:
            this.$router.push({name:'ArticleDetails',query:{article_id: item.article_id}});
            break;
          case 1:
            window.location.href = item.skip_link;
            break;
        }
      },
      /**
       * 监听滚动
       */
      scrollPage(e) {
        this.current_y = e.target.scrollTop;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        // windowHeight 可视区的高度
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        // scrollHeight 滚动条的总高度
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        // 判断是否滚动到底部了
        if(scrollTop + windowHeight == scrollHeight){
          console.log('到底了');
          if(this.NewArticleLists.length != this.page_total){
            this.page++;
            this.getData();
          }
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../static/css/style";
  @import "home.scss";

</style>
