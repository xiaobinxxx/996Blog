<template>
  <div class="page" v-loading="loading">
<!--    标题-->
    <div class="artice-title">
      <div class="title">
        <span>{{ArticleInfo.title}}</span>
      </div>
      <div class="result">
        <div class="time">
          <span>{{util.resolvingDate(ArticleInfo.release_time)}}</span>
          <span>{{ArticleInfo.author}}</span>
          <span>阅读数：{{ArticleInfo.pageview}}</span>
          <span>评论数：{{ArticleInfo.comments}}</span>
          <span>专栏：{{classify_name}}</span>
        </div>
      </div>
    </div>
<!--    描述-->
    <div class="description">
      <span>{{ArticleInfo.description}}</span>
    </div>
<!--    内容-->
    <div class="content" v-html="ArticleInfo.content_edit">
    </div>
<!--    评论-->
    <div class="comment">
      <div class="comment-title">
        <span>留下你的评论吧!</span>
      </div>
      <div ref="editorElem" style="text-align:left;"></div>
      <div class="comment-btn" @click="onPublish">
        <span>发表评论</span>
      </div>
      <div class="comment-list">
        <div class="list" v-for="(item,index) in CommentList" :key="index">
          <div class="head-portrait">
            <img :src="item.portrait" alt="">
          </div>
          <div class="comment-item">
            <div class="nickname">
              <span>{{item.nickname}}</span>
              <span>{{util.timeFormat(item.creation_time)}}</span>
            </div>
            <div class="comment-content">
              <span v-html="item.content"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
<!--    返回顶部-->
    <go-top></go-top>
  </div>
</template>

<script>
  import {ArticlesDetails,PublishComment,CommentList} from "../../axios/api";
  import E from "wangeditor";
  export default {
    name: "ArticleDetails",
    data(){
      return {
        ArticleInfo: {},
        loading: false,
        editor: null,
        editorContent: '',
        // 评论列表
        CommentList: [],
        page: 1,
        total: 0,
        // 分类专栏
        classify_name: '',
      }
    },
    // catchData是一个类似回调函数，来自父组件，当然也可以自己写一个函数，主要是用来获取富文本编辑器中的html内容用来传递给服务端
    props: ['catchData'], // 接收父组件的方法
    created() {
      window.addEventListener('scroll', this.scrollPage);
    },
    destroyed() {
      window.removeEventListener('scroll', this.scrollPage);
    },
    mounted(){
      this.editor = new E(this.$refs.editorElem);
      // 编辑器的事件，每次改变会获取其html内容
      this.editor.customConfig.onchange = html => {
        this.editorContent = html;
      };
      this.editor.customConfig.menus = [
        // 菜单配置
        // 'head', // 标题
        // 'bold', // 粗体
        // 'fontSize', // 字号
        // 'fontName', // 字体
        // 'italic', // 斜体
        // 'underline', // 下划线
        // 'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        // 'backColor', // 背景颜色
        'link', // 插入链接
        // 'list', // 列表
        // 'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        // 'table', // 表格
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ];
      this.editor.create(); // 创建富文本实例
      this.getData();
      this.commentData();
    },
    methods:{
      getData(){
        this.loading = true;
        ArticlesDetails({
          article_id: this.$route.query.article_id,
        }).then(res =>{
          this.loading = false;
          this.ArticleInfo = res.data;
          this.classify_name = this.ArticleInfo.classify.classify_name;
        })
      },
      scrollPage(){
        // scrollTop 滚动条滚动时，距离顶部的距离
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        // windowHeight 可视区的高度
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        // scrollHeight 滚动条的总高度
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        // 滚动条到底部的条件
        if(scrollTop + windowHeight == scrollHeight){
          if(this.CommentList.length != this.total){
            // 加载数据
            this.page++;
            this.commentData();
          }
        }
      },
      /**
       * 评论列表
       */
      commentData(){
        this.loading = true;
        CommentList({
          article_id: this.$route.query.article_id,
          page: this.page,
        }).then(res =>{
          this.loading = false;
          if(this.page === 1){
            this.CommentList = res.result;
            this.total = res.total;
          }else{
            this.CommentList = [...this.CommentList,...res.result];
          }
        })
      },
      /**
       * 发表评论
       */
      onPublish(){
        PublishComment({
          content: this.editorContent,
          article_id: this.$route.query.article_id,
        }).then(res =>{
          this.$message('评论成功');
          this.page = 1;
          this.commentData();
        })
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
<link rel="stylesheet" href="editormd/css/editormd.css" />
<style scoped lang="scss">
  @import "../../../static/css/style";
  @import "ArticleDetails";
</style>
