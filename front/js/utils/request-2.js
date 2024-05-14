import Vue from 'vue'
import axios from 'axios'
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken, getHeaderSystem } from '@/utils/auth'
import router from '@/router'

// 避免过期/超时等时同一个页面请求多个接口，导致弹框会多次出现
let showMsg = false;
// 监听浏览器返回、后退、上一页导致弹窗消失而showMsg值仍然为true后续不再弹窗
window.addEventListener('popstate', (e) => { 
  showMsg = false;
}, false);

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  // timeout: 10000
})
const CancelToken = axios.CancelToken;
let loading
Vue.prototype.startLoading = function () { //使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0)'
  })
}
Vue.prototype.endLoading = function () { //使用Element loading-close 方法
  loading.close()
}

var startLoading = function () { //使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0)'
  })
}
var endLoading = function () { //使用Element loading-close 方法
  loading.close()
}

// 不使用System头的api
const notUseHeaderSystem = [
  "/auth/org/changeOrg"
]

// 不调用startLoading的api
const notShowLoadingList = [
  "/auth/user/personalized/save",
  "/es/api/esindex/searchIndex",
  "/es/api/esindex/searchIndexForHelp",
  "/file/OSS/uploadById",
];

// 防止重复请求接口列表
let preventRequest = [
  "/bookkeeping/bill/getBillList",  // 票据上传列表
  "/bookkeeping/bill/getBillCount",// 票据上传总计
  "/financeconf/settings/listSysDictItem", // 客户设置
  "/auth/menu/roleAuthedMenuTree", // 角色权限
  "/financeconf/settings/listSysDictItem", // 客户设置
  "/weixin/web/billingTask/list", // 开票任务列表
  "/weixin/web/billingTask/getNotBillingAmount" // 开票任务待申请金额
]
let pending = []; //声明一个数组用于存储每个请求的取消函数和axios标识
let cancelToken = axios.CancelToken;
let removePending = (config) => {
    // console.log('pending',pending);
    for(let p in pending){
        if(pending[p].u === config.url.split('?')[0] + '&' + config.method) { 
        //当当前请求在数组中存在时执行函数体
            pending[p].f(); //执行取消操作
            pending.splice(p, 1); //数组移除当前请求
        }
    }
}

// request拦截器
service.interceptors.request.use(config => {
  removePending(config); //在一个axios发送前执行一下取消操作
  config.cancelToken = new CancelToken(c =>{
    if(
      preventRequest.includes(config.url)
    ){
      pending.push({ u: config.url.split('?')[0] +'&' + config.method, f: c});//config.data为请求参数
    }
  })
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  if (getHeaderSystem() && notUseHeaderSystem.indexOf(config.url) === -1) {
    config.headers['System'] = getHeaderSystem()
  }
  config.headers['ClientId'] = "web"
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?';
    for (const propName of Object.keys(config.params)) {
      const value = config.params[propName];
      var part = encodeURIComponent(propName) + "=";
      if (value !== null && typeof (value) !== "undefined") {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            let params = propName + '[' + key + ']';
            var subPart = encodeURIComponent(params) + "=";
            url += subPart + encodeURIComponent(value[key]) + "&";
          }
        } else {
          url += part + encodeURIComponent(value) + "&";
        }
      }
    }
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  if(notShowLoadingList.indexOf(config.url) === -1){
    startLoading()
  }
  return config
}, error => {
    console.log(error)
    endLoading()
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
  let dis= res.headers['content-disposition']

  if(notShowLoadingList.indexOf(res.config.url) === -1) {
    endLoading()
  }
  const resCode = res.data.resCode;
  const msg = res.data.resMsg || (res.data.resData && res.data.resData.message);
  if (resCode) {
    if (resCode == "E00002") {
      if (showMsg) {
        return;
      }
      showMsg = true;
      MessageBox.confirm(msg, '系统提示', {
        confirmButtonText: '重新登录',
        showCancelButton: false,
        showClose: true,
        closeOnClickModal: false,
        type: 'warning' 
      }).then(() => {
        showMsg = false;
        if (!location || !location.href || !location.href.endsWith("smelogin")) {
          store.dispatch('FedLogOut').then(() => {
            store.dispatch('tagsView/delAllViews').then(() => {
              router.push("/login");
            })
          })
        }
      }).catch(() => {
        showMsg = false;
      })
    } else if (resCode.substr(0, 2) == "00" && resCode.substr(4, 2) == "00") {
      var code = res.data.resData && res.data.resData.code ? res.data.resData.code : ''
      if (code == "E00002") {
        if (showMsg) {
          return;
        }
        showMsg = true;
        MessageBox.confirm(msg, '系统提示', {
          confirmButtonText: '重新登录',
          showCancelButton: false,
          showClose: true,
          closeOnClickModal: false,
          type: 'warning' 
        }).then(() => {
          showMsg = false;
          if (!location || !location.href || !location.href.endsWith("smelogin")) {
            store.dispatch('FedLogOut').then(() => {
              store.dispatch('tagsView/delAllViews').then(() => {
                router.push("/login");
              })
            })
          }
        }).catch(() => {
          showMsg = false;
        })
      } else if (code == "E00103" || code == "E00003") {    // 缺少访问权限和登录的验证失败返回的状态码
        if (showMsg) {
          return;
        }
        showMsg = true;
        Notification.error({
          title: msg
        })
        setTimeout(() => {
          showMsg = false;
          // if (!location || !location.href || !location.href.endsWith("smelogin") || !location.href.endsWith("login")) {
          //   store.dispatch('FedLogOut').then(() => {
          //     store.dispatch('tagsView/delAllViews').then(() => {
          //       router.push("/login");
          //     })
          //   })
          // }
        }, 200)
        return;
      }
      // 部分成功页面需提示resMsg
      
      if (res.data.resData && !res.data.resData.resMsg) { // 防止resData为null不能赋值
        res.data.resData.resMsg = res.data.resMsg
      }
      return Promise.resolve(res.data.resData).catch((err) => err)
    } else {
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(msg)
    }
  } else {
    if (res.data.error) {
      Message({
        message: res.data.error_description,
        type: 'error'
      })
    } else {
      if(dis){
        // let fileName=decodeURIComponent(dis.split("attachment;filename=")[1])
        // res.data.fileName = fileName
        return res
      }else{
        let data = res.data
        let fileReader = new FileReader();
        fileReader.onload = function() {
          try{
            let jsonData = JSON.parse(this.result);
            if(jsonData.resMsg) {
              Message({
                message: jsonData.resMsg,
                type: 'error'
              })
            }
          }
          finally {}
        }
        fileReader.readAsText(data);
        return Promise.reject()
      }
    }

  }
},
  error => {
    endLoading()
    let { message } = error;
    if (message == "Network Error") {
      message = "当前网络差，请重新尝试";
    }
    else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service