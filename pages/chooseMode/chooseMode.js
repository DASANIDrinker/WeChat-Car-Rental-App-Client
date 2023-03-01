// pages/chooseMode/chooseMode.js
const app = getApp();
const promise = require('../../utils/requestUtil');
// const utils = require('../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        radio: '1'
    },

    onChange(event) {
        this.setData({
            radio: event.detail,
        });
        console.log(this.data.radio)
    },

    onClick(event) {
        const { name } = event.currentTarget.dataset;
        this.setData({
            radio: name,
        });
        console.log(this.data.radio)
    },

    async confirm() {
        var that = this
        app.globalData.isReservation = this.data.radio
        // 如果是在线下单
        if (that.data.radio == '1') {
            // var startDate = app.globalData.timeCurrent.toString().replace(/\//g, "-").concat(":00")
            // var endDate = app.globalData.timeEnd.toString().replace(/\//g, "-").concat(":00")

            // promise.wxRequest({
            //     url: '/orders/insert',
            //     data:{
            //         vehicleTypeId:app.globalData.vehicle.vehicleTypeId,
            //         id:app.globalData.idHolder.id,
            //         sign:"12345",
            //         accessToken:app.globalData.accessToken,
            //         startDate:startDate,
            //         endDate:endDate,
            //         pickUpLocationId:6,
            //         dropOffLocationId:6,
            //         orderStatusId:5,
            //         days:app.globalData.dayInBetween,
            //         total:app.globalData.total
            //     },
            //     method: "POST",
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded"
            //     }
            // }).then(res=>{
            //     console.log(res)
                
            // }).catch(fail=>{
            //     console.log(fail)
            // })



            //如果没有手机号的话 代表着登录方式为getUserProfile
            if (app.globalData.phone == '') {
                try {
                    await promise.showModal({
                        content: '我们需要您的手机号来和您保持联系,请您输入手机号',
                        showCancel: false,
                        confirmColor: "#012ea5",
                    }).then(res => {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '../driverInfo/driverInfo',
                            })
                        }
                    })
                } catch (err) {
                    wx.showModal({
                        content: '系统错误,请重试',
                        showCancel: false,
                        confirmColor: "#012ea5"
                    })
                }
            }
            console.log(app.globalData.idHolder)
            console.log(app.globalData.licenseHolder)
            wx.navigateTo({
                url: '../chooseDriver/chooseDriver',
              })

            // 如果之前用户没有输入驾驶员信息

            // if (app.globalData.idHolder.id == "" && app.globalData.licenseHolder.id == "") {
            //     try {
            //         var navigate = await promise.navigateTo({ url: '../uploadID/uploadID' })
            //         console.log(navigate)
            //     } catch (err) {

            //     }
            //     // 如果用户输入的身份证上的身份证号和驾驶本上的身份证号不一样
            // } else if (app.globalData.idHolder.id != app.globalData.licenseHolder.id) {
            //     // 将两个身份证号归零
            //     // app.globalData.idHolder.id = undefined
            //     // app.globalData.licenseHolder.id = undefined
            //     //显示提示
            //     try {
            //         await promise.showModal({
            //             content: '驾驶员的身份证信息与驾驶本信息不符,请重新上传相匹配的证件',
            //             confirmColor: "#012ea5",
            //         }).then(res => {
            //             if (res.confirm) {
            //                 //重新去上传身份证
            //                 wx.navigateTo({
            //                     url: '../uploadID/uploadID',
            //                 })
            //             }
            //         })
            //     } catch (err) {

            //     }
            //     that.setData({
            //         isDriverEntered: false
            //     })
            //     //如果身份信息相匹配 那么
            // } else {
                

            //     console.log(app.globalData.idHolder)
            //     console.log(app.globalData.licenseHolder)
            //     // 先上传驾驶员信息到后端
            //     try {
            //         wx.showLoading({
            //             title: '订单确认中',
            //         })
            //         var uploadDriver = await promise.wxRequest({
            //             url: '/driver/uploadDriver',
            //             data: {
            //                 'id': app.globalData.idHolder.id,
            //                 'name': app.globalData.idHolder.name,
            //                 'gender': app.globalData.idHolder.gender,
            //                 'address': app.globalData.idHolder.addr,
            //                 'birth': app.globalData.idHolder.birth,
            //                 'nationality': app.globalData.idHolder.nationality,
            //                 'carClass': app.globalData.licenseHolder.car_class,
            //                 'accessToken': app.globalData.accessToken
            //             },
            //             header: {
            //                 'content-type': 'text/plain'
            //                 // 'content-type': 'application/x-www-form-urlencoded'
            //             },
            //             method: "POST",
            //             dataType: "text/plain",
            //         })
            //         console.log(uploadDriver)
            //         // 如果驾驶员信息上传成功 就上传身份证正面
            //         if (uploadDriver.errMsg == "request:ok") {
            //             console.log(11)
            //             var uploadFrontId = await promise.uploadFile({
            //                 url: 'http://localhost:8081/image/upload',
            //                 filePath: app.globalData.idFrontPath,
            //                 name: 'file',
            //                 formData: { user: 'test' },
            //             })
            //             console.log(uploadFrontId)
            //             // 如果身份证正面上传成功 就上传身份证背面
            //             if (uploadFrontId.errMsg == "uploadFile:ok") {
            //                 var uploadBackId = await promise.uploadFile({
            //                     url: 'http://localhost:8081/image/upload',
            //                     filePath: app.globalData.idBackPath,
            //                     name: 'file',
            //                     formData: { user: 'test' },
            //                 })
            //                 console.log(uploadBackId)
            //                 // 如果身份证背面上传成功 就上传驾照
            //                 if (uploadBackId.errMsg == "uploadFile:ok") {
            //                     var uploadLicense = await promise.uploadFile({
            //                         url: 'http://localhost:8081/image/upload',
            //                         filePath: app.globalData.licensePath,
            //                         name: 'file',
            //                         formData: { user: 'test' },
            //                     })
            //                     if (uploadLicense.errMsg == "uploadFile:ok") {
            //                         wx.hideLoading()
            //                     }
            //                     console.log(uploadLicense)
            //                 }
            //             }
            //         }
            //         // 如果报错显示以下
            //     } catch (err) {
            //         wx.hideLoading()
            //         wx.showModal({
            //             content: '提交订单失败,请稍后再试',
            //             showCancel: false,
            //             confirmColor: "#012ea5"
            //         })
            //     }
            // }

            // 如果是在线预订
        }
        //如果是在线预订
        else {
            try{
                await promise.showModal({
                    content: '您选择的是在线预订选项。我们需要您预留租车人信息。',
                    // showCancel: false,
                    confirmColor: "#012ea5",
                }).then(res => {
                    if (res.confirm) {
                        // wx.navigateTo({
                        //     url: '../chooseDriver/chooseDriver',
                        //   })

                        wx.navigateTo({
                            url: '../driverInfo/driverInfo',
                        })
                    }
                })
            }catch(err){
                
            }
           

        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    async waste() {
        //如果没有手机号的话 代表着登录方式为getUserProfile
        if (app.globalData.phone == '') {
            try {
                await promise.showModal({
                    content: '我们需要您的手机号来和您保持联系,请您输入手机号',
                    showCancel: false,
                    confirmColor: "#012ea5",
                }).then(res => {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../driverInfo/driverInfo',
                        })
                    }
                })
            } catch (err) {
                wx.showModal({
                    content: '系统错误,请重试',
                    showCancel: false,
                    confirmColor: "#012ea5"
                })
            }
        }
        console.log(app.globalData.idHolder)
        console.log(app.globalData.licenseHolder)

        // 如果之前用户没有输入驾驶员信息
        if (app.globalData.idHolder.id == "" && app.globalData.licenseHolder.id == "") {
            try {
                var navigate = await promise.navigateTo({ url: '../uploadID/uploadID' })
                console.log(navigate)
            } catch (err) {

            }
            // 如果用户输入的身份证上的身份证号和驾驶本上的身份证号不一样
        } else if (app.globalData.idHolder.id != app.globalData.licenseHolder.id) {
            // 将两个身份证号归零
            // app.globalData.idHolder.id = undefined
            // app.globalData.licenseHolder.id = undefined
            //显示提示
            try {
                await promise.showModal({
                    content: '驾驶员的身份证信息与驾驶本信息不符,请重新上传相匹配的证件',
                    confirmColor: "#012ea5",
                }).then(res => {
                    if (res.confirm) {
                        //重新去上传身份证
                        wx.navigateTo({
                            url: '../uploadID/uploadID',
                        })
                    }
                })
            } catch (err) {

            }
            that.setData({
                isDriverEntered: false
            })
            //如果身份信息相匹配 那么
        } else {
            console.log(app.globalData.idHolder)
            console.log(app.globalData.licenseHolder)
            // 先上传驾驶员信息到后端
            try {
                wx.showLoading({
                    title: '订单确认中',
                })
                var uploadDriver = await promise.wxRequest({
                    url: '/driver/uploadDriver',
                    data: {
                        'id': app.globalData.idHolder.id,
                        'name': app.globalData.idHolder.name,
                        'gender': app.globalData.idHolder.gender,
                        'address': app.globalData.idHolder.addr,
                        'birth': app.globalData.idHolder.birth,
                        'nationality': app.globalData.idHolder.nationality,
                        'carClass': app.globalData.licenseHolder.car_class,
                        'accessToken': app.globalData.accessToken
                    },
                    header: {
                        'content-type': 'text/plain'
                        // 'content-type': 'application/x-www-form-urlencoded'
                    },
                    method: "POST",
                    dataType: "text/plain",
                })
                console.log(uploadDriver)
                // 如果驾驶员信息上传成功 就上传身份证正面
                if (uploadDriver.errMsg == "request:ok") {
                    console.log(11)
                    var uploadFrontId = await promise.uploadFile({
                        // url: 'http://localhost:8081/image/upload',
                        url: 'http://10.2.0.249:8081/image/upload',
                        filePath: app.globalData.idFrontPath,
                        name: 'file',
                        formData: { user: 'test' },
                    })
                    console.log(uploadFrontId)
                    // 如果身份证正面上传成功 就上传身份证背面
                    if (uploadFrontId.errMsg == "uploadFile:ok") {
                        var uploadBackId = await promise.uploadFile({
                            // url: 'http://localhost:8081/image/upload',
                            url: 'http://10.2.0.249:8081/image/upload',
                            filePath: app.globalData.idBackPath,
                            name: 'file',
                            formData: { user: 'test' },
                        })
                        console.log(uploadBackId)
                        // 如果身份证背面上传成功 就上传驾照
                        if (uploadBackId.errMsg == "uploadFile:ok") {
                            var uploadLicense = await promise.uploadFile({
                                // url: 'http://localhost:8081/image/upload',
                                url: 'http://10.2.0.249:8081/image/upload',
                                filePath: app.globalData.licensePath,
                                name: 'file',
                                formData: { user: 'test' },
                            })
                            if (uploadLicense.errMsg == "uploadFile:ok") {
                                wx.hideLoading()
                            }
                            console.log(uploadLicense)
                        }
                    }
                }
                // 如果报错显示以下
            } catch (err) {
                wx.hideLoading()
                wx.showModal({
                    content: '提交订单失败,请稍后再试',
                    showCancel: false,
                    confirmColor: "#012ea5"
                })
            }
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