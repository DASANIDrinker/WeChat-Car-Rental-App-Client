// pages/login/login.js
const promise = require('../../utils/requestUtil');
const app = getApp();
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUseGetUserProfile: true,
        checked: false,
        phone: String,
        logoImg:""
    },
    //复选框函数
    onChange(event) {
        this.setData({
            checked: event.detail,
        });
    },
    //微信登录
    async getUserProfile(e) {
        var that = this
        //如果没勾选隐私条例
        if (that.data.checked == false) {
            that.showToast()
            //如果勾选了隐私条例
        } else {
            // 所有会出现error的代码都放在try catch里面
            // 这样我们不需要单独处理每个error 所有的error都会被自动捕捉
            try {
                // 等待getUserProfile函数的结果
                //用promise和async await主要是为了避免回调地狱
                var getUserProfile = await promise.getUserProfile({ desc: '用于完善会员资料' })
                console.log(getUserProfile)
                //如果获取用户信息成功
                if (getUserProfile.errMsg == "getUserProfile:ok") {
                    wx.showLoading({ title: '登陆中', })
                    //检查本地缓存是否有accessToken 并且登陆
                    var login = await that.login()
                    console.log(login)
                    //将返回的请求参数设置给全局变量accessToken
                    app.globalData.accessToken = login.data
                    console.log(app.globalData.accessToken)
                    //确认登录状态
                    app.globalData.isLoggedIn = true
                    await promise.hideLoading()
                    //因为getUserProfile无法获取手机号
                    //但我们需要手机号和用户联络 所以我们将导航到输入手机号的页面
                    
                    // wx.showModal({
                    //     content: '我们需要您的手机号来和您保持联系,请您输入手机号',
                    //     showCancel: false,
                    //     confirmColor: "#012ea5",
                    //     success(res) {
                    //         if (res.confirm) {
                    //             wx.redirectTo({
                    //                 url: '../driverInfo/driverInfo',
                    //             })
                    //         }
                    //     }
                    // })
                    if(app.globalData.fromAccount == 1){
                        wx.navigateBack({
                            delta:1
                        })
                    }else if(app.globalData.fromAccount == 2){
                        wx.redirectTo({
                            url: '../review/review',
                        })
                    }
                    

                }
            }
            //catch会处理所有的异常 比如getUserProfile失败
            //getStorage失败 removeStorage失败等等
            catch (err) {
                console.log(err)
                wx.hideLoading()
                wx.showModal({ content: '微信登陆失败,请稍后再试', showCancel: false, confirmColor: "#012ea5" })
            }
        }
    },

    //判断AT是否存在来确定是否要去后端取AT
    async login() {
        console.log("进入判断登录逻辑函数")
        var that = this
        var timestamp = Date.parse(new Date());
        var expiration = timestamp + 86400000; //缓存1天
        // 清空本地缓存
        var clear = await promise.clearStorage();
        // console.log(clear)
        //获取本地缓存的所有keys
        //不用getStorageInfoSync函数是因为Sync版本没有返回resolve或者reject结果
        var cacheKeys = await promise.getStorageInfo()
        console.log(cacheKeys)
        //如果能获取到所有缓存的keys
        if (cacheKeys.errMsg == "getStorageInfo:ok") {
            //获取本地所有缓存的key
            var keys = cacheKeys.keys
            console.log(keys)
            var key
            //循环所有key 
            for (var i = 0; i < keys.length; i++) {
                //如果里面有我们的用户登录凭证accessToken
                if (keys[i].search("AT:") != -1) {
                    console.log(keys[i])
                    key = keys[i]
                }
            }
            console.log("keys:  " + keys)
            console.log(key)
            //如果没有key 也就是缓存为空
            if (!key) {
                console.log(expiration)
                //登录
                var login = await that.promisfyLogin(expiration)
                console.log("promisfy Login:"+login)
                //返回login给上层函数 getUserProfile或者getUserProfileByPhone
                return login
                //如果有key 也就是缓存不为空
            } else {
                //获取之前的缓存的时间
                // var data_expiration = wx.getStorageSync(key);
                var data_expiration = await promise.getStorage({ key: key })
                console.log(data_expiration)
                //如果缓存时间存在
                if (data_expiration.errMsg == "getStorage:ok") {
                    //如果当前时间超过之前设置的缓存时间 数据过期
                    if (timestamp > data_expiration.data) {
                        //删除数据
                        var remove = await wx.removeStorage({ key: key })//清理数据
                        console.log(remove)
                        //登录
                        var login = await that.promisfyLogin(expiration)//login获取数据
                        console.log(login)
                        // 返回login给上层函数 getUserProfile或者getUserProfileByPhone
                        return login
                    }
                    //当缓存时间仍未到期时
                    else {
                        console.log("缓存未到期")
                        console.log("Cache Time is: " + wx.getStorageSync(key))
                        console.log("Current Time is: " + timestamp)
                        //将accessToken的key的AT：去掉
                        var accessToken = key.slice(3)
                        console.log(accessToken)
                        // console.log(app.globalData.accessToken)
                        //按照data:accessToken格式返回 方便上层函数处理
                        var login = { data: accessToken }
                        return login
                    }
                }
                else {//缓存时间不存在 设置新缓存
                    //登录
                    var login = await that.promisfyLogin(expiration)
                    console.log(login)
                    // 返回login给上层函数 getUserProfile或者getUserProfileByPhone
                    return login
                }
            }
        }
    },

    //登录(后端获取AT)
    async promisfyLogin(expiration) {
        console.log("进入获取后端登录AT函数")
        var that = this
        //微信官方登录获取code
        var login = await promise.login()
        console.log(login)
        // 如果获取code成功
        if (login.errMsg == "login:ok") {
            // console.log("okkk")
            // 向后端发送获取openId请求
            var request = await promise.wxRequest({ url: '/user/getOpenId', method: "POST", data: { code: login.code }, header: { "Content-Type": "application/x-www-form-urlencoded" } })
            // var request = await wx.request({ url: '/user/getOpenId', method: "POST", data: { code: login.code }, header: { "Content-Type": "application/x-www-form-urlencoded" }})
            // var request = await promise.request({ url: '/user/getOpenId', method: "POST", data: { code: res.code }, header: { "Content-Type": "application/x-www-form-urlencoded" }})
            console.log(request)
            //如果请求成功
            if (request.errMsg == "request:ok") {
                console.log(request.data)
                //设置全局变量accessToken
                app.globalData.accessToken = request.data;
                console.log(expiration)
                //设置accessToken在本地的缓存
                var storage = await that.setCacheStorage(expiration)
                console.log(storage)
                //返回请求给上层函数 that.login
                return request
            }
        }
    },

    //设置缓存
    async setCacheStorage(expiration) {

        console.log("进入设置缓存AT函数")
        //将新的accessToken作为key拼接并缓存 缓存value为时间
        var cacheUpdatedKey = "AT:" + app.globalData.accessToken
        console.log(expiration)
        console.log(cacheUpdatedKey)
        //将cacheUpdatedKey作为key,expiration作为value储存
        var storage = await promise.setStorage({ key: cacheUpdatedKey, data: expiration })
        //返回储存信息给上层函数 promisfyLogin
        return storage
    },

    //手机号登录
    async getUserProfileByPhone(e) {
        var that = this
        // 如果没有勾选隐私协议
        if (that.data.checked == false) {
            that.showToast()

        }
        // 如果勾选了隐私协议
        else {
            try {
                console.log(e)
                //如果获取手机号code成功 code为后端向微信接口发送获取手机号
                //请求的凭证 
                if (e.detail.errMsg == 'getPhoneNumber:ok') {
                    wx.showLoading({ title: '登陆中', })
                    //code为用来向微信接口请求电话号码的参数
                    var code = e.detail.code
                    //向后端发送请求 请求微信接口的调用凭证
                    var ATResponse = await promise.wxRequest({ url: '/app/getAccessToken', method: "GET" })
                    // console.log(accessToken)
                    //如果获取微信接口调用凭证成功
                    if (ATResponse.errMsg == "request:ok") {
                        //保存微信接口调用凭证
                        var accessToken = ATResponse.data
                        // 获取电话号码
                        var phoneNumber = await promise.wxRequest({ url: '/app/getPhoneNumber', data: { accessToken, code } })
                        console.log(phoneNumber)
                        // 如果电话号码获取成功
                        if (phoneNumber.errMsg == "request:ok") {
                            // 根据后端判断 如果失败
                            if (phoneNumber.data[0] == "fail") {
                                wx.hideLoading()
                                wx.showModal({ content: '微信登陆失败,请稍后再试', showCancel: false, confirmColor: "#012ea5" })
                            }
                            // 如果电话区号为国内区号
                            else if (phoneNumber.data[1] == "86") {
                                //走登录流程
                                var login = await that.login()
                                console.log(login)
                                app.globalData.accessToken = login.data
                                app.globalData.phone = phoneNumber.data[0]
                                //确认登录状态
                                app.globalData.isLoggedIn = true
                                console.log(app.globalData.phone)
                                console.log(app.globalData.accessToken)
                                wx.hideLoading()
                                wx.redirectTo({
                                  url: '../review/review',
                                })
                            }
                            // 除上面两种情况外 全部按错误处理
                            else {
                                wx.hideLoading()
                                wx.showModal({ content: '检测到您的手机号为国外手机号,请您用国内手机号登录', showCancel: false, confirmColor: "#012ea5" })
                            }
                        }
                    }
                }
                // 如果出现error 那么就提示错误
            } catch (err) {
                wx.hideLoading()
                wx.showModal({ content: '微信登陆失败,请稍后再试', showCancel: false, confirmColor: "#012ea5" })
            }

        }
    },



    //轻提示 提示登录需要先同意隐私和服务协议
    showToast() {
        Toast({
            message: "请您同意服务协议和隐私政策",
            position: 'center',
            duration: 1500,
            context: this
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        promise.wxRequest({
            url:'/img/Logo/dfssLogo.jpg',
            responseType: 'arraybuffer',
        }).then(res=>{
            let img = 'data:image/png;base64,' + wx.arrayBufferToBase64(res.data)
            this.setData({
                logoImg:img
            })
        }).catch(err=>{

        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})
