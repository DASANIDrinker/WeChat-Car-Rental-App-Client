// pages/home/home.js
// import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
var util = require('../../utils/util');
var app = getApp();
const promise = require('../../utils/requestUtil');
const times = {
    PickUp: ['9:00', '9:15', '9:30', '9:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00'],
    DropOff: ['9:00', '9:15', '9:30', '9:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00'],
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // //弹出层参数
        // showPop: false,
        // //选择器参数
        // //取车还车时间选择器参数
        // columns: [
        //     {
        //       values: times['PickUp'],
        //       className: 'column1',
        //       defaultIndex:12
        //     },
        //     {
        //       values: times['DropOff'],
        //       className: 'column2',
        //       defaultIndex:12
        //     },
        //   ],
        // //Calendar 参数
        // dateCalendar: '默认值',
        // hourCurrentCalendar:'默认值',
        // hourEndCalendar:'默认值',
        // show: false,
        // hasUserInfo:{type:Boolean,value:false},
        // userInfo:{type:Object,value:{}},
        // //Swiper参数
        swiperSrcList: [
            // "http://192.168.64.130/image/swiper/东方时尚1.jpg",
            // "http://192.168.64.130/image/swiper/东方时尚2.jpg",
            // "http://192.168.64.130/image/swiper/东方时尚3.jpg",
            // "http://192.168.64.130/image/swiper/东方时尚4.jpg",
            // "http://192.168.64.130/image/swiper/东方时尚5.jpg"
        ],

    },
    // //Calendar函数
    // setUpdatedDate(start,end){
    //     var startDate = new Date(start)
    //     var endDate = new Date(end)
    //     var day = parseInt((endDate.getTime() - startDate.getTime()) / (1000*60*60*24))
    //     var weekdaycurrent = util.formatWeekDay(startDate)
    //     var weekdayend = util.formatWeekDay(endDate)
    //     this.setData({
    //         monthCurrent:util.setMonth(start),
    //         monthEnd:util.setMonth(end),
    //         dateCurrent:util.setDate(start),
    //         dateEnd:util.setDate(end),
    //         dayInBetween:day,
    //         weekdayCurrent:weekdaycurrent,
    //         weekdayEnd:weekdayend
    //     })
    // },
    // onDisplayCalendar() {
    //     this.setData({ 
    //         show: true
    //     });
    //   },
    //   onClose() {
    //     this.setData({ show: false });
    //   },
    //   formatDate(dateCalendar) {
    //     dateCalendar = new Date(dateCalendar);
    //     return `${dateCalendar.getMonth() + 1}/${dateCalendar.getDate()}`;
    //   },
    //   onConfirm(event) {
    //     const [start, end] = event.detail;
    //     this.setData({
    //       show: false,
    //       dateCalendar: `${this.formatDate(start)}-${this.formatDate(end)}`,
    //     });

    //     //提取按确认键后的日期数据  
    //     this.setUpdatedDate(this.formatDate(start),this.formatDate(end));
    //     //日历点击确认后 弹出时间选择器
    //     this.setData({showPop:true})
    // },
    // //弹出层函数
    // showPopup() {
    //     this.setData({ showPop: true });
    //   },

    //   onClosePop() {
    //     this.setData({ showPop: false });
    //   },

    // //选择器函数

    //   onChange(event) {
    //     const { picker, value, index } = event.detail;
    //     // picker.setColumnValues(1, citys[value[0]]);
    //     // console.log(times[value[index]])
    //     Toast(`当前值：${value}, 当前索引：${index}`);
    //   },
    //   onConfirmPicker(e){
    //     const { picker, value, index } = e.detail;
    //     var pickupHour = util.setCurrentHour(value);
    //     var pickupMinute = util.setCurrentMMinute(value);
    //     var dropoffHour = util.setEndHour(value);
    //     var dropoffMinute = util.setEndMinute(value);

    //     this.setData({
    //         hourCurrent:pickupHour,
    //         hourEnd:dropoffHour,
    //         minuteCurrent:pickupMinute,
    //         minuteEnd:dropoffMinute
    //     })
    //     console.log(this.data.hourCurrent)
    //     console.log(this.data.hourEnd)
    //     console.log(this.data.minuteCurrent)
    //     console.log(this.data.minuteEnd)
    //     this.onClosePop()
    //   },
    //   onCancelPicker(e){
    //     this.onClosePop()
    //   },

    //导航函数
    navigateGuide: function () {
        wx.navigateTo({
            url: '../../pages/guide/guide'
        })
    },
    navigateAboutUs: function () {
        wx.navigateTo({
            url: '../../pages/aboutus/aboutus'
        })
    },
    //Toast函数
    showToast() {
        Toast({
            message: "暂不支持北京外地区取车",
            position: 'center',
            duration: 1500
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {

        wx.showModal({
            title: '服务须知',
            content: '欢迎您使用东方时尚汽车租赁微信小程序。我司车辆的最短租期为一周,请您按照最短租期为标准选择租用时间',
            showCancel: false,
            confirmColor: "#012ea5"
        })
        // promise.wxRequest(url:'/')
        //向selectTime/timeSelector组件里传入初始化的全局变量
        //变量为租车时间
        const child = this.selectComponent('#selectTimeComponent')
        // console.log(this.selectComponent('#selectTimeComponent'))
        child.setData({
            yearCurrent: app.globalData.yearCurrent,
            yearEnd: app.globalData.yearEnd,
            monthCurrent: app.globalData.monthCurrent,
            monthEnd: app.globalData.monthEnd,
            dateCurrent: app.globalData.dateCurrent,
            dateEnd: app.globalData.dateEnd,
            // hourCurrent:app.globalData.hourCurrent,
            // hourEnd:app.globalData.hourEnd,
            weekdayCurrent: app.globalData.weekdayCurrent,
            weekdayEnd: app.globalData.weekdayEnd,
            // minuteCurrent:app.globalData.minuteCurrent,
            // minuteEnd:app.globalData.minuteEnd,
            // dayInBetween:app.globalData.dayInBetween
            //location显示incompatible type...????
            locations: app.globalData.locations.value,
            pickUpLocation: app.globalData.locations.value[0],
            dropOffLocation: app.globalData.locations.value[0]
            // timeCurrent:app.globalData.timeCurrent,
            // timeEnd:app.globalData.timeEnd
        });
        console.log(app.globalData.locations)
        // console.log(child.properties.monthCurrent)

        //获取后端轮播图
        try {
            var firstPic = await promise.wxRequest({
                url: '/img/swiper/dfss1.jpg',
                responseType: 'arraybuffer',
            })
            if (firstPic.errMsg == "request:ok") {
                var swiper = this.data.swiperSrcList
                let img = 'data:image/png;base64,' + wx.arrayBufferToBase64(firstPic.data)
                swiper.push(img)
                this.setData({
                    swiperSrcList: swiper
                })
                var secondPic = await promise.wxRequest({
                    url: '/img/swiper/dfss2.jpg',
                    responseType: 'arraybuffer',
                })
                if (secondPic.errMsg == "request:ok") {
                    var swiper = this.data.swiperSrcList
                    let img = 'data:image/png;base64,' + wx.arrayBufferToBase64(secondPic.data)
                    swiper.push(img)
                    this.setData({
                        swiperSrcList: swiper
                    })
                    var thirdPic = await promise.wxRequest({
                        url: '/img/swiper/dfss3.jpg',
                        responseType: 'arraybuffer',
                    })
                    if (thirdPic.errMsg == "request:ok") {
                        var swiper = this.data.swiperSrcList
                        let img = 'data:image/png;base64,' + wx.arrayBufferToBase64(thirdPic.data)
                        swiper.push(img)
                        this.setData({
                            swiperSrcList: swiper
                        })
                        var fourthPic = await promise.wxRequest({
                            url: '/img/swiper/dfss4.jpg',
                            responseType: 'arraybuffer',
                        })
                        if (fourthPic.errMsg == "request:ok") {
                            var swiper = this.data.swiperSrcList
                            let img = 'data:image/png;base64,' + wx.arrayBufferToBase64(fourthPic.data)
                            swiper.push(img)
                            this.setData({
                                swiperSrcList: swiper
                            })
                            var fifthPic = await promise.wxRequest({
                                url: '/img/swiper/dfss5.jpg',
                                responseType: 'arraybuffer',
                            })
                            if (fourthPic.errMsg == "request:ok") {
                                var swiper = this.data.swiperSrcList
                                let img = 'data:image/png;base64,' + wx.arrayBufferToBase64(fifthPic.data)
                                swiper.push(img)
                                this.setData({
                                    swiperSrcList: swiper
                                })
                                
                            }
                        }
                    }
                }
            }
        } catch (err) {

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