<template>
  <div class="page" v-loading="loading">
    <!--    最新发布文章-->
    <div class="articles">
      <div class="article-list">
        <div class="list" v-for="(item,index) in ArticleLists"
             @click="$router.push({name:'ArticleDetails',query:{article_id: item.article_id}})"
             :key="index">
          <div class="tumb">
            <img :src="item.article_cover" alt="">
          </div>
          <div class="item">
            <div class="title">
              <span class="tag">{{item.classify.classify_name||''}}</span>
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
  import {ArticleList} from '../../axios/api'
  export default {
    name: "ClassifyArticle",
    data(){
      return {
        // 文章列表
        ArticleLists: [],
        // 页码
        page: 1,
        // 分页数据
        page_total: {},
        // 检测是否有数据
        dataStatus: false,
        loading: false,
      }
    },
    activated(){
    },
    mounted() {
      this.getData();
    },
    methods:{
      getData(){
        this.loading = true;
        ArticleList({
          class_id: this.$route.query.class_id,
          page: this.page,
        }).then(res =>{
          this.loading = false;
          this.page_total = res.data.total;
          if(this.page === 1){
            this.ArticleLists = res.data.data;
          }else{
            this.ArticleLists = this.ArticleLists.concat(res.data.data);
          }
        })
      },
      /**
       * 加载更多点击
       */
      onLoadMore(){
        if(this.page_total != this.ArticleLists.length){
          this.page++;
          this.getData();
        }else{
          this.dataStatus = true;
        }
      },
    },
    watch: {
      //监听相同路由下参数变化的时候，从而实现异步刷新
      '$route'(to,from) {
        //做一些路由变化的响应
        //重新获取数据
        this.getData();
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../static/css/style";
  @import "ClassifyArticle";
</style>
