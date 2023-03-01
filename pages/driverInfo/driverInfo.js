// pages/driverInfo/driverInfo.js
const util = require('../../utils/util');
const app = getApp();
const promise = require('../../utils/requestUtil');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // userName:String,
        // id:String,
        // phone:String,
        // userName:"",
        // id:"",
        // phone:"",
        userName: { type: String, value: '' },
        id: { type: String, value: '' },
        phone: { type: String, value: '' },
        errorMessageUser: '',
        errorMessageId: '',
        errorMessagePhone: '',
        display: false,
        userNameValid: false,
        idValid: false,
        phoneValid: false,
        paySign: "",
        outTradeNo: ""
    },
    changeUserName(e) {
        this.data.userName = e.detail
        // if(e.detail.length == 0){
        this.setData({
            errorMessageUser: '',
            userNameValid: false
        })
        // }
    },

    changeId(e) {
        this.data.id = e.detail
        // if(e.detail.length == 0){
        this.setData({
            errorMessageId: '',
            idValid: false
        })
        // }
    },

    changePhone(e) {
        this.data.phone = e.detail
        // if(e.detail.length == 0){
        this.setData({
            errorMessagePhone: '',
            phoneValid: false
        })
        // }
    },

    async saveInfo() {
        var _this = this
        //以下为手机号格式检查
        const regexPhone = /^(((1[35789][0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        if (this.data.phone == undefined) {
            this.setData({
                errorMessagePhone: '手机号不能为空,请重新输入'
            })
        } else if (this.data.phone.length != 0 && this.data.phone.length != 11) {
            this.setData({
                errorMessagePhone: '手机号长度有误,请重新输入'
            })
        } else if (this.data.phone.length != 0 && !regexPhone.test(this.data.phone)) {
            this.setData({
                errorMessagePhone: '手机号格式有误,请重新输入'
            })
            // 格式符合时 保存
        } else {

            _this.data.phoneValid = true
            app.globalData.phone = _this.data.phone
            console.log(app.globalData.phone)


            // wx.redirectTo({
            //   url: '../review/review',
            // })
        }

        //检查身份证信息
        console.log(this.data.id)
        var idResult = util.identityCodeValid(this.data.id)
        console.log(idResult)
        if (idResult[0] == false) {
            this.setData({
                errorMessageId: idResult[1]
            })
        } else if (idResult[0] == true) {
            _this.data.idValid = true
        }

        //检查用户姓名
        var regName = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,6}$/;
        if (this.data.userName == undefined) {
            this.setData({
                errorMessageUser: '用户姓名长度为空,请重新输入'
            })
        } else if (!regName.test(this.data.userName)) {
            this.setData({
                errorMessageUser: '用户姓名格式错误,请重新输入'
            })
        } else {
            _this.data.userNameValid = true
        }

        if (_this.data.userNameValid && _this.data.phoneValid && _this.data.idValid) {
            // 如果是在线下单的话
            if (app.globalData.isReservation == 1) {
                // 如果规格不符合 为空
                // if (app.globalData.idHolder.id == '' || app.globalData.licenseHolder.id == '') {
                //     try {
                //         promise.showModal({
                //             content: '租车人身份信息未上传,请点击确认进行上传',
                //             showCancel: false,
                //             confirmColor: "#012ea5",
                //         }).then(res => {
                //             if (res.confirm) {
                //                 wx.redirectTo({
                //                     url: '../chooseDriver/chooseDriver',
                //                 })
                //             }
                //         })
                //     } catch (err) {

                //     }
                // }
                // // 如果规格不符合 身份不相等
                // if (app.globalData.idHolder.id != app.globalData.licenseHolder.id) {
                //     try {
                //         promise.showModal({
                //             content: '租车人的身份证信息和驾驶证信息不匹配,请上传匹配的信息',
                //             showCancel: false,
                //             confirmColor: "#012ea5",
                //         }).then(res => {
                //             if (res.confirm) {
                //                 wx.redirectTo({
                //                     url: '../uploadID/uploadID',
                //                 })
                //             }
                //         })
                //     } catch (err) {
                //     }

                // }
                wx.redirectTo({
                    url: '../chooseDriver/chooseDriver',
                })
            }
            //如果是在线预订的话
            else if (app.globalData.isReservation == 2) {
                app.globalData.Driver.id = _this.data.id
                app.globalData.Driver.name = _this.data.userName

                try {
                    var showModal = await promise.wxPromisify("showModal",
                        {
                            content: '是否确认预定?\r\n'
                                + '总金额:' + app.globalData.total + '元\r\n'
                                + '租用车辆:' + app.globalData.vehicle.brand + ' ' + app.globalData.vehicle.model + '\r\n'
                                + '租用天数:' + app.globalData.dayInBetween + '天\r\n'
                                + '联系电话:' + app.globalData.phone + '\r\n',
                            showCancel: true,
                            confirmColor: "#012ea5",
                            cancelColor: "#FF0000",
                        })
                    console.log(showModal)
                    if (showModal.errMsg == "showModal:ok" && showModal.confirm == true) {
                        wx.showLoading({ title: '处理支付中,请稍候' })
                        var initializePayment = await promise.wxRequest({
                            url: '/wxpay/weixin/payment',
                            method: "POST",
                            data: {
                                //  bookingNo:bookingNo, /*订单号*/
                                total: 80,  /*订单金额*/
                                accessToken: app.globalData.accessToken
                            },
                            header: { "Content-Type": "application/x-www-form-urlencoded" }
                        })
                        console.log(initializePayment)
                        if (initializePayment.errMsg == "request:ok") {
                            _this.data.paySign = initializePayment.data.data.paySign
                            _this.data.timeStamp = initializePayment.data.data.timeStamp
                            _this.data.nonceStr = initializePayment.data.data.nonceStr
                            _this.data.package = initializePayment.data.data.package
                            _this.data.signType = initializePayment.data.data.signType
                            _this.data.outTradeNo = initializePayment.data.data.outTradeNo
                            var requestPayment = await wx.requestPayment({
                                //时间戳
                                'timeStamp': _this.data.timeStamp,
                                'nonceStr': _this.data.nonceStr, //随机串
                                'package': _this.data.package, //配置支付id值
                                'signType': 'MD5',//微信签名方式
                                'paySign': _this.data.paySign,
                            })
                            console.log(requestPayment)
                            if (requestPayment.errMsg == "requestPayment:ok") {
                                //支付成功之后 向数据库插入支付订单
                                var insertPayments = await promise.wxRequest({
                                    url: '/paymentorders/insert',
                                    data: {
                                        sign: _this.data.paySign,
                                        outTradeNo: _this.data.outTradeNo
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
                                        url: '/reservation/insert',
                                        data: {
                                            vehicleTypeId: app.globalData.vehicle.vehicleTypeId,
                                            id: app.globalData.Driver.id,
                                            sign: _this.data.paySign,
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
                                    console.log(insertOrder)

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
                                            //     duration: 1500
                                            // })
                                            // wx.switchTab({
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



                                    //以下为查询订单支付情况的请求代码
                                    // if(insertOrder.errMsg == "request:ok"){
                                    //     var orderQuery = await promise.wxRequest({
                                    //         url:"/wxpay/weixin/orderQuery",
                                    //         data:{paySign:_this.data.paySign},
                                    //         method: "POST",
                                    //         header: {
                                    //             "Content-Type": "application/x-www-form-urlencoded"
                                    //         }
                                    //     })
                                    // }
                                    // console.log(orderQuery)


                                }
                            }
                        }
                        await promise.hideLoading()
                        // await promise.showToast({
                        //     title: '订单支付失败',
                        //     icon: 'error',
                        //     duration: 1500
                        // })



                        //向我们的服务器发送生成订单的请求
                        // promise.wxRequest({
                        //     url: '/wxpay/weixin/payment',
                        //     method: "POST",
                        //     data: {
                        //         //  bookingNo:bookingNo, /*订单号*/
                        //         total: 80,  /*订单金额*/
                        //         accessToken: app.globalData.accessToken
                        //     },
                        //     header: { "Content-Type": "application/x-www-form-urlencoded" }
                        // }).then(res => {
                        //     console.log(res)
                        //     _this.data.paySign = res.data.data.paySign
                        //     //如果生成预付单成功 那么请求支付
                        //     wx.requestPayment({
                        //         //时间戳
                        //         'timeStamp': res.data.data.timeStamp,
                        //         'nonceStr': res.data.data.nonceStr, //随机串
                        //         'package': res.data.data.package, //配置支付id值
                        //         'signType': 'MD5',//微信签名方式
                        //         'paySign': res.data.data.paySign, //微信签名
                        //         //成功后
                        //         'success': function (res) {
                        //             //如果支付成功 向数据库插入新的支付订单
                        //             promise.wxRequest({
                        //                 url: '/paymentorders/insert',
                        //                 data: { sign: _this.data.paySign },
                        //                 method: "POST",
                        //                 header: {
                        //                     "Content-Type": "application/x-www-form-urlencoded"
                        //                 }
                        //             }).then(res => {
                        //                 console.log(res)
                        //                 //如果插入新的支付订单成功 向数据库插入新的预约订单
                        //                 promise.wxRequest({
                        //                     url: '/reservation/insert',
                        //                     data: {
                        //                         name: _this.data.userName,
                        //                         id: _this.data.id,
                        //                         phone: _this.data.phone,
                        //                         accessToken: app.globalData.accessToken
                        //                     },
                        //                     method: "POST",
                        //                     header: {
                        //                         "Content-Type": "application/x-www-form-urlencoded"
                        //                     }
                        //                 }).then(res => {
                        //                     console.log(res)
                        //                     var startDate = app.globalData.timeCurrent.toString().replace(/\//g, "-").concat(":00")
                        //                     var endDate = app.globalData.timeEnd.toString().replace(/\//g, "-").concat(":00")

                        //                     promise.wxRequest({
                        //                         url: '/orders/insert',
                        //                         data: {
                        //                             vehicleTypeId: app.globalData.vehicle.vehicleTypeId,
                        //                             id: app.globalData.idHolder.id,
                        //                             sign: _this.data.paySign,
                        //                             phone: app.globalData.phone,
                        //                             accessToken: app.globalData.accessToken,
                        //                             startDate: startDate,
                        //                             endDate: endDate,
                        //                             pickUpLocationId: 6,
                        //                             dropOffLocationId: 6,
                        //                             orderStatusId: 5,
                        //                             days: app.globalData.dayInBetween,
                        //                             total: app.globalData.total
                        //                         },
                        //                         method: "POST",
                        //                         header: {
                        //                             "Content-Type": "application/x-www-form-urlencoded"
                        //                         }
                        //                     }).then(res => {
                        //                         console.log(res)

                        //                     }).catch(fail => {
                        //                         console.log(fail)
                        //                     })

                        //                 }).catch(fail => {
                        //                     console.log(fail)
                        //                 })
                        //             }).catch(fail => {
                        //                 console.log(fail)
                        //             })
                        //             // console.log(res);
                        //         },
                        //         'fail': function (res) {
                        //             console.log(res);
                        //         }
                        //     })
                        // }).catch(fail => {

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





            }
        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(app.globalData.isReservation)
        var that = this
        //如果在线下单 那么不显示电话号码和身份号输入框
        //如果在线下单 那么将用户名和身份证号码设置为true 从而保存的时候通过验证
        if (app.globalData.isReservation == 1) {
            that.setData({
                display: false,
                userNameValid: true,
                idValid: true
            })
        }
        //如果在线预订 需要显示电话号码和身份证号输入框
        else {
            that.setData({
                display: true
            })
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