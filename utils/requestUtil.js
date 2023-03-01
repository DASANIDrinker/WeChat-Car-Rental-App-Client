// const baseUrl = "http://localhost:8081";
// const baseUrl = "http://192.168.64.130:8081";
const baseUrl = "http://10.2.0.249:8081";

//返回设定好的跟路径
function getBaseUrl(){
    return baseUrl;
}

//后端请求Promise化  只用于request
function wxRequest (params) {
  // return async function(){
    return new Promise((reslove,reject)=>{
        wx.request({
            //将params拆分为不同部分
            //eg. url:'http:......', method:'...'
          ...params,
          //将传过来的url拼接上当前的根路径
          url:baseUrl + params.url,
          success:(res)=>{
            // console.log(res)
              // var result = res
              reslove(res)
          },
          fail:(err)=>{
              reject(err)
          }

        })
    });
  // }
}

/**
 * promise化接口对应login userinfo等api
 */
function wxPromisify(functionName, params) {
    return new Promise((resolve, reject) => {
      wx[functionName]({
        ...params,
        success: res => resolve(res),
        fail: err => reject(err)
        // fail: (res => {
        //     console.log(res)
        // })
      });
    });
  }
  
  /**
   * 登录
   */
  function login(params) {
    return wxPromisify('login', params);
  }
  
  /**
   * 获取用户信息
   */
  function getUserInfo(params) {
    return wxPromisify('getUserInfo', params);
  }
  
  /**
   * 获取用户权限
   */
  function getSetting(params) {
    return wxPromisify('getSetting', params);
  }

  //获取本地缓存的信息 包括keys currentSize 当前占用空间 limitSize限制占用空间
  function getStorageInfoSync(){
      return wxPromisify('getStorageInfoSync')
  }
  
  //获取本地缓存中指定key的内容
  function getStorageSync(params){
      return wxPromisify('getStorageSync',params)
  }

  //删除指定key的缓存
  function removeStorage(params){
      return wxPromisify('removeStorage',params)
  }

  //设置指定key和指定内容
  function setStorage(params){
      return wxPromisify('setStorage',params)
  }

  function checkSession(params){
      return wxPromisify('checkSession',params)
  }

  function uploadFile(params){
      return wxPromisify('uploadFile',params)
  }
  
  function getUserProfile(params){
      return wxPromisify('getUserProfile',params)
  }

  function clearStorageSync(params){
    return wxPromisify('clearStorageSync',params)
  }

  function clearStorage(params){
    return wxPromisify('clearStorage',params)
  }
  
  function getStorageInfo(params){
    return wxPromisify('getStorageInfo',params)
  }

  function getStorage(params){
    return wxPromisify('getStorage',params)
  }
  
  function hideLoading(params){
    return wxPromisify('hideLoading',params)
  }

  function chooseMedia(params){
    return wxPromisify('chooseMedia',params)
  }

  function showModal(params){
    return wxPromisify('showModal',params)
  }

  function navigateTo(params){
    return  wxPromisify('navigateTo',params)
  }

  function showToast(params){
    return  wxPromisify('showToast',params)
  }

  function switchTab(params){
    return  wxPromisify('switchTab',params)
  }


  module.exports = {
    wxRequest,
    login,
    getUserInfo,
    getSetting,
    getBaseUrl,
    getStorageInfoSync,
    getStorageSync,
    removeStorage,
    setStorage,
    // wxPromisfyForCache
    checkSession,
    uploadFile,
    getUserProfile,
    clearStorageSync,
    clearStorage,
    getStorageInfo,
    // getStorageInfoSync,
    getStorage,
    hideLoading,
    chooseMedia,
    showModal,
    navigateTo,
    wxPromisify,
    showToast,
    switchTab
  }


