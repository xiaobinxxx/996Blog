import axios from '../axios'
import Global from '../tool/Global'
/**
 * get请求封装
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
function get(url, params) {
  return axios({
    header: {
      'Access-Control-Allow-Origin': '*',
    },
    headers: {
      'token':Global.member_id
    },
    url: url,
    method: 'GET',
    params: params,
  })
}

/**
 * post请求封装
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
function post(url, params) {
  return axios({
    header: {
      'Access-Control-Allow-Origin': '*',
    },
    headers: {
      'token': Global.member_id,
    },
    url: url,
    method: 'POST',
    data: params
  })
}

// 测试接口
export const index = params => {
  return get('/index/index', params)
};
// 用户注册
export const Register = params => {
  return post('/login/index/register', params)
};
// 用户登录
export const MenberLogin = params => {
  return post('/login/index/login', params)
};
// 分类列表
export const ClassList = params => {
  return get('/classify/index/list', params)
};
// 最新文章列表
export const NewArticleList = params => {
  return get('/articles/index/new/article_list', params)
};
// 热门文章列表
export const HotClickArticleList = params => {
  return get('/articles/index/hotclick/article_list', params)
};
// 首页banner
export const HomeBanner = params => {
  return get('/advertising/index/banner', params)
};
// 文章详情
export const ArticlesDetails = params => {
  return get('/articles/index/details', params)
};
// 文章列表
export const ArticleList = params => {
  return get('/articles/index/article/list', params)
};
// 更新用户信息
export const UpdateUser = params => {
  return post('/user/index/update/user', params)
};
// 友情链接
export const BlogrollList = params => {
  return get('/blogrolls/index/BlogrollList', params)
};
// 发表评论
export const PublishComment = params => {
  return post('/article/comment/PublishComment', params)
};
// 评论列表
export const CommentList = params => {
  return get('/article/comment/CommentList', params)
};

