// pages/confirmation/confirmation.js
const promise = require('../../utils/requestUtil')
const app = getApp();
const util = require('../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    async getUserProfile(e) {
        var that = this
        //如果没勾选隐私条例
        if (this.data.checked == false) {
            this.showToast()
            //如果勾选了隐私条例
        } else {
            try {
                var getUserProfile = await promise.getUserProfile({ desc: '用于完善会员资料' })
                console.log(getUserProfile)
                if (getUserProfile.errMsg == "getUserProfile:ok") {
                    wx.showLoading({ title: '登陆中', })
                    var login = await that.login()
                    console.log(login)
                    wx.hideLoading()
                    // wx.redirectTo({
                    //   url: '../review/review',
                    // })
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
        var that = this
        var timestamp = Date.parse(new Date());
        var expiration = timestamp + 86400000; //缓存1天
        // 清空本地缓存
        var clear = await promise.clearStorage();
        console.log(clear)
        //获取本地缓存的所有keys
        var cacheKeys = await promise.getStorageInfo()
        console.log(cacheKeys)
        //如果能获取到所有缓存的keys
        if (cacheKeys.errMsg == "getStorageInfo:ok") {
            //获取本地所有缓存的key
            var keys = cacheKeys.keys
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
            //如果没有key 也就是缓存为空
            if (!key) {
                console.log(expiration)
                var login = await that.promisfyLogin(expiration)
                //如果有key 也就是缓存不为空
            } else {
                //获取之前的缓存的时间
                // var data_expiration = wx.getStorageSync(key);
                var data_expiration = await promise.getStorage({key:key})
                console.log(data_expiration)
                //如果缓存时间存在
                if (data_expiration.errMsg =="getStorage:ok") {
                    //如果当前时间超过之前设置的缓存时间 数据过期
                    if (timestamp > data_expiration.data) {
                        var remove = await wx.removeStorage({key:key})//清理数据
                        console.log(remove)
                        var login = await that.promisfyLogin(expiration)//login获取数据
                        console.log(login)
                    }
                    //当缓存时间仍未到期时
                    else {
                        console.log("缓存未到期")
                        console.log("Cache Time is: " + wx.getStorageSync(key))
                        console.log("Current Time is: " + timestamp)
                    }
                }
                 else {//缓存时间不存在 设置新缓存
                    var login = await that.promisfyLogin(expiration)
                    console.log(login)
                }
            }
        }
    },

    //登录(后端获取AT)
    async promisfyLogin(expiration) {
        var that = this
        var login = await promise.login()
        console.log(login)

        if (login.errMsg == "login:ok") {
            console.log("okkk")
            var request = await promise.wxRequest({ url: '/user/getOpenId', method: "POST", data: { code: login.code }, header: { "Content-Type": "application/x-www-form-urlencoded" } })
            // var request = await wx.request({ url: '/user/getOpenId', method: "POST", data: { code: login.code }, header: { "Content-Type": "application/x-www-form-urlencoded" }})
            // var request = await promise.request({ url: '/user/getOpenId', method: "POST", data: { code: res.code }, header: { "Content-Type": "application/x-www-form-urlencoded" }})
            console.log(request)
            if (request.errMsg == "request:ok") {
                app.globalData.accessToken = request.data;
                console.log(expiration)
                var storage = await that.setCacheStorage(expiration)
                console.log(storage)
                return storage
            }
        } 
    },

    //设置缓存
    async setCacheStorage(expiration) {
        // return new Promise((resolve, reject) => {
        var that = this
        //将新的accessToken作为key拼接并缓存 缓存value为时间
        var cacheUpdatedKey = "AT:" + app.globalData.accessToken
        console.log(expiration)
        console.log(cacheUpdatedKey)
        var date = new Date();
        // var milliSecond = date.getMilliseconds();
        var second = date.getSeconds();

        do {
            //将cacheUpdatedKey作为key,expiration作为value储存
            var storage = await promise.setStorage({ key: cacheUpdatedKey, data: expiration })
            //如果时间超过2秒钟
            if (util.terminateLoop(second)) {
                break;
            }
        } while (storage.errMsg != "setStorage:ok")

        if (storage.errMsg != "setStorage:ok") {
            return;
        } else {
            return storage;
        }
    },

    async getUserProfileByPhone(e){
        var that = this
        if (that.data.checked == false) {
            that.showToast()
        } else {
            try{
                console.log(e)
            //如果获取手机号code成功 code为后端向微信接口发送获取手机号
            //请求的凭证 
            if (e.detail.errMsg == 'getPhoneNumber:ok') {
                wx.showLoading({title: '登陆中',})
                var code = e.detail.code
                var ATResponse = await promise.wxRequest({url:'/app/getAccessToken',method:"GET"})
                // console.log(accessToken)
                if(ATResponse.errMsg == "request:ok"){
                    var accessToken = ATResponse.data
                    var phoneNumber = await promise.wxRequest({url:'/app/getPhoneNumber',data:{accessToken,code}})
                    console.log(phoneNumber)
                    if(phoneNumber.errMsg == "request:ok"){
                        if(phoneNumber.data[0] == "fail"){
                            wx.hideLoading()
                            wx.showModal({ content: '微信登陆失败,请稍后再试', showCancel: false, confirmColor: "#012ea5" })
                        }else if(phoneNumber.data[1] == "86"){
                            var login = await that.login()
                            console.log(login)
                        }else{
                            wx.hideLoading()
                            wx.showModal({ content: '检测到您的手机号为国外手机号,请您用国内手机号登录', showCancel: false, confirmColor: "#012ea5" })
                        }
                    }
                }
            }
            }catch(err){
                wx.hideLoading()
                wx.showModal({ content: '微信登陆失败,请稍后再试', showCancel: false, confirmColor: "#012ea5" })
            }
            
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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