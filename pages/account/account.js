// pages/account/account.js
const util = require('../../utils/util');
const app = getApp();
const promise = require('../../utils/requestUtil');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLoggedIn: false,
        orders: [],
        scrollHeight: 1000,
        rightId: "right0",
        heightArr: [],
        backGroundImg:""
    },
    navigateToLogin() {
        if (app.globalData.isLoggedIn == false) {
            wx.navigateTo({
                url: '../login/login',
            })
            //设置进入login页面是从account页面进入的
            app.globalData.fromAccount = 1
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var that = this
        that.setData({
            isLoggedIn: app.globalData.isLoggedIn
        })
        console.log(app.globalData.accessToken)
        console.log(that.data.orders)

        //获取后端图片
        promise.wxRequest({
            url: '/img/account-background/background.jpg',
            responseType: 'arraybuffer',
        }).then(res=>{
            console.log(res)
            let img ='data:image/png;base64,'+wx.arrayBufferToBase64(res.data)
            this.setData({
                backGroundImg:img
            })
        }).catch(fail=>{
            console.log(fail)
        })

        //如果登录
        if (that.data.isLoggedIn) {
            console.log("aaaaa")
            promise.wxRequest({
                url: '/orders/getByUserId',
                data: { userId: app.globalData.accessToken },
                method: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(res => {
                console.log(res)
                that.setData({
                    orders: res.data
                })
                // for(var i = 0;i<that.data.orders.length; i++){
                //     that.data.orders[i].startDate = Date(that.data.orders[i].startDate)
                //     that.data.orders[i].endDate = Date(that.data.orders[i].endDate)
                // }
                var temp = that.data.orders.sort(function (a, b) {
                    return b.orderId - a.orderId
                })
                that.setData({
                    orders: temp
                })
                //遍历所有订单 将后端返回的ISO格式时间 转化为YYYY:MM:DD HH:mm格式
                for (var i = 0; i < that.data.orders.length; i++) {
                    that.data.orders[i].startDate = new Date(that.data.orders[i].startDate).Format('yyyy-MM-dd hh:mm').toString()
                    that.data.orders[i].endDate = new Date(that.data.orders[i].endDate).Format('yyyy-MM-dd hh:mm').toString()
                    console.log(that.data.orders[i].startDate)
                    console.log(that.data.orders[i].endDate)
                }
                //需要重新setData 否则视图层监听不到订单时间的格式变化
                that.setData({
                    orders: that.data.orders
                })
                console.log(temp)
                console.log(that.data.orders)
                console.log(typeof (that.data.orders))
            }).catch(fail => {

            })

            

        }

        

        //修改Date的格式 从而达到将ISO时间标准转化为YYYY:MM:DD HH:mm格式的需求
        Date.prototype.Format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }


    },

    

    refundRequest(e){
        var that = this
        console.log(e.currentTarget.dataset.otn)
        // console.log(aa)
    },
    

    // },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        // this.setScrollHeight()
        // this.setBlockHeight()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        var that = this
        that.setData({
            isLoggedIn: app.globalData.isLoggedIn
        })
        console.log(app.globalData.accessToken)
        console.log(that.data.orders)
        console.log(that.data.isLoggedIn)
        //如果登录
        if (that.data.isLoggedIn) {
            console.log("aaaaa")
            promise.wxRequest({
                url: '/orders/getByUserId',
                data: { userId: app.globalData.accessToken },
                method: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(res => {
                console.log(res)
                that.setData({
                    orders: res.data
                })
                var temp = that.data.orders.sort(function (a, b) {
                    return b.orderId - a.orderId
                })
                that.setData({
                    orders: temp
                })
                //遍历所有订单 将后端返回的ISO格式时间 转化为YYYY:MM:DD HH:mm格式
                for (var i = 0; i < that.data.orders.length; i++) {
                    that.data.orders[i].startDate = new Date(that.data.orders[i].startDate).Format('yyyy-MM-dd hh:mm').toString()
                    that.data.orders[i].endDate = new Date(that.data.orders[i].endDate).Format('yyyy-MM-dd hh:mm').toString()
                    console.log(that.data.orders[i].startDate)
                    console.log(that.data.orders[i].endDate)
                }
                //需要重新setData 否则视图层监听不到订单时间的格式变化
                that.setData({
                    orders: that.data.orders
                })
                console.log(temp)
                console.log(that.data.orders)
                console.log(typeof (that.data.orders))
            }).catch(fail => {

            })


        }

        //修改Date的格式 从而达到将ISO时间标准转化为YYYY:MM:DD HH:mm格式的需求
        Date.prototype.Format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
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