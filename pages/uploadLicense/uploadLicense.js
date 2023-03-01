// pages/uploadLicense/uploadLicense.js
const promise = require('../../utils/requestUtil');
const util = require('../../utils/util');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        notice: '请将机动车驾驶证铺在平整且光线好的地方拍照',
        isLicenseReady: false,
        licenseHolder: {
            id: '',
            name: ''
        },
        licenseImg:"",
    },
    //点击图片
    tapPhoto() {
        var that = this
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            success(res) {
                var size = res.tempFiles[0].size
                var tempFilePath = res.tempFiles[0].tempFilePath
                // 当图片大小小于1MB时 
                if (size < 1048576) {
                    //上传图片开始
                    that.uploadImage(tempFilePath)
                } else {
                    wx.showModal({
                        content: '机动车驾驶证照片过大,请重新上传',
                        showCancel: false,
                        confirmColor: "#012ea5"
                    })
                }
            },
            fail(res) {
                wx.showModal({
                    content: '已取消上传,请重新上传',
                    showCancel: false,
                    confirmColor: "#012ea5"
                })
            }
        })

    },
    //点击保存按钮
    async onSave() {
        var that = this
        //如果驾照识别成功
        if (that.data.isLicenseReady == true) {
            await wx.showLoading({
                title: '校验信息中',
            })
            //保存驾照信息到app.globalData
            app.globalData.licenseHolder = that.data.licenseHolder
            console.log(app.globalData.licenseHolder)
            //如果两个信息匹配
            if (that.data.licenseHolder.id == app.globalData.idHolder.id) {
                //将驾照的照片路径保存到全局变量里
                app.globalData.licensePath = that.data.licenseImg
                console.log(app.globalData.licensePath)
                var pages = getCurrentPages();
                var currPage = pages[pages.length - 1];   //当前页面
                var prevPage = pages[pages.length - 2];  //上一个页面
                console.log(prevPage)

                //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
                //在当前情况下 上一个页面为review 所以我们在设置
                //review里面的值
                var drivers = prevPage.data.drivers
                console.log(drivers)
                //是否向chooseDriver里面添加 新驾驶员
                var pushFlag = true
                for(var i = 0 ; i < drivers.length; i ++){
                    // 如果新驾驶员已经存在于chooseDriver里面 那么pushFlag为false
                    if(that.data.licenseHolder.id == drivers[i].id){
                        pushFlag= false
                    }
                }
                // 如果可以push
                if(pushFlag){
                    drivers.push({
                        accessToken: app.globalData.accessToken,
                        address: app.globalData.idHolder.addr,
                        birth: app.globalData.birth,
                        carClass: that.data.licenseHolder.car_class,
                        gender: app.globalData.idHolder.gender,
                        id: app.globalData.idHolder.id,
                        name: app.globalData.idHolder.name,
                        nationality: app.globalData.idHolder.nationality
                    })
                    console.log(drivers)
                    await prevPage.setData({
                        drivers: drivers
                    });
                }
                
                await promise.wxRequest({
                    url: '/driver/uploadDriver',
                    data: {
                        'id': app.globalData.idHolder.id,
                        'name': app.globalData.idHolder.name,
                        'gender': app.globalData.idHolder.gender,
                        'address': app.globalData.idHolder.addr,
                        'birth': app.globalData.idHolder.birth,
                        'nationality': app.globalData.idHolder.nationality,
                        'carClass': app.globalData.licenseHolder.car_class,
                        'accessToken': app.globalData.accessToken,
                        'phone':app.globalData.phone
                    },
                    header: {
                        'content-type': 'text/plain'
                        // 'content-type': 'application/x-www-form-urlencoded'
                    },
                    method: "POST",
                    dataType: "text/plain",
                }).then(res => {
                    console.log(res)
                }).catch(fail => {
                    console.log(fail)
                })
                try {
                    var uploadIdFront = await promise.uploadFile({
                        // url: 'http://localhost:8081/image/uploadIds',
                        url: 'http://10.2.0.249:8081/image/uploadIds',
                        // data:{id:app.globalData.Driver.id},
                        filePath: app.globalData.idFrontPath,
                        name: 'file',
                        formData: { id: this.data.licenseHolder.id,
                            //1代表是身份证正面照
                            label:1 },
                    })
                    console.log(uploadIdFront)
                    var uploadIdBack = await promise.uploadFile({
                        // url: 'http://localhost:8081/image/uploadIds',
                        url: 'http://10.2.0.249:8081/image/uploadIds',
                        // data:{id:app.globalData.Driver.id},
                        filePath: app.globalData.idBackPath,
                        name: 'file',
                        formData: { 
                            id: this.data.licenseHolder.id,
                            //2代表身份是身份证背面照
                            label:2        
                        },
                    })
                    console.log(uploadIdBack)
                    var uploadLicense = await promise.uploadFile({
                        // url: 'http://localhost:8081/image/uploadIds',
                        url: 'http://10.2.0.249:8081/image/uploadIds',
                        // data:{id:app.globalData.Driver.id},
                        filePath: app.globalData.licensePath,
                        name: 'file',
                        formData: { 
                            id: this.data.licenseHolder.id,
                            //3代表是驾照照片
                            label:3   },
                    })
                    console.log(uploadLicense)
                    //恢复
                    var attempt = await promise.getStorage({key:'createDriverAttempt'})
                    var updatedAttempt = attempt.data - 1
                    var newAttempt = await promise.setStorage({key:'createDriverAttempt',data:updatedAttempt})
                    console.log(updatedAttempt)
                } catch (error) {
                    console.log(error)
                }
                await wx.hideLoading();
                await wx.navigateBack({
                    delta: 1,
                })
            } else {
                await wx.hideLoading()
                await wx.showModal({
                    content: '驾驶证和身份证信息不匹配,请重新上传',
                    showCancel: false,
                    confirmColor: "#012ea5"
                })
                await wx.navigateBack({
                    delta: 1,
                })
            }


            //将照片上传到自己的后端服务器
            // promise.uploadFile({
            //     url: 'http://localhost:8081/image/upload',
            //     filePath: that.data.licensePath,
            //     name: 'file',
            //     formData: { user: 'test' }
            // }).then(res => {
            //     //如果失败
            //     if (res.statusCode != 200) {
            //         wx.showModal({
            //             content: '驾驶证上传失败,请稍后再试',
            //             showCancel: false,
            //             confirmColor: "#012ea5"
            //         })
            //         // 如果成功
            //     } else {
            //         // wx.navigateTo({
            //         //   url: '../review/review',
            //         // })
            //         //navigateTo是父页面调到子页面,有返回上一级，子页面的跳转最多能用五级。redirectTo是同级跳转，不能返回原页面。

            //         // wx.redirectTo({
            //         //     url: '../review/review',
            //         //   })

            //         //不能用navigateTo因为 navigateTo会保留当前的uploadLicense
            //         //页面到pageStack 
            //         //不能用redirectTo是因为尽管他不保留uploadLicense到pageStack
            //         //但是他会重新导航到一个新的review界面和之前review不是同一个页面

            //         //获取所有的页面
            //         var pages = getCurrentPages();
            //         var currPage = pages[pages.length - 1];   //当前页面
            //         var prevPage = pages[pages.length - 2];  //上一个页面

            //         //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
            //         //在当前情况下 上一个页面为review 所以我们在设置
            //         //review里面的值
            //         prevPage.setData({
            //             isDriverEntered:true,
            //             Driver:app.globalData.idHolder
            //         });

            //         //返回上一层 也就是review页面
            //         wx.navigateBack({
            //             delta: 1,
            //         })
            //     }
            // }).catch(fail=>{
            //     wx.hideLoading()
            //     wx.showModal({
            //         content: '驾照上传有误,请重新上传',
            //         showCancel: false,
            //         confirmColor: "#012ea5"
            //     })
            // })

            app.globalData.licensePath = that.data.licensePath
            console.log(app.globalData.licensePath)
            var pages = getCurrentPages();
            var currPage = pages[pages.length - 1];   //当前页面
            var prevPage = pages[pages.length - 2];  //上一个页面

            //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
            //在当前情况下 上一个页面为review 所以我们在设置
            //review里面的值
            // prevPage.setData({
            //     isDriverEntered: true,
            //     Driver: app.globalData.idHolder
            // });

            //返回上一层 也就是review页面
            // wx.navigateBack({
            //     delta: 1,
            // })

            // 如果驾照尚未识别
        } else {
            wx.showModal({
                content: '机动车驾驶证还未识别,请上传驾驶证',
                showCancel: false,
                confirmColor: "#012ea5"
            })
        }
    },
    //上传驾驶证信息
    uploadImage(tempFilePath) {
        var that = this
        //如果之前已经识别成功 则提示 
        if (that.data.isLicenseReady == true) {
            wx.showModal({
                content: '机动车驾驶证已识别,无须再次上传',
                showCancel: false,
                confirmColor: "#012ea5"
            })
            //如果之前识别失败 或者未上传 则走以下流程
        } else {
            wx.showLoading({
                title: '驾驶信息检测中',
            })
            //获取微信接口调用凭证
            promise.wxRequest({
                url: '/app/getAccessToken',
                method: "GET"
            }).then(res => {
                var accessToken = res.data
                //上传文件用于识别
                promise.uploadFile({
                    filePath: tempFilePath,
                    name: 'img',
                    url: 'https://api.weixin.qq.com/cv/ocr/drivinglicense?access_token=' + accessToken,
                    formData: {
                        contentType: 'image/png/jpg',
                        value: ""
                    }
                }).then(res => {
                    //将string转化为Object
                    var data = JSON.parse(res.data)
                    console.log(data)
                    //将生效日期 和截止日期里面的-全部删掉
                    var valid_from = data.valid_from.replaceAll("-", "")
                    var valid_to = data.valid_to.replaceAll("-", "")
                    console.log(valid_from)
                    console.log(valid_to)
                    //如果图片符合规定 
                    if (data.errcode == 0 && data.errmsg == "ok") {
                        console.log(data)
                        var date = new Date()
                        var year = date.getFullYear()
                        var month = date.getMonth() + 1
                        var date = date.getDate()
                        //以数字形式获取当前时间
                        var now = year.toString().concat(month.toString()).concat(date.toString())
                        //如果驾驶证为C2并且选择的车辆为手动挡 那么不允许
                        if (data.car_class == "C2" && app.globalData.vehicle.auto == false) {
                            wx.hideLoading()
                            wx.showModal({
                                content: '您的准驾车型不包括手动挡车辆,请重新上传',
                                showCancel: false,
                                confirmColor: "#012ea5"
                            })
                            that.setData({
                                notice: '您的准驾车型不包括手动挡车辆,请重新上传'
                            })
                            //如果符合身份证规则 和有效期规则 以及准驾车型规则
                        } else if (util.identityCodeValid(data.id_num)[0] == true
                            && now > valid_from
                            && now < valid_to
                            && (data.car_class == "A1"
                                || data.car_class == "A2"
                                || data.car_class == "A3"
                                || data.car_class == "B1"
                                || data.car_class == "B2"
                                || data.car_class == "C1"
                                || data.car_class == "C2")) {
                            wx.hideLoading()
                            that.setData({
                                licenseImg: tempFilePath,
                                notice: '驾驶证识别成功',
                                isLicenseReady: true
                            })
                            that.data.licenseHolder.id = data.id_num
                            that.data.licenseHolder.name = data.name
                            that.data.licenseHolder.car_class = data.car_class
                            console.log(that.data.licenseHolder)
                            //除此以外 全部为不合格
                        } else {
                            wx.hideLoading()
                            that.setData({
                                notice: '驾驶证识别失败,请重新上传'
                            })
                            wx.showModal({
                                content: '驾驶证识别失败,请重新上传',
                                showCancel: false,
                                confirmColor: "#012ea5"
                            })
                        }
                        //如果图片不符合规定
                    } else {
                        wx.hideLoading()
                        wx.showModal({
                            content: '驾驶证识别失败,请重新上传',
                            showCancel: false,
                            confirmColor: "#012ea5"
                        })
                        that.setData({
                            notice: '驾驶证上传失败,请重新上传'
                        })
                    }
                }).catch(fail => {
                    wx.hideLoading()
                    wx.showModal({
                        content: '驾照识别有误,请重新上传',
                        showCancel: false,
                        confirmColor: "#012ea5"
                    })
                })


                // var TempFilePath = encodeURIComponent(tempFilePath)
                // promise.wxRequest({
                //     url:'/app/licenseOCR',
                //     data:{TempFilePath,accessToken},
                //     method:"GET"
                // }).then(res=>{
                //     console.log(res)
                // })

            }).catch(fail => {
                wx.hideLoading()
                wx.showModal({
                    content: '驾照识别有误,请重新上传',
                    showCancel: false,
                    confirmColor: "#012ea5"
                })
            })

        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        
        promise.wxRequest({
            url:'/img/IdAndLicense/driverLicense.png',
            responseType: 'arraybuffer',
        }).then(res=>{
            let img = 'data:image/png;base64,' + wx.arrayBufferToBase64(res.data)
            this.setData({
                licenseImg:img
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