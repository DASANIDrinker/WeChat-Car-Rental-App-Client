// components/selectTime.js
// import Toast from '../miniprogram_npm/@vant/weapp/toast/toast';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
var util = require('../../utils/util');
const app = getApp();
const times = {
  PickUp: ['9:00', '9:15', '9:30', '9:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00'],
  DropOff: ['9:00', '9:15', '9:30', '9:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00'],
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    yearCurrent: { type: Number, value: 0 },
    yearEnd: { type: Number, value: 0 },
    monthCurrent: { type: Number, value: 0 },
    monthEnd: { type: Number, value: 0 },
    dateCurrent: { type: Number, value: 0 },
    dateEnd: { type: Number, value: 0 },
    hourCurrent: { type: Number, value: 10 },
    hourEnd: { type: Number, value: 10 },
    weekdayCurrent: { type: String, value: '周一' },
    weekdayEnd: { type: String, value: '周一' },
    dayInBetween: { type: Number, value: 0 },
    minuteCurrent: { type: String, value: '00' },
    minuteEnd: { type: String, value: '00' },
    locations: { type: Array, value: ["东方时尚驾校"] },
    timeCurrent: { type: String, value: "" },
    timeEnd: { type: String, value: "" },
    pickUpLocation: { type: String, value: "" },
    dropOffLocation: { type: String, value: "" }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //弹出层参数
    showPop: false,
    //选择器参数
    //取车还车时间选择器参数
    columns: [
      {
        values: times['PickUp'],
        className: 'column1',
        defaultIndex: 12
      },
      {
        values: times['DropOff'],
        className: 'column2',
        defaultIndex: 12
      },
    ],
    //Calendar 参数
    dateCalendar: '默认值',
    hourCurrentCalendar: '默认值',
    hourEndCalendar: '默认值',
    show: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //轻提示函数
    showToast() {
      Toast({
        message: "暂不支持北京外地区取车",
        position: 'center',
        duration: 2000,
        context: this
      })
    },
    showAnotherToast() {
      Toast({
        message: "您的租车时间为0天,请选择七天以上的租期",
        position: 'center',
        duration: 2500,
        context: this
      })
    },
    //Calendar函数
    //设置日历返回的日期参数
    setUpdatedDate(start, end) {
      //因为Calendar组件返回值不包括年份
      //所以我们需要自行判定 并添加年份
      console.log(start)
      console.log(end)
      var year1Position = start.indexOf("/")
      var year1 = start.slice(0,year1Position)
      var year2Position = end.indexOf("/")
      var year2 = end.slice(0, year2Position)
      var secondHalf1 = start.slice(year1Position+1)
      console.log(secondHalf1)
      var secondHalf2 = end.slice(year2Position+1)
      var month1Position = secondHalf1.indexOf("/")
      var month1 = secondHalf1.slice(0, month1Position)
      var month2Position = secondHalf2.indexOf("/")
      var month2 = secondHalf2.slice(0, month2Position)
      var date1 = start.slice(year1Position+1+month1Position+1)
      var date2 = end.slice(year2Position+1+month2Position+1)
      console.log(year1)
      console.log(year2)
      console.log(month1)
      console.log(month2)
      console.log(date1)
      console.log(date2)
      // if (month1 > month2) {
      //   var endYear = (util.formatYear(new Date()) + 1).toString()
      // } else {
      //   var endYear = util.formatYear(new Date()).toString()
      // }
      // var startYear = util.formatYear(new Date()).toString()
      var startDate = year1.toString().concat("/",month1.toString()).concat("/",date1.toString())
      var endDate = year2.toString().concat("/",month2.toString()).concat("/",date2.toString())
      // var startDate = startYear.concat("/", start.toString())
      // var endDate = endYear.concat("/", end.toString())
      console.log(startDate)
      console.log(endDate)
      var startDate = new Date(startDate)
      var endDate = new Date(endDate)
      console.log(startDate)
      console.log(endDate)
      // console.log(startDate)
      //计算两个日期之间的天数
      var day = parseInt((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      //在没有确定小时和分钟的时候 将同一天租车还车
      //的天数设置为1
      if (day == 0) {
        day = 1
      }
      var weekdaycurrent = util.formatWeekDay(startDate)
      var weekdayend = util.formatWeekDay(endDate)
      this.setData({
        monthCurrent: month1,
        monthEnd: month2,
        dateCurrent: date1,
        dateEnd: date2,
        dayInBetween: day,
        weekdayCurrent: weekdaycurrent,
        weekdayEnd: weekdayend,
        yearCurrent: year1,
        yearEnd: year2
      })
      console.log(11111)
      // console.log('setUpdatedDate里面的util.setMonth是:' + util.setMonth(start))
      // console.log('setUpdatedDate里面的monthCurrent是:' + this.data.monthCurrent)
      // console.log('monthEnd是 '+this.data.monthEnd)
      // console.log('dateCurrent是 '+this.data.dateCurrent)
      // console.log('dateEnd 是 '+this.data.dateEnd)
    },
    //日历显示
    onDisplayCalendar() {
      this.setData({
        show: true
      });
    },
    //日历关闭
    onClose() {
      this.setData({ show: false });
    },
    //定义日期格式
    formatDate(dateCalendar) {
      dateCalendar = new Date(dateCalendar);
      return `${dateCalendar.getFullYear()}/${dateCalendar.getMonth() + 1}/${dateCalendar.getDate()}`;
    },
    //日历确定键
    onConfirm(event) {
      const [start, end] = event.detail;
      console.log(event.detail)
      console.log(start)
      console.log(end)
      this.setData({
        show: false,
        dateCalendar: `${this.formatDate(start)}-${this.formatDate(end)}`,
      });
      // console.log(this.dateCalendar)
      // console.log(this.formatDate(start))
      //提取按确认键后的日期数据  
      this.setUpdatedDate(this.formatDate(start), this.formatDate(end));

      //将本组件中获取的取车时间相关信息全部返还给globalData
      app.globalData.yearCurrent = this.properties.yearCurrent
      app.globalData.yearEnd = this.properties.yearEnd
      app.globalData.monthCurrent = this.properties.monthCurrent
      app.globalData.monthEnd = this.properties.monthEnd
      app.globalData.dateCurrent = this.properties.dateCurrent
      app.globalData.dateEnd = this.properties.dateEnd
      app.globalData.weekdayCurrent = this.properties.weekdayCurrent
      app.globalData.weekdayEnd = this.properties.weekdayEnd
      app.globalData.dayInBetween = this.properties.dayInBetween

      //日历点击确认后 弹出时间选择器
      this.setData({
        showPop: true
      })

      // console.log(app.globalData.monthCurrent)
      // console.log(app.globalData.monthEnd)
      // console.log(app.globalData.dateCurrent)
      // console.log(app.globalData.dateEnd)
      // console.log(app.globalData.weekdayCurrent)
      // console.log(app.globalData.weekdayEnd)
      // console.log(app.globalData.dayInBetween)
      // console.log(app.globalData.yearCurrent)
      // console.log(app.globalData.yearEnd)

    },
    //弹出层函数
    //显示弹出层
    showPopup() {
      this.setData({ showPop: true });
    },
    //关闭弹出层
    onClosePop() {
      this.setData({ showPop: false });
    },

    //选择器函数
    //选择器修改选项
    onChange(event) {
      const { picker, value, index } = event.detail;
    },
    //选择器确认键
    onConfirmPicker(e) {
      //将选中的值分解为所需的数据
      const { picker, value, index } = e.detail;
      console.log(value)
      var pickupHour = util.setCurrentHour(value);
      var pickupMinute = util.setCurrentMMinute(value);
      var dropoffHour = util.setEndHour(value);
      var dropoffMinute = util.setEndMinute(value);

      //将两个日期完整拼接(包括小时 分钟) 以便算出真实的租用天数
      //eg. 5.24早上八点 到5.25晚上五点的真实租用时间为两天
      //之所以不在Calendar里面操作是因为 Calendar没有能力提取具体的小时和分钟

      //如果碰到 2022 12.20 - 2023.1.20 系统会显示天数为负数 因为系统无法识别年份 所以固定所有年份均为当前的年份
      //因此碰到这种情况的话 我们将后面的年份+1
      // if(app.globalData.monthCurrent > app.globalData.monthEnd){
      //     app.globalData.yearEnd += 1
      // }
      var startDate = app.globalData.yearCurrent.toString().concat("/", app.globalData.monthCurrent.toString(), "/", app.globalData.dateCurrent.toString(), " ", pickupHour.toString(), ":", pickupMinute.toString())
      console.log(app.globalData.monthCurrent.toString())
      var endDate = app.globalData.yearEnd.toString().concat("/", app.globalData.monthEnd.toString(), "/", app.globalData.dateEnd.toString(), " ", dropoffHour.toString(), ":", dropoffMinute.toString())
      var sDate = new Date(startDate)
      var eDate = new Date(endDate)
      // console.log(sDate)
      // console.log(eDate)
      var day = parseFloat((eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24))
      // console.log(day)
      var day = Math.ceil(day)
      //假如同一天租车还车 且还车时间在租车时间之前
      //则day会变成0 此时需要提示 并要求用户重新输入
      if (day == 0) {
        this.showAnotherToast()
      }
      // console.log(day)
      // console.log(startDate)
      // console.log(endDate)
      this.setData({
        hourCurrent: pickupHour,
        hourEnd: dropoffHour,
        minuteCurrent: pickupMinute,
        minuteEnd: dropoffMinute,
        dayInBetween: day,
        timeCurrent: startDate,
        timeEnd: endDate
      })
      app.globalData.hourCurrent = this.properties.hourCurrent
      app.globalData.hourEnd = this.properties.hourEnd
      app.globalData.minuteCurrent = this.properties.minuteCurrent
      app.globalData.minuteEnd = this.properties.minuteEnd
      app.globalData.dayInBetween = this.properties.dayInBetween
      app.globalData.timeCurrent = this.properties.timeCurrent
      app.globalData.timeEnd = this.properties.timeEnd
      console.log(app.globalData.timeCurrent)
      console.log(app.globalData.timeEnd)
      console.log(app.globalData.locations)
      // console.log(app.globalData.hourCurrent)
      // console.log(app.globalData.hourEnd)
      // console.log(app.globalData.minuteCurrent)
      // console.log(app.globalData.minuteEnd)
      // console.log(app.globalData.dayInBetween)
      this.onClosePop()
    },
    //选择器取消键
    onCancelPicker(e) {
      this.onClosePop()
    },
    //导航函数
    navigateCarPick: function () {
      const pageStack = getCurrentPages()
      console.log(pageStack)
      //首先检查租用天数
      if (this.data.dayInBetween == 0) {
        this.showAnotherToast()
      } else if (this.data.dayInBetween < 7) {
        wx.showModal({
          title:'温馨提示',
          content: '我司车辆的租用时间最短为一周。您的租用时间少于一周,请您按需修改租用时间。感谢您的理解',
          showCancel: false,
          confirmColor: "#012ea5"
        })
      }
      //然后检查页面栈的数量
      //如果我们在carPick页面选择修改时间
      //那么页面栈应该保持最上面的页面为原来的carPick
      //而不是navigate之后新的carPick页面
      //当pageStack数量为2时 我们已经进入carPick页面
      //所以无需再次navigate到Carpick页面 只需要刷新一遍即可
      else if (pageStack.length == 2) {
        //刷新页面栈最上面的page
        //也就是当前page
        var refreshPage = pageStack[pageStack.length - 1]
        refreshPage.onLoad()
        console.log(pageStack)
        //当我们第一次进入carPick页面时
      } else {
        wx.navigateTo({
          url: '../carPick/carPick',
        })
        console.log(pageStack)
      }
    },
    //测试数据的函数
    showData() {
      console.log(this.properties.monthCurrent)
      console.log(this.properties.monthEnd)
      console.log(this.properties.dateCurrent)
      console.log(this.properties.dateEnd)
      console.log(this.properties.yearCurrent)
      console.log(this.properties.yearEnd)
      console.log(this.properties.hourCurrent)
      console.log(this.properties.hourEnd)
      console.log(this.properties.minuteCurrent)
      console.log(this.properties.minuteEnd)
      console.log(this.properties.weekdayCurrent)
      console.log(this.properties.weekdayEnd)
      console.log(this.properties.dayInBetween)
      console.log(this.properties.locations)
      console.log(this.properties.timeCurrent)
      console.log(this.properties.timeEnd)
    }
  }
})
