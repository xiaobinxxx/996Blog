import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  routes: [
    // 首页
    {
      path: '/',
      name: '/',
      component: () => import('@/page/home/home.vue'),
    },
    // 文章详情
    {
      path: '/ArticleDetails',
      name: 'ArticleDetails',
      component: () => import('@/page/ArticleDetails/ArticleDetails.vue')
    },
    // 分类文章列表
    {
      path: '/ClassifyArticle',
      name: 'ClassifyArticle',
      component: () => import('@/page/ClassifyArticle/ClassifyArticle.vue')
    },
    // 搜索结果页
    {
      path: '/SearchResult',
      name: 'SearchResult',
      component: () => import('@/page/SearchResult/SearchResult.vue')
    },
  ]
})
