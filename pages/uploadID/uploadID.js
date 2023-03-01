// pages/uploadImg/uploadImg.js
const promise = require('../../utils/requestUtil');
const util = require('../../utils/util');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        frontReady: false,
        backReady: false,
        // front: "http://localhost:8081/image/id/idFront.png",
        // back: "http://localhost:8081/image/id/idBack.png",
        front: "http://10.2.0.249:8081/image/id/idFront.png",
        back: "http://10.2.0.249:8081/image/id/idBack.png",
        noticeFront: "点击上传身份证正面",
        noticeBack: "点击上传身份证背面",
        // idHolder:Object,
        idHolder: {
            name: '',
            id: '',
            addr: '',
            gender: '',
            nationality: '',
            birth: ''
        },
        accessToken: '',
        accessTokenExpires: Number,
        fileList: [],
        frontIdImg:"",
        backIdImg:""
    },
    //对应的是van-uploader   上传到后端服务器
    //文件上传完毕后会触发after-read回调函数，获取到对应的文件的临时地址，然后再使用wx.uploadFile将图片上传到远程服务器上。
    afterRead(event) {
        const { file } = event.detail;
        console.log(file)
        promise.uploadFile({
            // url: 'http://localhost:8081/image/upload', // 仅为示例，非真实的接口地址
            url: 'http://10.2.0.249:8081/image/upload',
            filePath: file.url,
            name: 'file',
            formData: { user: 'test' },
        }).then(res => {
            console.log("123")
            const { fileList = [] } = this.data;
            fileList.push({ ...file, url: res.data });
            this.setData({ fileList });
            console.log(this.data.fileList)
        })

    },

    //点击身份证照片 点击正面isFront为1 点击背面isFront为0
    tapPhoto(e) {
        // console.log(now)
        // console.log(now)
        var that = this
        var isFront = e.currentTarget.id
        console.log(isFront)
        //正面的话
        if (isFront == 1) {
            //判断之前是否上传成功 如果之前成功的话 不再允许上传
            if (that.data.frontReady) {
                wx.showModal({
                    content: '身份证正面已经识别成功,无需再次上传',
                    showCancel: false,
                    confirmColor: "#012ea5"
                })
                //如果之前不成功的话 可以上传
            } else {
                wx.chooseMedia({
                    count: 1,
                    mediaType: ['image'],
                    success(res) {
                        //本地存放图片文件的路径
                        var size = res.tempFiles[0].size
                        var tempFilePath = res.tempFiles[0].tempFilePath
                        //   tempFilePath = encodeURIComponent(tempFilePath)
                        console.log(tempFilePath)
                        //   tempFilePath = tempFilePath.slice(0,4)+'s'+tempFilePath.slice(4)
                        // 当图片大小小于1MB时 
                        if (size < 1048576) {
                            //上传图片开始
                            that.uploadImage(tempFilePath, 1)
                        } else {
                            wx.showModal({
                                content: '身份证正面照片过大,请重新上传',
                                showCancel: false,
                                confirmColor: "#012ea5"
                            })
                        }
                        // that.uploadImage(tempFilePath, 1)
                    }
                })
            }
            //背面
        } else if (isFront == 0) {
            //背面是否上传成功
            if (that.data.backReady) {
                wx.showModal({
                    content: '身份证背面已经识别成功,无需再次上传',
                    showCancel: false,
                    confirmColor: "#012ea5"
                })
            } else {
                wx.chooseMedia({
                    count: 1,
                    mediaType: ['image'],
                    success(res) {
                        console.log(res)
                        var tempFilePath = res.tempFiles[0].tempFilePath
                        var size = res.tempFiles[0].size
                        //当照片小于1MB时
                        if (size < 1048576) {
                            that.uploadImage(tempFilePath, 0)
                        } else {
                            wx.showModal({
                                content: '身份证反面照片过大,请重新上传',
                                showCancel: false,
                                confirmColor: "#012ea5"
                            })
                        }
                        console.log(tempFilePath)
                        // tempFilePath = encodeURIComponent(tempFilePath)
                        console.log(tempFilePath)
                        // tempFilePath = tempFilePath.slice(0,4)+'s'+tempFilePath.slice(4)

                    }
                })
            }
        }
    },

    //上传身份证图片到后端服务器获取accessToken 然后用accessToken
    //和tempFilePath也就是本地图片文件路径拼接发送到微信OCR识别端口
    //检测身份证是否符合规定
    //此方法用了两种方法来前后调用获取OCR检测结果
    //第一种为 img_url 方法通过图片路径来获取OCR检测结果
    //第二种为 img方法 通过图片的性质 已经wx.upLoadFile函数来获取OCR检测结果
    //具体参考:https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/ocr/ocr.idcard.html
    uploadImage(tempFilePath, isFront) {
        var date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var date = date.getDate()
        var now = year.toString().concat(month.toString()).concat(date.toString())
        wx.showLoading({
            title: '身份信息检测中',
        })
        var that = this
        // console.log(tempFilePath)
        var accessToken
        //图片路径编码 
        var encodedTempFilePath = encodeURI(tempFilePath)
        console.log(encodedTempFilePath)
        console.log(tempFilePath)

        //以下注释为完全版本 不可删
        //以下注释为完全版本 不可删
        //以下注释为完全版本 不可删
        //以下注释为完全版本 不可删

        //向后端发送请求 后端再发送请求给微信端口获取accessToken
        //此为第一种方法 img_url方法
        //此accessToken为接口调用的凭证 不是用户对应的独特凭证 accessToken
        // promise.wxRequest({
        //     url: '/app/getAccessToken',
        //     data: { encodedTempFilePath, isFront },
        //     method: "GET"
        // }).then(res => {
        //     // console.log(tempFilePath)
        //     console.log(res)
        //     //后端判断发现 本应上传正面照片 结果上传的是反面照片
        //     if (res.data[1] == "needFront") {
        //         wx.hideLoading()
        //         wx.showModal({
        //             content: '请上传身份证正面!',
        //             showCancel: false,
        //             confirmColor: "#012ea5"
        //         })
        //     //后端判断 本应上传反面照片结果上传的是正面的照片
        //     } else if (res.data[1] == 'needBack') {
        //         wx.hideLoading()
        //         wx.showModal({
        //             content: '请上传身份证背面!',
        //             showCancel: false,
        //             confirmColor: "#012ea5"
        //         })
        //     //如果上传成功
        //     } else if (res.data[1] == "success") {
        //         //成功的事正面
        //         if (isFront == 1) {
        //             that.setData({
        //                 noticeFront: "身份证正面上传成功",
        //                 front: tempFilePath,
        //                 frontReady: true,
        //             })
        //             wx.hideLoading()
        //             //成功的是反面
        //         } else {
        //             that.setData({
        //                 noticeFront: "身份证背面上传成功",
        //                 back: tempFilePath,
        //                 backReady: true
        //             })
        //             wx.hideLoading()
        //         }
        //         //如果微信接口繁忙
        //     } else if (res.data[1] == "busy") {
        //         wx.hideLoading()
        //         wx.showModal({
        //             content: '微信识别系统繁忙,请稍后上传',
        //             showCancel: false,
        //             confirmColor: "#012ea5"
        //         })
        //         //如果第一种方法失败了 启用第二种img方法
        //         //具体参考:https://blog.csdn.net/qq_41896729/article/details/108775254
        //     } else if (res.data[1] == "fail") {
        //         accessToken = res.data[0]
        //         promise.uploadFile({
        //             filePath: tempFilePath,
        //             name: 'img',
        //             url: 'https://api.weixin.qq.com/cv/ocr/idcard?type=photo&access_token=' + accessToken,
        //             formData: {
        //                 contentType: 'image/png',
        //                 value: "",
        //             },
        //         }).then(res => {
        //             var idCardFront
        //             var data = JSON.parse(res.data)
        //             console.log(res)
        //             console.log(data)
        //             console.log(data.errcode)
        //             //确定上传图片的正反面
        //             if (data.type == "Front") {
        //                 idCardFront = 1
        //             } else if (data.type == "Back") {
        //                 idCardFront = 0
        //             }
        //             //比对上传图片的正反面和该位置应该上传的图片的面向
        //             if (idCardFront != isFront) {
        //                 //如果该位置应该上传正面
        //                 if (isFront == 1) {
        //                     that.setData({
        //                         noticeFront: "请上传身份证正面!"
        //                     })
        //                     wx.hideLoading()
        //                     wx.showModal({
        //                         content: '请上传身份证正面!',
        //                         showCancel: false,
        //                         confirmColor: "#012ea5"
        //                     })
        //                     //如果该位置需要上传背面
        //                 } else if (isFront == 0) {
        //                     that.setData({
        //                         noticeBack: "请上传身份证反面!"
        //                     })
        //                     wx.hideLoading()
        //                     wx.showModal({
        //                         content: '请上传身份证背面!',
        //                         showCancel: false,
        //                         confirmColor: "#012ea5"
        //                     })
        //                 }
        //                 //如果上传位置与图片的正反面匹配 并且上传成功且为正面的话
        //             } else if (data.errcode == 0 && isFront == 1) {
        //                 if(util.identityCodeValid(data.id)[0] == true){
        //                     that.setData({
        //                         noticeFront: "身份证正面上传成功",
        //                         front: tempFilePath,
        //                         frontReady: true
        //                     })
        //                     wx.hideLoading()
        //                 }else{
        //                     wx.showModal({
        //                         content: '身份证号不符合规定,请重新上传',
        //                         showCancel: false,
        //                         confirmColor: "#012ea5"
        //                     })
        //                 }
        //                  //如果上传位置与图片的正反面匹配 并且上传成功且为反面的话
        //             } else if (data.errcode == 0 && isFront == 0) {
        //                 that.setData({
        //                     noticeBack: "身份证反面上传成功",
        //                     back: tempFilePath,
        //                     backReady: true
        //                 })
        //                 wx.hideLoading()
        //                 //如果上传失败并且该位置为正面时
        //             } else if (data.errcode != 0 && isFront == 1) {
        //                 that.setData({
        //                     noticeFront: "身份证正面上传有误,请重新上传"
        //                 })
        //                 wx.hideLoading()
        //                 wx.showModal({
        //                     content: '身份证正面上传有误,请重新上传',
        //                     showCancel: false,
        //                     confirmColor: "#012ea5"
        //                 })
        //                 //如果上传失败并且该位置为反面时
        //             } else if (data.errcode != 0 && isFront == 0) {
        //                 that.setData({
        //                     noticeBack: "身份证背面上传有误,请重新上传"
        //                 })
        //                 wx.hideLoading()
        //                 wx.showModal({
        //                     content: '身份证背面面上传有误,请重新上传',
        //                     showCancel: false,
        //                     confirmColor: "#012ea5"
        //                 })
        //             }
        //             // console.log(data)
        //             // console.log(res.data)
        //         })
        //     }
        // })



        promise.wxRequest({
            url: '/app/getAccessToken',
            //删掉这行是因为getAccessToken可能会有其他用途 不只是识别身份证
            // data: { encodedTempFilePath, isFront },
            method: "GET"
        }).then(res => {
            // console.log(tempFilePath)
            console.log(res)
            //后端判断发现 本应上传正面照片 结果上传的是反面照片

            //如果第一种方法失败了 启用第二种img方法
            //具体参考:https://blog.csdn.net/qq_41896729/article/details/108775254
            // accessToken = res.data[0]
            accessToken = res.data
            promise.uploadFile({
                filePath: tempFilePath,
                name: 'img',
                url: 'https://api.weixin.qq.com/cv/ocr/idcard?type=photo&access_token=' + accessToken,
                formData: {
                    contentType: 'image/png',
                    value: "",
                },
            }).then(res => {
                var idCardFront
                var data = JSON.parse(res.data)
                console.log(res)
                console.log(data)
                console.log(data.errcode)
                //确定上传图片的正反面
                if (data.type == "Front") {
                    idCardFront = 1
                } else if (data.type == "Back") {
                    idCardFront = 0
                }
                //比对上传图片的正反面和该位置应该上传的图片的面向
                if (idCardFront != isFront) {
                    //如果该位置应该上传正面
                    if (isFront == 1) {
                        that.setData({
                            noticeFront: "请上传身份证正面!"
                        })
                        wx.hideLoading()
                        wx.showModal({
                            content: '请上传身份证正面!',
                            showCancel: false,
                            confirmColor: "#012ea5"
                        })
                        //如果该位置需要上传背面
                    } else if (isFront == 0) {
                        that.setData({
                            noticeBack: "请上传身份证反面!"
                        })
                        wx.hideLoading()
                        wx.showModal({
                            content: '请上传身份证背面!',
                            showCancel: false,
                            confirmColor: "#012ea5"
                        })
                    }
                    //如果上传位置与图片的正反面匹配 并且上传成功且为正面的话
                } else if (data.errcode == 0 && isFront == 1) {
                    //如果身份证号符合身份证号的规则
                    if(util.identityCodeValid(data.id)[0] == true){
                    // var object = Object.assign({},data)
                    // console.log(object)
                    that.data.idHolder.name = data.name
                    that.data.idHolder.id = data.id
                    that.data.idHolder.addr = data.addr
                    that.data.idHolder.gender = data.gender
                    that.data.idHolder.nationality = data.nationality
                    that.data.idHolder.birth = data.birth
                    // app.globalData.idHolder = that.data.idHolder
                    console.log(that.data.idHolder)
                    // console.log(app.globalData.idHolder)
                    that.setData({
                        noticeFront: "身份证正面识别成功",
                        frontIdImg: tempFilePath,
                        frontReady: true,
                        // frontImg:
                    })
                    wx.hideLoading()
                    //如果身份证号不符合规则
                    }
                    else{
                        wx.hideLoading()
                        wx.showModal({
                            content: '身份证号格式不符合规定,请重新上传',
                            showCancel: false,
                            confirmColor: "#012ea5"
                        })
                    }
                    //如果上传位置与图片的正反面匹配 并且上传成功且为反面的话
                } else if (data.errcode == 0 && isFront == 0) {
                    var startDate = data.valid_date.slice(0, 8)
                    var endDate = data.valid_date.slice(9)
                    //如果身份证有效期在范围内
                    if (now > startDate && endDate == "长期") {
                        that.setData({
                            noticeBack: "身份证反面识别成功",
                            backIdImg: tempFilePath,
                            backReady: true
                        })
                        wx.hideLoading()
                        that.data.isIdValid = true
                    } else if (now > startDate && now < endDate) {
                        that.setData({
                            noticeBack: "身份证反面识别成功",
                            backIdImg: tempFilePath,
                            backReady: true
                        })
                        wx.hideLoading()
                        that.data.isIdValid = true
                        //如果有效期不在范围内
                    } else {
                        wx.hideLoading()
                        wx.showModal({
                            content: '身份证有效期错误,请重新上传',
                            showCancel: false,
                            confirmColor: "#012ea5"
                        })
                    }

                    //如果上传失败并且该位置为正面时
                } else if (data.errcode != 0 && isFront == 1) {
                    that.setData({
                        noticeFront: "身份证正面识别有误,请重新上传"
                    })
                    wx.hideLoading()
                    wx.showModal({
                        content: '身份证正面识别有误,请重新上传',
                        showCancel: false,
                        confirmColor: "#012ea5"
                    })
                    //如果上传失败并且该位置为反面时
                } else if (data.errcode != 0 && isFront == 0) {
                    that.setData({
                        noticeBack: "身份证背面识别有误,请重新上传"
                    })
                    wx.hideLoading()
                    wx.showModal({
                        content: '身份证背面面识别有误,请重新上传',
                        showCancel: false,
                        confirmColor: "#012ea5"
                    })
                }
                // console.log(data)
                // console.log(res.data)
            }).catch(fail => {
                wx.hideLoading()
                wx.showModal({
                    content: '身份证识别有误,请重新上传',
                    showCancel: false,
                    confirmColor: "#012ea5"
                })
            })

        }).catch(fail => {
            wx.hideLoading()
            wx.showModal({
                content: '身份证识别有误,请重新上传',
                showCancel: false,
                confirmColor: "#012ea5"
            })
        })
    },

    //保存身份证信息时
    onSave() {
        var that = this
        if (that.data.frontReady == true && that.data.backReady == true) {
            
            //先上传正面
            // promise.uploadFile({
            //     url: 'http://localhost:8081/image/upload',
            //     filePath: that.data.front,
            //     name: 'file',
            //     formData: { user: 'test' },
            //     //再上传背面
            // }).then(res => {
            //     wx.showLoading({
            //       title: '上传中',
            //     })
            //     //如果正面上传成功
            //     if (res.statusCode == 200) {
            //         console.log(res.statusCode)
            //         promise.uploadFile({
            //             url: 'http://localhost:8081/image/upload',
            //             filePath: that.data.back,
            //             name: 'file',
            //             formData: { user: 'test' },
            //         }).then(res => {
            //             console.log(res)
            //             //如果反面上传失败
            //             if (res.statusCode != 200) {
            //                 console.log(res.statusCode)
            //                 wx.hideLoading()
            //                 wx.showModal({
            //                     content: '身份证上传有误,请稍后保存身份证',
            //                     showCancel: false,
            //                     confirmColor: "#012ea5"
            //                 })
            //             }
            //         }).catch(fail =>{
            //             wx.hideLoading()
            //             wx.showModal({
            //                 content: '身份证上传有误,请稍后保存身份证',
            //                 showCancel: false,
            //                 confirmColor: "#012ea5"
            //             })
            //         })
            //         //去上传驾照
            //         wx.redirectTo({
            //             url: '../uploadLicense/uploadLicense',
            //         })
            //         //如果正面上传失败
            //     } else {
            //         console.log(res.statusCode)
            //         wx.hideLoading()
            //         wx.showModal({
            //             content: '身份证上传有误,请稍后保存身份证',
            //             showCancel: false,
            //             confirmColor: "#012ea5"
            //         })
            //     }
            //     console.log(res)

            // }).catch(fail =>{
            //     wx.hideLoading()
            //     wx.showModal({
            //         content: '身份证上传有误,请稍后保存身份证',
            //         showCancel: false,
            //         confirmColor: "#012ea5"
            //     })
            // })

            //将上传的图片的储存路径保存给全局数据
            app.globalData.idFrontPath = that.data.frontIdImg
            app.globalData.idBackPath = that.data.backIdImg
            console.log(app.globalData.idFrontPath)
            console.log(app.globalData.idBackPath)
            //如果身份证前后面数据都上传成功则保存身份证信息到app.globalData里面
            app.globalData.idHolder = that.data.idHolder
            wx.redirectTo({
              url: '../uploadLicense/uploadLicense',
            })
            console.log(app.globalData.idHolder)
        } else {
            wx.showModal({
                content: '请上传身份证证件,验证通过后再保存',
                showCancel: false,
                confirmColor: "#012ea5"
            })
        }
    },

    // async tapPhoto1(e) {
    //     var that = this
    //     var isFront = e.currentTarget.id
    //     if (isFront == 1) {
    //         if (that.data.frontReady) {
    //             wx.showModal({ content: '身份证正面已经识别成功,无需再次上传', showCancel: false, confirmColor: "#012ea5" })
    //         } else {
    //             try {
    //                 var chooseMedia = await promise.chooseMedia({ count: 1, mediaType: ['image'], })
    //                 console.log(chooseMedia)
    //                 if (chooseMedia.errMsg == "chooseMedia:ok") {
    //                     var size = chooseMedia.tempFiles[0].size
    //                     var tempFilePath = chooseMedia.tempFiles[0].tempFilePath
    //                     if (size < 1048576) {
    //                         var image = await that.uploadImage(tempFilePath, 1)

    //                     } else {
    //                         wx.showModal({ content: '身份证正面照片过大,请重新上传', showCancel: false, confirmColor: "#012ea5" })
    //                     }
    //                 }
    //             } catch (err) {
    //                 wx.hideLoading()
    //                 wx.showModal({ content: '身份证识别有误,请稍后上传', showCancel: false, confirmColor: "#012ea5" })
    //             }

    //         }
    //     } else if (isFront == 0) {
    //         if (that.data.backReady) {
    //             wx.showModal({ content: '身份证背面已经识别成功,无需再次上传', showCancel: false, confirmColor: "#012ea5" })
    //         }
    //         else {
    //             try {
    //                 var chooseMedia = await promise.chooseMedia({ count: 1, mediaType: ['image'], })
    //                 console.log(chooseMedia)
    //                 if (chooseMedia.errMsg == "chooseMedia:ok") {
    //                     var size = chooseMedia.tempFiles[0].size
    //                     var tempFilePath = chooseMedia.tempFiles[0].tempFilePath
    //                     if (size < 1048576) {
    //                         var image = await that.uploadImage(tempFilePath, 0)
    //                     } else {
    //                         wx.showModal({ content: '身份证正面照片过大,请重新上传', showCancel: false, confirmColor: "#012ea5" })
    //                     }
    //                 }
    //             } catch (err) {
    //                 wx.hideLoading()
    //                 wx.showModal({ content: '身份证识别有误,请稍后上传', showCancel: false, confirmColor: "#012ea5" })
    //             }
    //         }

    //     }
    // },

    // async uploadImage1(tempFilePath, isFront) {
    //     var date = new Date()
    //     var year = date.getFullYear()
    //     var month = date.getMonth() + 1
    //     var date = date.getDate()
    //     var now = year.toString().concat(month.toString()).concat(date.toString())
    //     wx.showLoading({
    //         title: '身份信息检测中',
    //     })
    //     var that = this
    //     try {
    //         // console.log(tempFilePath)
    //         var accessToken = await promise.wxRequest({ url: '/app/getAccessToken', method: "GET" })
    //         console.log(accessToken)
    //         if (accessToken.errMsg == "request:ok") {
    //             var AT = accessToken.data
    //             var upload = await promise.uploadFile({
    //                 filePath: tempFilePath,
    //                 name: 'img',
    //                 url: 'https://api.weixin.qq.com/cv/ocr/idcard?type=photo&access_token=' + accessToken,
    //                 formData: {
    //                     contentType: 'image/png',
    //                     value: "",
    //                 },
    //             })
    //             console.log(upload)
    //             if(upload.errMsg == "uploadFile:ok"){
    //                 var idCardFront
    //                 var data = JSON.parse(upload.data)
    //                 if(data.type == "Front"){
    //                     idCardFront =1
    //                 }else if(data.type == "Back"){
    //                     idCardFront = 0
    //                 }
    //                 if(idCardFront != isFront){

    //                 }
    //             }
    //         }
    //     } catch (err) {
    //         wx.hideLoading()
    //         wx.showModal({ content: '身份证识别有误,请稍后上传', showCancel: false, confirmColor: "#012ea5" })
    //     }

    // },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        
        try{
            var frontPic = await promise.wxRequest({
                url: '/img/IdAndLicense/idFront.png',
                responseType: 'arraybuffer',
            })
            if(frontPic.errMsg == "request:ok"){
                let img = 'data:image/png;base64,' + wx.arrayBufferToBase64(frontPic.data)
                this.setData({
                    frontIdImg:img
                })
                var backPic = await promise.wxRequest({
                    url: '/img/IdAndLicense/idBack.png',
                    responseType: 'arraybuffer',
                })
                if(backPic.errMsg == "request:ok"){
                    let img = 'data:image/png;base64,' + wx.arrayBufferToBase64(backPic.data)
                    this.setData({
                        backIdImg:img
                    })
                    
                }
            }
        }catch(err){

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