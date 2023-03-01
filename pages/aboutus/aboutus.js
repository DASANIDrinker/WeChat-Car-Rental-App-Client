// pages/aboutus/aboutus.js
const promise = require('../../utils/requestUtil');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        aboutUsImg:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

        promise.wxRequest({
            url:'/img/aboutUs/about.png',
            responseType: 'arraybuffer',
        }).then(res=>{
            let img = 'data:image/png;base64,' + wx.arrayBufferToBase64(res.data)
            this.setData({
                aboutUsImg:img
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