import axios from 'axios'
import router from '@/router'
import { Loading,Notification } from 'element-ui';
import Global from '../tool/Global'

const service = axios.create({
  baseURL: process.env.API_ROOT,
  timeout: 50000
});
/**
 * 请求前
 */
service.interceptors.request.use(config => {
  // Loading.service();
  return config
}, error => {
  return Promise.reject(error)
});

/**
 * 请求后
 */
service.interceptors.response.use((resp) => {
  // let loadingInstance = Loading.service();
  // loadingInstance.close();
  // 判断code
  if(resp.data.code === 0){
    return Promise.resolve(resp.data);
  }
  // 是否进入黑名单
  if(resp.data.code === -100){
    localStorage.removeItem('MemberInfo');
    Global.MemberInfo = {};
    Global.member_id = '';
    Global.UserStatus = 0;
    location.reload();
  }
  Notification.info(resp.data.message);
  return Promise.reject(resp.data.message);

},  (err) => {
  console.log(err);
  return Promise.reject(err)
});

export default service
