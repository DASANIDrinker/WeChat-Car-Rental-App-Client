// pages/chooseDriver/chooseDriver.js
const promise = require('../../utils/requestUtil')
const app = getApp();
const util = require('../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //存后端取回的司机
        drivers: [],
        paySign: "",
        nonceStr: "",
        package: "",
        signType: "",
        timeStamp: "",
        outTradeNo: ""
        // driver1:{},
        // driver2:{},
        // driver3:{}
    },

    //后端删除司机 并且更新前端
    async deleteDriver(e) {
        var id = e.currentTarget.dataset.id
        var that = this
        await promise.wxRequest({
            url: '/driver/deleteDriver',
            data: {
                id: that.data.drivers[id].id
            }
        }).then(res => {
            console.log(res)
            if (res.data == "success") {
                console.log(that.data.drivers)
                that.data.drivers.splice(id, 1)
                var drivers = that.data.drivers
                // drivers.splice(id,1)
                console.log(drivers)
                that.setData({
                    drivers: drivers
                })
            }
        }).catch(fail => {

        })

        //如果没有任何司机 那么review界面也不显示选中的司机
        if (that.data.drivers.length == 0) {
            app.globalData.Driver.id = ''
            app.globalData.Driver.name = ''
        }

    },

    //添加司机 必须限制每天添加的次数 不然OCR识别次数会不够
    async createDriver() {
        var that = this
        var timestamp = Date.parse(new Date());
        var expiration = timestamp + 86400000;
        var attemptPerDay = 3;
        // var attemptKey = "createDriverAttempt"
        // var expirationKey = "driverAttemptExpiration"
        try {
            // var clear = await promise.clearStorage()
            // console.log(clear)
            var cacheKeys = await promise.getStorageInfo()
            console.log(cacheKeys)
            var keys = cacheKeys.keys
            var attemptKey;
            var expirationKey;
            //createDriverAttempt钥匙对应每天可以尝试的次数
            //driverAttemptExpiration钥匙对应一天 
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] == "createDriverAttempt") {
                    attemptKey = keys[i]
                }
                if (keys[i] == "driverAttemptExpiration") {
                    expirationKey = keys[i]
                }
            }
            console.log(attemptKey)
            console.log(expirationKey)
            // console.log(111222)
            // 如果两个钥匙都存在
            if (attemptKey && expirationKey) {
                // console.log(111)
                var attemptResult = await promise.getStorage({ key: attemptKey })
                console.log(attemptResult)
                var expirationResult = await promise.getStorage({ key: expirationKey })
                console.log(expirationResult)
                // 如果缓存过期
                if (timestamp > expirationResult.data) {
                    var removeAttempt = await promise.removeStorage({ key: attemptKey })
                    console.log(removeAttempt)
                    var removeAttemptExpiration = await promise.removeStorage({ key: expirationKey })
                    console.log(removeAttemptExpiration)
                    var setAttempt = await promise.setStorage({ key: attemptKey, data: attemptPerDay })
                    console.log(setAttempt)
                    var setAttemptExpiration = await promise.setStorage({ key: expirationKey, data: expiration })
                    console.log(setAttemptExpiration)
                    var attemptResult = await promise.getStorage({ key: attemptKey })
                    console.log(attemptResult)
                    // 如果次数为0
                    if (attemptResult.data == 0) {
                        console.log(attemptResult.data)
                        wx.showModal({
                            content: '每天最多上传三次证件,您今天的限额已用完',
                            showCancel: false,
                            confirmColor: "#012ea5"
                        })
                    }
                    // 如果次数不为0
                    else {
                        // var attempt = attemptResult.data - 1
                        // var newSet = await promise.setStorage({ key: 'createDriverAttempt', data: attempt })
                        // console.log(newSet)
                        await wx.navigateTo({
                            url: '../uploadID/uploadID',
                        })
                    }
                }
                // 如果钥匙还没过期
                else {
                    //恢复
                    // 如果没有次数了
                    if (attemptResult.data == 0) {
                        console.log(attemptResult.data)
                        wx.showModal({
                            content: '每天最多上传三次证件,您今天的限额已用完',
                            showCancel: false,
                            confirmColor: "#012ea5"
                        })
                    }
                    // 如果还有次数


                    else {
                        var attempt = attemptResult.data - 1
                        var newSet = await promise.setStorage({ key: 'createDriverAttempt', data: attempt })
                        console.log(newSet)
                        await wx.navigateTo({
                            url: '../uploadID/uploadID',
                        })

                        //恢复 
                    }


                }
            }
            // 如果两个钥匙某一个或者两个或者都不存在
            else {
                var setAttempt = await promise.setStorage({ key: 'createDriverAttempt', data: attemptPerDay })
                console.log(setAttempt)
                var setAttemptExpiration = await promise.setStorage({ key: 'driverAttemptExpiration', data: expiration })
                console.log(setAttemptExpiration)
                var attemptResult = await promise.getStorage({ key: 'createDriverAttempt' })
                console.log(attemptResult)
                if (attemptResult.data == 0) {
                    console.log(attemptResult.data)
                    wx.showModal({
                        content: '每天最多上传三次证件,您今天的限额已用完',
                        showCancel: false,
                        confirmColor: "#012ea5"
                    })
                } else {
                    // var attempt = attemptResult.data - 1
                    // var newSet = await promise.setStorage({ key: 'createDriverAttempt', data: attempt })
                    // console.log(newSet)
                    await wx.navigateTo({
                        url: '../uploadID/uploadID',
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }




        // await wx.navigateTo({
        //     url: '../uploadID/uploadID',
        // })
    },
    async confirmDriver(e) {
        var that = this
        //获取选择的驾驶员身份信息
        var number = e.currentTarget.dataset.id
        //设置全局驾驶员身份信息
        app.globalData.Driver.name = that.data.drivers[number].name
        app.globalData.Driver.id = that.data.drivers[number].id
        console.log(app.globalData.total)
        console.log(app.globalData.accessToken)
        // wx.navigateBack({
        //     delta: 1,
        // })
        try {
            var showModal = await promise.wxPromisify("showModal",
                {
                    content: '是否确认下单?\r\n'
                        + '总金额:' + app.globalData.total + '元\r\n'
                        + '租用车辆:' + app.globalData.vehicle.brand + ' ' + app.globalData.vehicle.model + '\r\n'
                        + '租用天数:' + app.globalData.dayInBetween + '天\r\n'
                        + '联系电话:' + app.globalData.phone + '\r\n',
                    showCancel: true,
                    confirmColor: "#012ea5",
                    cancelColor: "#FF0000",
                    // success (res) {
                    //     if(res.confirm){
                })
            console.log(showModal)
            if (showModal.errMsg == "showModal:ok" && showModal.confirm == true) {
                wx.showLoading({ title: '处理支付中,请稍候' })
                var initializePayment = await promise.wxRequest({
                    url: '/wxpay/weixin/payment',
                    method: "POST",
                    data: {
                        //  bookingNo:bookingNo, /*订单号*/
                        total: app.globalData.total,  /*订单金额*/
                        accessToken: app.globalData.accessToken
                    },
                    header: { "Content-Type": "application/x-www-form-urlencoded" }
                })
                console.log(initializePayment)
                if (initializePayment.errMsg == "request:ok") {
                    that.data.paySign = initializePayment.data.data.paySign
                    that.data.timeStamp = initializePayment.data.data.timeStamp
                    that.data.nonceStr = initializePayment.data.data.nonceStr
                    that.data.package = initializePayment.data.data.package
                    that.data.signType = initializePayment.data.data.signType
                    that.data.outTradeNo = initializePayment.data.data.outTradeNo
                    var requestPayment = await wx.requestPayment({
                        //时间戳
                        'timeStamp': that.data.timeStamp,
                        'nonceStr': that.data.nonceStr, //随机串
                        'package': that.data.package, //配置支付id值
                        'signType': 'MD5',//微信签名方式
                        'paySign': that.data.paySign,
                    })
                    console.log(requestPayment)
                    if (requestPayment.errMsg == "requestPayment:ok") {
                        //支付成功之后 向数据库插入支付订单
                        var insertPayments = await promise.wxRequest({
                            url: '/paymentorders/insert',
                            data: {
                                sign: that.data.paySign,
                                outTradeNo: that.data.outTradeNo
                            },
                            method: "POST",
                            header: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            }
                        })
                        console.log(insertPayments)
                        if (insertPayments.errMsg == "request:ok") {
                            //插入支付订单成功后 向数据库插入订单
                            // 2022/1/1 替换为 2022-1-1 为了对应后端的时间格式
                            var startDate = app.globalData.timeCurrent.toString().replace(/\//g, "-").concat(":00")
                            var endDate = app.globalData.timeEnd.toString().replace(/\//g, "-").concat(":00")

                            var insertOrder = await promise.wxRequest({
                                url: '/orders/insert',
                                data: {
                                    vehicleTypeId: app.globalData.vehicle.vehicleTypeId,
                                    id: app.globalData.Driver.id,
                                    sign: that.data.paySign,
                                    phone: app.globalData.phone,
                                    accessToken: app.globalData.accessToken,
                                    startDate: startDate,
                                    endDate: endDate,
                                    pickUpLocationId: 1,
                                    dropOffLocationId: 1,
                                    orderStatusId: 5,
                                    days: app.globalData.dayInBetween,
                                    total: app.globalData.total,
                                    name: app.globalData.Driver.name
                                },
                                method: "POST",
                                header: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                }
                            })
                            if (insertOrder.errMsg == "request:ok") {
                                var updatePhone = await promise.wxRequest({
                                    url: "/user/updatePhone",
                                    data: {
                                        phone: app.globalData.phone,
                                        accessToken: app.globalData.accessToken
                                    },
                                    method: "POST",
                                    header: {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    }
                                })
                                console.log(updatePhone)
                                //只有在最后所有都成功时 才能提示支付成功并跳转主页
                                if (updatePhone.errMsg == "request:ok") {
                                    await promise.hideLoading()
                                    // await promise.showToast({
                                    //     title: '订单支付成功,即将跳转主页',
                                    //     icon: 'success',
                                    //     duration: 5500
                                    // })
                                    // await promise.switchTab({
                                    //     url: '../home/home',
                                    // })

                                    wx.showToast({
                                        title: '订单支付成功,即将跳转主页',
                                        icon: 'success',
                                        duration: 2000,
                                        success: function () {
                                            setTimeout(function () {
                                                wx.switchTab({
                                                    url: '../home/home',
                                                })
                                            }, 2000);
                                        }
                                    })
                                }
                            }
                            console.log(insertOrder)
                        }

                    }
                }
                await promise.hideLoading()
                // await promise.showToast({
                //     title: '订单支付失败',
                //     icon: 'error',
                //     duration: 1500
                // })
            }
        } catch (err) {
            console.log(err)
            await promise.hideLoading()
            await promise.showToast({
                title: '订单支付失败',
                icon: 'error',
                duration: 1500
            })
        }
    },







    // promise.wxRequest({url:'/wxpay/weixin/payment',
    // method:"POST",
    // data: {
    //     //  bookingNo:bookingNo, /*订单号*/
    //     total:app.globalData.total,  /*订单金额*/
    //     accessToken:app.globalData.accessToken
    //     },
    // header:{"Content-Type":"application/x-www-form-urlencoded"}
    // }).then(res => {
    //     that.data.paySign = res.data.data.paySign
    //     console.log(res)
    //     wx.requestPayment({
    //         //时间戳
    //         'timeStamp':res.data.data.timeStamp,
    //         'nonceStr': res.data.data.nonceStr, //随机串
    //         'package': res.data.data.package, //配置支付id值
    //         'signType': 'MD5',//微信签名方式
    //         'paySign': res.data.data.paySign, //微信签名
    //         //成功后
    //         'success':function(res){ 
    //             console.log(res);
    //             //支付成功之后 向数据库插入支付订单
    //             promise.wxRequest({
    //                 url: '/paymentorders/insert',
    //                 data:{sign:that.data.paySign},
    //                 method: "POST",
    //                 header: {
    //                     "Content-Type": "application/x-www-form-urlencoded"
    //                 }
    //             }).then(res=>{
    //                 //插入支付订单成功后 向数据库插入订单
    //                 console.log(res)
    //                 // 2022/1/1 替换为 2022-1-1 为了对应后端的时间格式
    //                 var startDate = app.globalData.timeCurrent.toString().replace(/\//g, "-").concat(":00")
    //                 var endDate = app.globalData.timeEnd.toString().replace(/\//g, "-").concat(":00")

    //                 promise.wxRequest({
    //                     url: '/orders/insert',
    //                     data:{
    //                         vehicleTypeId:app.globalData.vehicle.vehicleTypeId,
    //                         id:app.globalData.idHolder.id,
    //                         sign:that.data.paySign,
    //                         phone:app.globalData.phone,
    //                         accessToken:app.globalData.accessToken,
    //                         startDate:startDate,
    //                         endDate:endDate,
    //                         pickUpLocationId:6,
    //                         dropOffLocationId:6,
    //                         orderStatusId:5,
    //                         days:app.globalData.dayInBetween,
    //                         total:app.globalData.total
    //                     },
    //                     method: "POST",
    //                     header: {
    //                         "Content-Type": "application/x-www-form-urlencoded"
    //                     }
    //                 }).then(res=>{
    //                     console.log(res)

    //                 }).catch(fail=>{
    //                     console.log(fail)
    //                 })


    //             }).catch(fail=>{
    //                 console.log(fail)
    //             })
    //         },
    //         'fail':function(res){
    //             console.log(res);
    //         }
    //         })
    //     }).catch(fail => {

    //     })

    // }else if(res.cancel){
    //     console.log(res.cancel)
    // }


    // wx.request({
    //     url: 'https://localhost:8081/wxpay/weixin/payment', 
    //     method: 'POST',
    //     data: {
    //     //  bookingNo:bookingNo, /*订单号*/
    //      total:app.globalData.total,  /*订单金额*/
    //      accessToken:app.globalData.accessToken
    //     },
    //     header: {
    //       'content-type': 'application/json'
    //     },
    //     success: function(res) {
    //       wx.requestPayment({
    //       //时间戳
    //        'timeStamp':res.data.timeStamp,
    //        'nonceStr': res.data.nonceStr, //随机串
    //        'package': 'prepay_id='+res.data.prepay_id, //配置支付id值
    //        'signType': 'MD5',//微信签名方式
    //        'paySign': res.data.paySign, //微信签名
    //        //成功后
    //        'success':function(res){ 
    //          console.log(res);
    //        },
    //        'fail':function(res){
    //          console.log('fail:'+JSON.stringify(res));
    //        }
    //       })
    //     },
    //     fail: function(err) {
    //       console.log(err)
    //     }
    //   })



    // initializePayment(){
    //     promise.wxRequest({
    //             url:'/wxpay/weixin/payment',
    //             method:"POST",
    //             data: {
    //                 //  bookingNo:bookingNo, /*订单号*/
    //                 total:app.globalData.total,  /*订单金额*/
    //                 accessToken:app.globalData.accessToken
    //                 },
    //             header:{"Content-Type":"application/x-www-form-urlencoded"}
    //             }).then(res => {

    //             }).catch(fail=>{

    //             })
    // },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // app.globalData.accessToken = 1234730138
        var that = this
        try {
            promise.wxRequest({
                url: '/driver/getDriversByAT',
                data: {
                    accessToken: app.globalData.accessToken
                }
            }).then(res => {
                // that.data.drivers = res.data
                that.setData({
                    drivers: res.data
                })
                console.log(res)
            })
        } catch (error) {

        }


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