// pages/review/review.js
const util = require('../../utils/util');
const app = getApp();
const promise = require('../../utils/requestUtil');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vehicle: Object,
    total: Number,
    dayInbetween: Number,
    monthCurrent: Number,
    monthEnd: Number,
    dateCurrent: Number,
    dateEnd: Number,
    hourCurrent: Number,
    hourEnd: Number,
    weekdayCurrent: String,
    weekdayEnd: String,
    locations: Array,
    timeCurrent: String,
    timeEnd: String,
    minuteCurrent: String,
    minuteEnd: String,
    showPop: false,
    showPop1: false,
    showPop2: false,
    checked: false,
    insurance: 0,
    isDriverEntered: false,
    Driver: {
      id:'',
      name:''
    },
    review: null
  },

  //提示北京限行规则
  showPopup() {
    this.setData({ showPop: true });
  },
  onClose() {
    this.setData({ showPop: false });
  },
  //费用明细提示
  showPopup1() {
    this.setData({ showPop1: true });
  },
  onClose1() {
    this.setData({ showPop1: false });
  },
  //弹出层2
  showPopup2() {
    this.setData({ showPop2: true });
  },
  onClose2() {
    this.setData({ showPop2: false });
  },
  //复选框函数
  onChange(event) {
    this.setData({
      checked: event.detail,
    });
    console.log(event.detail)
    if (event.detail == true) {
      this.setData({
        // total: total + 350
        insurance: 350
      })
    } else {
      this.setData({
        // total:total - 350
        insurance: 0
      })
    }
  },

  //导航到uploadId 然后到uploadLicense
  navigateToUpload() {
    var that = this
    console.log(app.globalData.idHolder.id)
    console.log(app.globalData.licenseHolder.id)
    wx.navigateTo({
      url: '../chooseDriver/chooseDriver',
    })
    
    //如果身份证信息没有定义 那么去上传身份证
    // if (app.globalData.idHolder.id == undefined) {
    //   wx.navigateTo({
    //     url: '../uploadID/uploadID',
    //   })
    //   //如果在身份证上传的前提下 没有上传驾驶证 那么去上传驾驶本
    // } else if (app.globalData.licenseHolder.id == undefined) {
    //   wx.navigateTo({
    //     url: '../uploadLicense/uploadLicense',
    //   })
    // }
    //如果身份证和驾驶本都上传了 提示已上传
    // else {
    //   wx.showModal({
    //     content: '驾驶员信息已上传完成',
    //     showCancel: false,
    //     confirmColor: "#012ea5"
    //   })
    // }


  },
  //点击提交订单
  async submit() {
    var that = this
    //如果身份证和驾驶本的身份证号不符 需要重新上传
    console.log(app.globalData.phone)
    //如果司机信息没有录入或者选择 不让跳转
    // if(that.data.Driver.id == '' && that.data.Driver.name == ''){
    //   await  wx.showModal({
    //     content: '请在驾驶员信息处,选择驾驶员',
    //     showCancel: false,
    //     confirmColor: "#012ea5"
    // })
    // }
    //如果录入了驾驶员信息 那就直接跳转
    // else{
      wx.navigateTo({
        url: '../chooseMode/chooseMode',
      })
    // }
    
    // //如果没有手机号的话 代表着登录方式为getUserProfile
    // if (app.globalData.phone == '') {
    //   try {
    //     await promise.showModal({
    //       content: '我们需要您的手机号来和您保持联系,请您输入手机号',
    //       showCancel: false,
    //       confirmColor: "#012ea5",
    //     }).then(res => {
    //       if (res.confirm) {
    //         wx.navigateTo({
    //           url: '../driverInfo/driverInfo',
    //         })
    //       }
    //     })
    //   } catch (err) {
    //     wx.showModal({
    //       content: '系统错误,请重试',
    //       showCancel: false,
    //       confirmColor: "#012ea5"
    //     })
    //   }
    // }
    // console.log(app.globalData.idHolder)
    // console.log(app.globalData.licenseHolder)

    // // 如果之前用户没有输入驾驶员信息
    // if (app.globalData.idHolder.id == "" && app.globalData.licenseHolder.id == "") {
    //   try {
    //     var navigate = await promise.navigateTo({ url: '../uploadID/uploadID' })
    //     console.log(navigate)
    //   } catch (err) {

    //   }
    //   // 如果用户输入的身份证上的身份证号和驾驶本上的身份证号不一样
    // } else if (app.globalData.idHolder.id != app.globalData.licenseHolder.id) {
    //   // 将两个身份证号归零
    //   // app.globalData.idHolder.id = undefined
    //   // app.globalData.licenseHolder.id = undefined
    //   //显示提示
    //   try {
    //     await promise.showModal({
    //       content: '驾驶员的身份证信息与驾驶本信息不符,请重新上传相匹配的证件',
    //       confirmColor: "#012ea5",
    //     }).then(res => {
    //       if (res.confirm) {
    //         //重新去上传身份证
    //         wx.navigateTo({
    //           url: '../uploadID/uploadID',
    //         })
    //       }
    //     })
    //   } catch (err) {

    //   }
    //   that.setData({
    //     isDriverEntered: false
    //   })
    //   //如果身份信息相匹配 那么
    // } else {
    //   console.log(app.globalData.idHolder)
    //   console.log(app.globalData.licenseHolder)
    //   // 先上传驾驶员信息到后端
    //   try {
    //     wx.showLoading({
    //       title: '订单确认中',
    //     })
    //     var uploadDriver = await promise.wxRequest({
    //       url: '/driver/uploadDriver',
    //       data: {
    //         'id': app.globalData.idHolder.id,
    //         'name': app.globalData.idHolder.name,
    //         'gender': app.globalData.idHolder.gender,
    //         'address': app.globalData.idHolder.addr,
    //         'birth': app.globalData.idHolder.birth,
    //         'nationality': app.globalData.idHolder.nationality,
    //         'carClass': app.globalData.licenseHolder.car_class,
    //         'accessToken': app.globalData.accessToken
    //       },
    //       header: {
    //         'content-type': 'text/plain'
    //         // 'content-type': 'application/x-www-form-urlencoded'
    //       },
    //       method: "POST",
    //       dataType: "text/plain",
    //     })
    //     console.log(uploadDriver)
    //     // 如果驾驶员信息上传成功 就上传身份证正面
    //     if (uploadDriver.errMsg == "request:ok") {
    //       console.log(11)
    //       var uploadFrontId = await promise.uploadFile({
    //         url: 'http://localhost:8081/image/upload',
    //         filePath: app.globalData.idFrontPath,
    //         name: 'file',
    //         formData: { user: 'test' },
    //       })
    //       console.log(uploadFrontId)
    //       // 如果身份证正面上传成功 就上传身份证背面
    //       if (uploadFrontId.errMsg == "uploadFile:ok") {
    //         var uploadBackId = await promise.uploadFile({
    //           url: 'http://localhost:8081/image/upload',
    //           filePath: app.globalData.idBackPath,
    //           name: 'file',
    //           formData: { user: 'test' },
    //         })
    //         console.log(uploadBackId)
    //         // 如果身份证背面上传成功 就上传驾照
    //         if (uploadBackId.errMsg == "uploadFile:ok") {
    //           var uploadLicense = await promise.uploadFile({
    //             url: 'http://localhost:8081/image/upload',
    //             filePath: app.globalData.licensePath,
    //             name: 'file',
    //             formData: { user: 'test' },
    //           })
    //           if(uploadLicense.errMsg == "uploadFile:ok"){
    //             wx.hideLoading()
    //           }
    //           console.log(uploadLicense)
    //         }
    //       }
    //     }
    //     // 如果报错显示以下
    //   } catch (err) {
    //     wx.hideLoading()
    //     wx.showModal({
    //       content: '提交订单失败,请稍后再试',
    //       showCancel: false,
    //       confirmColor: "#012ea5"
    //     })
    //   }
    // }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var _this = this
    _this.data.review = _this
    _this.setData({
      vehicle: app.globalData.vehicle,
      total: app.globalData.total,
      dayInbetween: app.globalData.dayInbetween,
      monthCurrent: app.globalData.monthCurrent,
      monthEnd: app.globalData.monthEnd,
      dateCurrent: app.globalData.dateCurrent,
      dateEnd: app.globalData.dateEnd,
      weekdayCurrent: app.globalData.weekdayCurrent,
      weekdayEnd: app.globalData.weekdayEnd,
      hourCurrent: app.globalData.hourCurrent,
      hourEnd: app.globalData.hourEnd,
      minuteCurrent: app.globalData.minuteCurrent,
      minuteEnd: app.globalData.minuteEnd,
      locations: app.globalData.locations
    })
    console.log(_this.data.locations.value[0])
    console.log(this.data.total)

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
    // console.log(this)
    // let review = this.data.review
    // console.log(this)
    // console.log(review)

    var that = this
    console.log(this)
    console.log("Review On Show!" + that.data.isDriverEntered)
    console.log(this.data.Driver)
    console.log(this.data.isDriverEntered)
    console.log(app.globalData.idHolder)
    console.log(app.globalData.licenseHolder)
    that.setData({
      Driver:app.globalData.Driver
    })
    console.log(this.data.Driver)
    // // 检查驾驶员信息是否已输入
    // //如果身份证和驾驶证都已输入 则在review界面显示驾驶员的信息
    // if (app.globalData.idHolder.id != undefined && app.globalData.licenseHolder.id != undefined) {
    //   // _this.data.isDriverEntered = true
    //   // setTimeout(() => {
    //     that.setData({
    //       isDriverEntered: true,
    //       Driver: app.globalData.idHolder
    //     })
    //   // }, 0)

    //   // that.setData({
    //   //   isDriverEntered:true,
    //   //   Driver:app.globalData.idHolder
    //   // })
    //   console.log(that.data.Driver)
    //   console.log(that.data.isDriverEntered)
    //   console.log(123)
    //   // this.data.Driver = app.globalData.idHolder
    // }
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