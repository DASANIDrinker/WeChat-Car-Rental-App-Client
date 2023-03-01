const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const weekday = date.getDay()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}
//date代表传进去的参数是date
const formatDate = date =>{
    const day = date.getDate()
    return day;
}
const formatMonth = date =>{
    const month = date.getMonth()
    return month;
}
const formatYear = date =>{
    const year = date.getFullYear();
    // console.log(year)
    return year;
}
const formatWeekDay = date =>{
    let _day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate());
    let weekday = newDate.getDay();
    // console.log(weekday)
    return _day[weekday];
}
const formatHour = date =>{
    const hour = date.getHours()
    return hour;
}
const formatMinute = date =>{
    const minute = date.getMinutes()
    return minute;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
function setMonth(str){
    var x = str.indexOf("/")
    var month = str.slice(0,x)
    return month
}
function setDate(str){
    var x = str.indexOf("/")
    var date = str.slice(x+1,str.length)
    return date
}
function setCurrentMonth(str){
    var x = str.indexOf("/")
    var CurrentMonth = str.slice(0,x)
    return CurrentMonth
}
function setCurrentDate(str){
    var x = str.indexOf("/")
    var y = str.indexOf("-")
    var CurrentDate = str.slice(x+1,y)
    return CurrentDate
}
function setEndMonth(str){
    var x = str.indexOf("-")
    var y = str.lastIndexOf("/")
    var EndMonth = str.slice(x+1,y)
    return EndMonth
}
function setEndDate(str){
    var x = str.lastIndexOf("/")
    var EndDate = str.slice(x+1,str.length)
    return EndDate
}
//时间选择器传进来的时间是按照数组格式:["12:00","11:15"]
function setCurrentHour(str){
    var x = str[0]
    var y = x.indexOf(":")
    var pickupHour = x.slice(0,y)
    return pickupHour
}
function setEndHour(str){
    var x = str[1]
    var y = x.indexOf(":")
    var dropoffHour = x.slice(0,y)
    return dropoffHour
}
function setCurrentMMinute(str){
   var x = str[0]
   var y = x.indexOf(":")
   var pickupMinute = x.slice(y+1,x.length)
    return pickupMinute
}
function setEndMinute(str){
    var x = str[1]
    var y = x.indexOf(":")
    var dropoffMinute = x.slice(y+1,x.length)
    return dropoffMinute
}
const deepClone = function(initalObj) {
    var obj = {};
    obj = JSON.parse(JSON.stringify(initalObj));
    return obj;
}
//身份证号码验证
function identityCodeValid(code) {
    var city = {
      11: "北京",
      12: "天津",
      13: "河北",
      14: "山西",
      15: "内蒙古",
      21: "辽宁",
      22: "吉林",
      23: "黑龙江 ",
      31: "上海",
      32: "江苏",
      33: "浙江",
      34: "安徽",
      35: "福建",
      36: "江西",
      37: "山东",
      41: "河南",
      42: "湖北 ",
      43: "湖南",
      44: "广东",
      45: "广西",
      46: "海南",
      50: "重庆",
      51: "四川",
      52: "贵州",
      53: "云南",
      54: "西藏 ",
      61: "陕西",
      62: "甘肃",
      63: "青海",
      64: "宁夏",
      65: "新疆",
      71: "台湾",
      81: "香港",
      82: "澳门",
      91: "国外 "
    };
    var tip = "";
    var pass = true;
   
    // if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
    //   tip = "身份证号格式错误";
    //   pass = false;
    // }

    if (!code){
        tip = "身份证号不能为空，请重新输入";
        pass = false;
    } 
    else if(!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
        tip = "身份证号格式错误,请重新输入";
        pass = false;
    }
    else if (!city[code.substr(0, 2)]) {
      tip = "地址编码错误,请重新输入";
      pass = false;
    } else {
      //18位身份证需要验证最后一位校验位
      if (code.length == 18) {
        code = code.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        //校验位
        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        var sum = 0;
        var ai = 0;
        var wi = 0;
        for (var i = 0; i < 17; i++) {
          ai = code[i];
          wi = factor[i];
          sum += ai * wi;
        }
        var last = parity[sum % 11];
        if (parity[sum % 11] != code[17]) {
          tip = "校验位错误,请重新输入";
          pass = false;
        }
      }
    }
    return [pass,tip];
}

// setCacheStorage(expiration,accessToken){
//     var that = this
//     //将新的accessToken作为key拼接并缓存 缓存value为时间
//     // var cacheUpdatedKey = "AT:" + that.globalData.accessToken
//     var cacheUpdatedKey = "AT:" + accessToken
//     console.log(cacheUpdatedKey)
//     //将cacheUpdatedKey作为key,expiration作为value储存
//     wx.setStorageSync(cacheUpdatedKey, expiration)
// }

function terminateLoop(second){
    var date = new Date()
    if(date.getSeconds() > second + 2){
        return true
    }
    return false
}

module.exports = {
  formatTime,
  formatDate,
  formatMonth,
  formatWeekDay,
  formatHour,
  formatMinute,
  setCurrentMonth,
  setCurrentDate,
  setEndMonth,
  setEndDate,
  setMonth,
  setDate,
  setCurrentHour,
  setEndHour,
  setCurrentMMinute,
  setEndMinute,
  formatYear,
  deepClone,
  identityCodeValid,
  terminateLoop
//   setCacheStorage
}
