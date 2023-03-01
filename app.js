// app.js
import Toast from './miniprogram_npm/@vant/weapp/toast/toast';
// import {getBaseUrl,requestUtil} from './utils/requestUtil.js';
const promise = require('./utils/requestUtil');
var util = require('./utils/util');
var app = getApp();
App({

  onLaunch() {
    let that = this
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var year = util.formatYear(new Date());
    var date = util.formatDate(new Date());
    console.log(date)
    var month = util.formatMonth(new Date());
    console.log(month)
    var weekday = util.formatWeekDay(new Date());
    var hour = util.formatHour(new Date());
    var minute = util.formatMinute(new Date());

    // console.log(that.globalData.weekdayCurrent)
    that.globalData.baseUrl = promise.getBaseUrl()
    that.globalData.yearCurrent = year
    that.globalData.yearEnd = year
    that.globalData.weekdayCurrent = weekday
    that.globalData.weekdayEnd = weekday
    that.globalData.minuteCurrent = minute
    that.globalData.minuteEnd = minute
    that.globalData.monthCurrent = month+1
    that.globalData.monthEnd = month+1
    that.globalData.dateCurrent = date
    that.globalData.dateEnd = date
    
    // promise.wxRequest({
    //     url: '/img/dfss1.jpg',
    // }).then(res=>{
    //     console.log(res)
    // }).catch(fail=>{
    //     console.log(fail)
    // })
    
    // wx.request({
    //     url:'/img/dfss1.jpg',
    //     success(res){
    //         console.log(res)
    //     }
    // })
  },
  globalData: {
      //获取用户信息的变量
        // hasUserInfo:{type:Boolean,value:false},
        // userInfo:{type:Object,value:{}},
        accessToken:'',
        baseUrl:'',
        yearCurrent:{type:Number,value:0},
        yearEnd:{type:Number,value:0},
        monthCurrent:{type:Number,value:0},
        monthEnd:{type:Number,value:0},
        dateCurrent:{type:Number,value:0},
        dateEnd:{type:Number,value:0},
        hourCurrent:{type:Number,value:10},
        hourEnd:{type:Number,value:10},
        weekdayCurrent:{type:String,value:'周一'},
        weekdayEnd:{type:String,value:'周一'},
        dayInBetween:{type:Number,value:0},
        minuteCurrent:{type:String,value:'00'},
        minuteEnd:{type:String,value:'00'},
        locations:{type:Array,value:["东方时尚驾校"]},
        timeCurrent:{type:String,value:""},
        timeEnd:{type:String,value:""},
        total:{type:Number,value:0},
        vehicle:{type:Object,value:null},
        isLoggedIn:false,
        phone:'',
        //用driver来判断选择好的司机
        Driver:{
            name:'',
            id:''
        },
        //idHolder和licenseHolder是用来上传证件存储和比对的
        idHolder:{
            name: '',
            id: '',
            addr: '',
            gender: '',
            nationality: '',
            birth: ''
        },
        licenseHolder:{
            id:'',
            name:''
        },
        review:null,
        idFrontPath:'',
        idBackPath:'',
        licensePath:'',
        //判断driverInfo页面是否为预定 1是在线下单 2是在线预订
        isReservation:'',
        //按照车主需要 保留四个需求
        isRecorder:"",
        isETC:"",
        isMount:"",
        isUmbrealla:"",
        //以下为判断login界面是从account页面导入的还是carPick页面导入的
        //如果fromAccount为1那么是从account页面导入
        //如果fromAccount为2那么是从carPick页面导入的
        //初始值为0
        fromAccount:0,
        //以下为用户的全部订单
        orders:{type:Array,value:[]},
        //以下为选择的退款的订单的商户单号
        outTradeNo:""
  },
  login:function(){
       var that = this
        //获取当前时间 
        var timestamp = Date.parse(new Date());
        var expiration = timestamp + 86400000; //缓存1天
        // 清空本地缓存
        // wx.clearStorage({
        //   success: (res) => {},
        // })
       //获取本地缓存的所有keys
        var cacheKeys = wx.getStorageInfoSync()
        //获取第一个key 也就是AccessToken key
        var keys = cacheKeys.keys
        console.log("keys:  " + keys)
        //如果没有key 也就是缓存为空
        if(!keys){
            this.promisfyLogin()
            //将新的accessToken作为key拼接并缓存 缓存value为时间
            setTimeout(()=>
            {
                this.setCacheStorage(expiration)
            }, 3000)
        //如果有keys 也就是缓存不为空
        }else{
            //获取accessToken
            var cacheKey = keys[0]
            //获取之前的缓存的时间
            var data_expiration = wx.getStorageSync(cacheKey);
            console.log(data_expiration)
            //如果缓存时间存在
            if (data_expiration) {
                //如果当前时间超过之前设置的缓存时间 数据过期
                    if (timestamp > data_expiration){
                        wx.removeStorageSync(cacheKey)//清理数据
                        this.promisfyLogin()//login获取数据
                        setTimeout(()=>
                        {
                            this.setCacheStorage(expiration)
                        }, 3000)
                    }
                    //当缓存时间仍未到期时
                    else{
                        console.log("Cache Time is: " +wx.getStorageSync(cacheKey))
                        console.log("Current Time is: " + timestamp)
                    }
            }else{//缓存时间不存在 设置新缓存
                this.promisfyLogin()
                // console.log(3)
                //将新的accessToken作为key拼接并缓存 缓存value为时间
                // this.setCacheStorage(expiration)
                setTimeout(()=>
                {
                    this.setCacheStorage(expiration)
                }, 3000)
            }
        }
        
  },

  promisfyLogin:function(){
    var that = this
    promise.login().then(
        res=>{
            promise.wxRequest({url:'/user/getOpenId',method:"POST",data:{code:res.code},header:{"Content-Type":"application/x-www-form-urlencoded"}})
            .then(res => {that.globalData.accessToken = res.data,
                 console.log(that.globalData.accessToken)}
             )
        }
    )
  },

  setCacheStorage:function(expiration){
      var that = this
      //将新的accessToken作为key拼接并缓存 缓存value为时间
      var cacheUpdatedKey = "AT:" + that.globalData.accessToken
      console.log(cacheUpdatedKey)
      //将cacheUpdatedKey作为key,expiration作为value储存
      wx.setStorageSync(cacheUpdatedKey, expiration)
  }

})
