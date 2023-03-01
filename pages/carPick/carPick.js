// pages/carPick/carPick.js
const util = require('../../utils/util');
const app = getApp();
const promise = require('../../utils/requestUtil');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // hasUserInfo:{type:Boolean,value:false},
        // userInfo:{type:Object,value:{}},
        //scroll view组件的高度
        scrollHeight: Number,
        //选择时间Component参数
        locations: Array,
        timeCurrent: String,
        timeEnd: String,
        dayInBetween: Number,
        pickUpLocation: String,
        dropOffLocation: String,
        show: false,
        //下拉菜单参数
        //第一栏参数(综合排序)
        option1: [{
            text: '综合排序',
            value: 0
        },
        {
            text: '价格从低到高',
            value: 1
        },
        {
            text: '价格从高到低',
            value: 2
        },
        ],
        value1: 0,
        //属于下拉菜单第二栏的 分类选择参数
        //属于下拉菜单第二栏的 分类选择参数
        //属于下拉菜单第二栏的 分类选择参数
        brandTitle: '品牌',
        //左侧选中项的索引
        mainActiveIndex: 0,
        //右侧选中项的 id，支持传入数组
        activeId: [],
        //右侧项最大选中个数
        max: 20,
        brandArr: [],
        items: [
            // {
            // //   // 导航名称
            //   text: '大众',
            //   // 导航名称右上角徽标，1.5.0 版本开始支持
            // //   badge: 3,
            //   // 是否在导航名称右上角显示小红点，1.5.0 版本开始支持
            //   dot: false,
            //   // 禁用选项
            // //   disabled: false,
            //   // 该导航下所有的可选项
            //   children: [
            //     {
            //       // 名称
            //       text: '速腾',
            //       // id，作为匹配选中状态的标识
            //       id: 1,
            //       // 禁用选项
            //     //   disabled: true,
            //     },
            //     {
            //       text: '宝莱',
            //       id: 2,
            //     },
            //   ],
            // },
        ],

        //属于下拉菜单第三栏的价格栏
        //属于下拉菜单第三栏的价格栏
        //属于下拉菜单第三栏的价格栏
        priceTitle: '价格',
        priceColorList: ['#4d6cc2', '#4d6cc2', '#4d6cc2', '#4d6cc2', '#4d6cc2'],
        priceList: ['0-150', '150-250', '250-350', '>350', '>0'],
        // currentPrice:
        //属于下拉菜单第四栏的更多栏
        //属于下拉菜单第四栏的更多栏
        //属于下拉菜单第四栏的更多栏
        moreTitle: '更多',
        configColorList: ['#4d6cc2', '#4d6cc2', '#4d6cc2', '#4d6cc2', '#4d6cc2', '#4d6cc2', '#4d6cc2'],
        configList: [''],
        powerColorList: ['#4d6cc2', '#4d6cc2', '#4d6cc2'],
        seatColorList: ['#4d6cc2', '#4d6cc2'],
        gearColorList: ['#4d6cc2', '#4d6cc2'],
        compartmentColorList: ['#4d6cc2', '#4d6cc2'],
        seriesColorList: ['#4d6cc2', '#4d6cc2', '#4d6cc2', '#4d6cc2'],
        //租车界面的车类型导航参数
        //也就是页面左侧的选项
        //navIndex用来判断左侧导航栏样式
        navIndex: 0,
        //scroll view通过leftId和rightId用来确认滚动位置
        //scroll into view绑定的格式不能以数字开头
        leftId: "left0",
        rightId: "right0",
        heightArr: [],
        navArray: [{
            "id": 0,
            "title": "推荐",
            "subArray": [],
            "subUselessArray": [],
            "subUselessBrandArr": [],
            "subUselessConfigArr": [],
        },
        {
            "id": 1,
            "title": "经济型",
            "subArray": [],
            "subUselessArray": [],
            "subUselessBrandArr": [],
            "subUselessConfigArr": [],
        },
        {
            "id": 2,
            "title": "纯电动",
            "subArray": [],
            "subUselessArray": [],
            "subUselessBrandArr": [],
            "subUselessConfigArr": [],
        },
        {
            "id": 3,
            "title": "舒适型",
            "subArray": [],
            "subUselessArray": [],
            "subUselessBrandArr": [],
            "subUselessConfigArr": [],
        },
        {
            "id": 4,
            "title": "SUV",
            "subArray": [],
            "subUselessArray": [],
            "subUselessBrandArr": [],
            "subUselessConfigArr": [],
        },
        {
            "id": 5,
            "title": "商务型",
            "subArray": [],
            "subUselessArray": [],
            "subUselessBrandArr": [],
            "subUselessConfigArr": [],
        },
        {
            "id": 6,
            "title": "豪华型",
            "subArray": [],
            "subUselessArray": [],
            "subUselessBrandArr": [],
            "subUselessConfigArr": [],
        },
        ],
        //用来存储后端的汽车数据
        vehicleTypeArr: [],
    },

    //获取用户信息函数
    // getUserProfile:function(){
    //     wx.getUserProfile({
    //       desc: '获取用户信息',
    //       success:(res) => {
    //         console.log(res.userInfo);
    //         this.setData({
    //           hasUserInfo:true,
    //           userInfo:res.userInfo
    //         })
    //       }
    //     })
    //   },
    //选择时间的弹出层函数
    showPopup() {
        this.setData({
            show: true
        });
    },

    onClose() {
        this.setData({
            show: false
        });
        // let pageStack = getCurrentPages()
        // console.log(pageStack)
    },

    //下拉菜单函数
    //下拉菜单函数
    //下拉菜单函数

    //下拉菜单第一栏函数
    //当选项改变时
    onChangeDropDown(e) {
        var that = this
        //默认排序 按照后端返回顺序
        if (e.detail === 0) {
            for (var i = 0; i < that.data.navArray.length; i++) {
                var temp = that.data.navArray[i].subArray
                console.log(temp)
                temp = temp.sort(function (a, b) {
                    return a.vehicleTypeId - b.vehicleTypeId
                })
                temp = that.convertBackEndData(temp)
                that.setData({
                    ['navArray[' + i + '].subArray']: temp
                })
            }
            console.log(that.data.navArray)
        } else if (e.detail === 1) {
            //sort升序排列每天费用
            //sort没有放在deepClone里面是因为sort会改变原数据
            for (var j = 0; j < that.data.navArray.length; j++) {
                var temp = that.data.navArray[j].subArray
                temp = temp.sort(function (a, b) {
                    return a.feePerDay - b.feePerDay
                })
                temp = that.convertBackEndData(temp)
                that.setData({
                    ['navArray[' + j + '].subArray']: temp
                })
            }
            console.log(that.data.navArray)
        } else if (e.detail === 2) {
            //sort降序排列每天费用
            for (var j = 0; j < that.data.navArray.length; j++) {
                var temp = that.data.navArray[j].subArray
                temp = temp.sort(function (a, b) {
                    return b.feePerDay - a.feePerDay
                })
                temp = that.convertBackEndData(temp)
                that.setData({
                    ['navArray[' + j + '].subArray']: temp
                })
            }
            console.log(that.data.navArray)
        }
        //重新设置右侧布局
        this.setBlockHeight()
    },

    //下拉菜单第二栏函数
    //下拉菜单第二栏函数
    //下拉菜单第二栏函数

    //处理后端品牌数据
    //将后端的车辆数据的brand和model作为一组composite key
    //这两个数据一起来定义独特的PK 只要两个(brand model)有一个不同的品牌
    async handleBrandData() {
        var that = this
        var tempTypeArr1 = util.deepClone(that.data.vehicleTypeArr)
        var tempTypeArr2 = util.deepClone(that.data.vehicleTypeArr)
        //循环后端返回的2d数组 分别将第一个数组的i 和第二个数组的j对比
        for (var i = 0; i < tempTypeArr1.length; i++) {
            for (var j = 0; j < tempTypeArr2.length; j++) {
                //如果两辆车完全相同(brand model相同) 保存这辆车
                if (tempTypeArr1[i].brand == tempTypeArr2[j].brand && tempTypeArr1[i].model == tempTypeArr2[j].model) {
                    var brandAndModel = {
                        brand: tempTypeArr2[j].brand,
                        model: tempTypeArr2[j].model
                    }
                    // console.log(brandAndModel)
                    //对比我们存储品牌数据的数组 假如长度为空 代表第一次录数据
                    //将保存的品牌实例放进去
                    if (that.data.brandArr.length == 0) {
                        that.data.brandArr.push(brandAndModel)
                    }
                    //加入长度不为0代表 我们的品牌数组已含有实例 需再判断
                    else {
                        //将品牌数组循环 看这次保存的实例是否存在于品牌数组中
                        var k = 0
                        for (k; k < that.data.brandArr.length; k++) {
                            if (brandAndModel.brand == that.data.brandArr[k].brand && brandAndModel.model == that.data.brandArr[k].model) {
                                //如果找到就停止循环
                                break
                            }
                        }
                        // console.log(k)
                        var tempBrandArr = that.data.brandArr
                        //还需再判断品牌数组最后一位 与保存实例相同的情况
                        //因为在这种情况下 k等于品牌数组长度
                        //所以额外判断两个实例是否完全一样
                        if (k == that.data.brandArr.length && that.data.brandArr[k] != brandAndModel) {
                            tempBrandArr.push(brandAndModel)
                            that.setData({
                                brandArr: tempBrandArr
                            })
                            // that.data.brandArr.push(brandAndModel)
                        }
                    }
                } else if (tempTypeArr1[i].model != tempTypeArr2[j].model) {
                    var tempBrandArr = util.deepClone(that.data.brandArr)
                    var brandAndModel1 = {
                        brand: tempTypeArr1[i].brand,
                        model: tempTypeArr1[i].model
                    }
                    var brandAndModel2 = {
                        brand: tempTypeArr2[j].brand,
                        model: tempTypeArr2[j].model
                    }
                    if (that.data.brandArr.length == 0) {
                        that.data.brandArr.push(brandAndModel1)
                        that.data.brandArr.push(brandAndModel2)
                    } else {
                        var k = 0
                        // console.log(k)
                        for (k; k < that.data.brandArr.length; k++) {
                            if (brandAndModel2.brand == that.data.brandArr[k].brand && brandAndModel2.model == that.data.brandArr[k].model) {
                                break
                            }
                        }
                        // console.log(k)
                        var tempBrandArr = that.data.brandArr
                        if (k == that.data.brandArr.length && that.data.brandArr[k] != brandAndModel2) {
                            tempBrandArr.push(brandAndModel2)
                            that.setData({
                                brandArr: tempBrandArr
                            })
                            // that.data.brandArr.push(brandAndModel2)   
                        }
                    }
                }
            }
        }
        // console.log(that.data.brandArr)
    },
    //将品牌数组重新组织成treeSelect的格式

    //函数的目的是将相同brand的车辆的id按升序自增
    //思路是外层循环每个独特的brand(每个品牌的车辆只有一个brand)
    //通过visited做到 visited存每个品牌的第一次出现 跳过重复的出现 
    //达到满足外层brand独特性的要求
    //内层为所有车辆
    //外层的元素和内层元素对比 如果brand相同 id自增一 (idCount用来记录每个brand出现的次数)
    async reorderBrand() {
        var that = this
        var tempBrandArr1 = util.deepClone(that.data.brandArr)
        var tempBrandArr2 = util.deepClone(that.data.brandArr)
        //将每个brand后面加上id 便于品牌下拉菜单存入
        for (var k = 0; k < that.data.brandArr.length; k++) {
            var tempBrand = {
                brand: that.data.brandArr[k].brand,
                model: that.data.brandArr[k].model,
                id: 0
            }
            that.data.brandArr[k] = tempBrand
        }
        // console.log(that.data.brandArr)
        //visited记录每个循环里的tempBrandArr1[i]是否出现过
        //如果没出现过 存入 如果出现过不存入
        var visited = []
        ////将id重新设置为所有型号在一起的升序排列
        //之前的设置是因为搞错了
        var totalCount = 0
        for (var i = 0; i < tempBrandArr1.length; i++) {
            var current = tempBrandArr1[i]
            // visited.push(current)
            //长度为0直接存
            if (visited.length == 0) {
                visited.push(current)
            } else {
                //长度大于0的时候 循环visited
                // var w = 0
                for (var w = 0; w < visited.length; w++) {
                    if (visited[w].brand == current.brand) {
                        break
                    }
                }
                //如果w在最后一位(w循环完为数组的长度)并且最后一位也不等于当前的品牌
                //那么就证明该品牌不存在于visited内  存入visited
                if (w == visited.length && visited[w - 1].brand != current.brand) {
                    visited.push(current)
                } else {
                    //如果存在于visited 那么就跳过这次循环 必须达到每个品牌brand只出现一次
                    continue
                }
            }
        }
        var count = 0
        for (var i = 0; i < that.data.brandArr.length; i++) {
            // var tempArr = that.data.brandArr[i]
            count++
            that.data.brandArr[i].id = count
        }
        // console.log(that.data.brandArr)
        // console.log(visited)

        //设置品牌的treeSelect格式
        for (var z = 0; z < visited.length; z++) {
            // visited[z] = {text:visited[z].brand,dot:false,children:[{text:visited[z].model,id:1,selected:false}]}
            visited[z] = {
                text: visited[z].brand,
                dot: false,
                children: []
            }
        }
        // console.log(visited)
        tempBrandArr1 = util.deepClone(that.data.brandArr)
        for (var x = 0; x < visited.length; x++) {
            for (var y = 0; y < tempBrandArr1.length; y++) {
                // if(visited[x].text == tempBrandArr1[y].brand&&visited[x].children[0].text!=tempBrandArr1[y].model){
                if (visited[x].text == tempBrandArr1[y].brand) {
                    // console.log(tempBrandArr1[y].id)
                    visited[x].children.push({
                        text: tempBrandArr1[y].model,
                        id: tempBrandArr1[y].id,
                        selected: false
                    })
                }
            }
        }
        // console.log(visited)
        that.setData({
            items: visited
        })
    },
    //分类选项函数
    onClickNav({
        detail = {}
    }) {
        var that = this
        // console.log(detail)
        that.setData({
            mainActiveIndex: detail.index || 0,
        });
    },
    //点击品牌右侧型号 
    //会将型号是否被选择的状态 设置在items里面 items[i].children[j].selected = true/false
    onClickItem({
        detail = {}
    }) {
        // console.log(detail)
        // var that = this
        var navId = util.deepClone(this.data.mainActiveIndex)
        // console.log(this.data.mainActiveIndex)
        //detail为点击的型号的信息 包括id
        // console.log(detail.id)
        // var itemId = util.deepClone(detail.id) - 1
        var itemId = detail.id
        const {
            activeId
        } = this.data;
        // const activeId = util.deepClone(that.data.activeId)
        // const activeId = that.data.activeId
        // console.log("navId is: " +navId)
        // console.log("itemId is: " + itemId)
        // console.log(detail)
        // console.log(this.data)
        // console.log(activeId)
        //detail.id为点击型号时获取的值 取消勾选时为当前的activeId要删掉的id值 勾选时为-1
        const index = activeId.indexOf(detail.id);
        // console.log(index)
        // console.log(detail.index)
        //取消型号勾选时index为activeId的要删掉的位置的值
        if (index > -1) {
            activeId.splice(index, 1);
            this.setData({
                activeId
            });
            for (var i = 0; i < this.data.items[navId].children.length; i++) {
                if (this.data.items[navId].children[i].id == itemId) {
                    // console.log(this.data.items[navId].children[i].id)
                    this.data.items[navId].children[i].selected = false
                }
            }
            //   this.data.items[navId].children[itemId].selected = false
            //勾选型号时index为-1
        } else {
            activeId.push(detail.id);
            this.setData({
                activeId
            });
            for (var i = 0; i < this.data.items[navId].children.length; i++) {
                if (this.data.items[navId].children[i].id == itemId) {
                    // console.log(this.data.items[navId].children[i].id)
                    this.data.items[navId].children[i].selected = true
                }
            }
            //   this.data.items[navId].children[itemId].selected = true
        }
        // console.log("主页面设置的activeId为:")
        // console.log(this.data.activeId)
        // console.log(this.data.mainActiveIndex)
    },

    //子传父函数用来取消确认品牌下拉菜单
    //思路:用items的children里的text(型号名)来与navArray的subArray里的model来对比
    //如果相同匹配就存入navArray.subArray 如果不同就存入navArray.subUselessBrandArr
    syncButtom1(e) {
        var that = this
        if (e.detail.value == 0) {
            this.selectComponent('#brand').toggle(false)
        } else if (e.detail.value == 1) {
            // var tempBrandArr = util.deepClone(that.data.navArray)
            // var tempUselessBrandArr = []
            //存放所有的被选中的型号
            var tempSelectedArr = []
            //存储品牌栏选中的型号到tempSelectArr
            for (var i = 0; i < that.data.items.length; i++) {
                for (var j = 0; j < that.data.items[i].children.length; j++) {
                    console.log(that.data.items[i].children[j])
                    if (that.data.items[i].children[j].selected == true) {
                        tempSelectedArr.push(that.data.items[i].children[j])
                    }
                }
            }
            //如果什么都没选 就直接退出
            if (tempSelectedArr.length == 0) {
                this.selectComponent('#brand').toggle(false)
            } else {

                // console.log(tempSelectedArr)
                //将上一次筛选的品牌废弃数组重新放回subArray用来筛选 并清空上次的废弃品牌数组
                for (var i = 0; i < that.data.navArray.length; i++) {
                    var tempSubArr = util.deepClone(that.data.navArray[i].subArray)
                    var tempSubUselessArr = util.deepClone(that.data.navArray[i].subUselessBrandArr)
                    //用来存放navArray.subArray对应的结果 也就是显示结果
                    var tempResultArr = []
                    if (tempSubUselessArr.length != 0) {
                        tempSubArr = tempSubArr.concat(tempSubUselessArr)
                        tempSubArr = that.checkConditionForFilter(tempSubArr)
                        tempSubUselessArr = []
                        that.data.navArray[i].subArray = util.deepClone(tempSubArr)
                        that.data.navArray[i].subUselessBrandArr = util.deepClone(tempSubUselessArr)
                    }
                    //存储navArray里每个subArray中 所勾选的型号的出现次数
                    var count = 0
                    for (var j = 0; j < that.data.navArray[i].subArray.length; j++) {
                        for (var k = 0; k < tempSelectedArr.length; k++) {
                            //如果找到了相同的就break 不然就continue
                            if (that.data.navArray[i].subArray[j].model == tempSelectedArr[k].text) {
                                break
                            }
                        }
                        // console.log("navArray: " + i + "subArray: " + j)
                        // console.log(k)
                        //当tempSubUselessArr长度不为0时 将tempSubArray作为非勾选型号存入navArray.subUselessBrandArr
                        //当答案出现在最后一位时
                        console.log(tempSelectedArr.length)
                        console.log(k)
                        if (k == tempSelectedArr.length && that.data.navArray[i].subArray[j].model == tempSelectedArr[k - 1].text) {
                            tempResultArr.push(that.data.navArray[i].subArray[j])
                            // tempSubUselessArr.push(tempSubArr.splice(j-count,1)[0])
                            tempSubArr.splice(j - count, 1)
                            count++
                            // console.log(tempSubArr)
                            //当答案出现在中间时
                        } else if (k < tempSelectedArr.length && that.data.navArray[i].subArray[j].model == tempSelectedArr[k].text) {
                            tempResultArr.push(that.data.navArray[i].subArray[j])
                            tempSubArr.splice(j - count, 1)
                            count++
                        }
                    }
                    //当tempResultArr长度为0时说明该navArray.subArray没有一个勾选的型号
                    //此时我们直接将subArray里面所有值全部放入subUselessBrandArr即可
                    if (tempResultArr.length == 0) {
                        tempSubUselessArr = tempSubUselessArr.concat(that.data.navArray[i].subArray)
                        console.log(tempSubUselessArr)
                        console.log(that.data.navArray[i].subArray)
                        that.setData({
                            ['navArray[' + i + '].subArray']: tempResultArr,
                            ['navArray[' + i + '].subUselessBrandArr']: tempSubUselessArr
                        })
                        //当tempResultArr长度不为0时 证明该navArray.subArray含有勾选项
                        //我们用写好的tempSubArr 来返回navArray.subUselessBrandArr
                    } else {
                        that.setData({
                            ['navArray[' + i + '].subArray']: tempResultArr,
                            ['navArray[' + i + '].subUselessBrandArr']: tempSubArr
                        })

                    }
                }
            }
            //收齐品牌栏
            this.selectComponent('#brand').toggle(false)
            //重新设置右侧布局
            this.setBlockHeight()
        }
    },

    //下拉菜单函数
    //下拉菜单第三栏函数
    //下拉菜单第三栏函数
    //下拉菜单第三栏函数

    //筛选条件 严格意义属于所有下拉菜单的函数
    //检查各个筛选条件 使屏幕上的数据按照要求显示
    checkConditionForFilter(tempSubArr) {
        var that = this
        if (that.data.value1 == 0) {
            tempSubArr = tempSubArr.sort(function (a, b) {
                return a.vehicleTypeId - b.vehicleTypeId
            })
        } else if (that.data.value1 == 1) {
            tempSubArr = tempSubArr.sort(function (a, b) {
                return a.feePerDay - b.feePerDay
            })
        } else if (that.data.value1 == 2) {
            tempSubArr = tempSubArr.sort(function (a, b) {
                return b.feePerDay - a.feePerDay
            })
        }
        return tempSubArr
    },
    //子传父函数用来取消确认价格下拉菜单
    //本函数的难点核心在于用deepClone完全隔绝data里的navArray
    //从而操作更简单 更方便
    syncButtom2(e) {
        var that = this
        if (e.detail.value == 0) {
            that.selectComponent('#price').toggle(false)
            //如果按确认 carBlock组件返回1
        } else if (e.detail.value == 1) {
            //在价格颜色按钮数组里面找到深色按钮 也就是选中按钮
            for (var i = 0; i < that.data.priceColorList.length; i++) {
                if (that.data.priceColorList[i] == '#012ea5') {
                    switch (i) {
                        //选中的是第一个
                        case 0:
                            //循环navArray
                            for (var j = 0; j < that.data.navArray.length; j++) {
                                //务必用deepClone打断shallowCopy 不然navArray的操作会映射到本地tempSubArr 以及tempUselessArr
                                var tempSubArr = util.deepClone(that.data.navArray[j].subArray)
                                var tempUselessArr = util.deepClone(that.data.navArray[j].subUselessArray)
                                //如果useless array的长度不为0 意味着之前筛选过navArray
                                if (tempUselessArr.length != 0) {
                                    //讲之前不符合要求的useless array放进subArray里面 重新筛选
                                    tempSubArr = tempSubArr.concat(tempUselessArr)
                                    //检查各种筛选条件
                                    tempSubArr = that.checkConditionForFilter(tempSubArr)
                                    //清空useless 数组
                                    tempUselessArr = []
                                    //务必deepClone 不然还会造成映射问题
                                    that.data.navArray[j].subArray = util.deepClone(tempSubArr)
                                    that.data.navArray[j].subUselessArray = util.deepClone(tempUselessArr)
                                }
                                //记录删减次数
                                var count = 0
                                //循环subArray
                                for (var k = 0; k < that.data.navArray[j].subArray.length; k++) {
                                    //如果不满足条件
                                    if (that.data.navArray[j].subArray[k].feePerDay < 0 || that.data.navArray[j].subArray[k].feePerDay > 150) {
                                        //添加进本地useless数组
                                        tempUselessArr.push(that.data.navArray[j].subArray[k])
                                        //删除本地subArray中的该位置的值
                                        //k-count代表 当前数组位置-之前删减的次数
                                        tempSubArr.splice(k - count, 1)
                                        //删减次数++
                                        count++
                                    }
                                }
                                //设置数据
                                that.setData({
                                    ['navArray[' + j + '].subArray']: tempSubArr,
                                    ['navArray[' + j + '].subUselessArray']: tempUselessArr
                                })
                                // console.log(that.data.navArray[j])
                            }
                            break;
                        case 1:
                            // console.log(that.data.navArray)
                            for (var j = 0; j < that.data.navArray.length; j++) {
                                var tempSubArr = util.deepClone(that.data.navArray[j].subArray)
                                var tempUselessArr = util.deepClone(that.data.navArray[j].subUselessArray)
                                if (tempUselessArr.length != 0) {
                                    tempSubArr = tempSubArr.concat(tempUselessArr)
                                    //检查各种筛选条件
                                    tempSubArr = that.checkConditionForFilter(tempSubArr)
                                    tempUselessArr = []
                                    that.data.navArray[j].subArray = util.deepClone(tempSubArr)
                                    that.data.navArray[j].subUselessArray = util.deepClone(tempUselessArr)
                                }
                                var count = 0
                                for (var k = 0; k < that.data.navArray[j].subArray.length; k++) {
                                    if (that.data.navArray[j].subArray[k].feePerDay < 150 || that.data.navArray[j].subArray[k].feePerDay > 250) {
                                        tempUselessArr.push(that.data.navArray[j].subArray[k])
                                        tempSubArr.splice(k - count, 1)
                                        count++
                                    }
                                }
                                that.setData({
                                    ['navArray[' + j + '].subArray']: tempSubArr,
                                    ['navArray[' + j + '].subUselessArray']: tempUselessArr
                                })
                                // console.log(that.data.navArray[j])
                            }
                            console.log(that.data.navArray)
                            break;
                        case 2:
                            for (var j = 0; j < that.data.navArray.length; j++) {
                                var tempSubArr = util.deepClone(that.data.navArray[j].subArray)
                                var tempUselessArr = util.deepClone(that.data.navArray[j].subUselessArray)
                                if (tempUselessArr.length != 0) {
                                    tempSubArr = tempSubArr.concat(tempUselessArr)
                                    //检查各种筛选条件
                                    tempSubArr = that.checkConditionForFilter(tempSubArr)
                                    tempUselessArr = []
                                    that.data.navArray[j].subArray = util.deepClone(tempSubArr)
                                    that.data.navArray[j].subUselessArray = util.deepClone(tempUselessArr)
                                }
                                var count = 0
                                for (var k = 0; k < that.data.navArray[j].subArray.length; k++) {
                                    if (that.data.navArray[j].subArray[k].feePerDay < 250 || that.data.navArray[j].subArray[k].feePerDay > 350) {
                                        tempUselessArr.push(that.data.navArray[j].subArray[k])
                                        tempSubArr.splice(k - count, 1)
                                        count++
                                    }
                                }
                                that.setData({
                                    ['navArray[' + j + '].subArray']: tempSubArr,
                                    ['navArray[' + j + '].subUselessArray']: tempUselessArr
                                })
                                // console.log(that.data.navArray[j])
                            }
                            console.log(that.data.navArray)
                            break;
                        case 3:
                            for (var j = 0; j < that.data.navArray.length; j++) {
                                var tempSubArr = util.deepClone(that.data.navArray[j].subArray)
                                var tempUselessArr = util.deepClone(that.data.navArray[j].subUselessArray)
                                if (tempUselessArr.length != 0) {
                                    tempSubArr = tempSubArr.concat(tempUselessArr)
                                    //检查各种筛选条件
                                    tempSubArr = that.checkConditionForFilter(tempSubArr)
                                    tempUselessArr = []
                                    that.data.navArray[j].subArray = util.deepClone(tempSubArr)
                                    that.data.navArray[j].subUselessArray = util.deepClone(tempUselessArr)
                                }
                                var count = 0
                                for (var k = 0; k < that.data.navArray[j].subArray.length; k++) {
                                    if (that.data.navArray[j].subArray[k].feePerDay < 350) {
                                        // var tempUselessArray = util.deepClone(that.data.navArray[j].subUselessArray)
                                        tempUselessArr.push(that.data.navArray[j].subArray[k])
                                        tempSubArr.splice(k - count, 1)
                                        count++
                                    }
                                }
                                that.setData({
                                    ['navArray[' + j + '].subArray']: tempSubArr,
                                    ['navArray[' + j + '].subUselessArray']: tempUselessArr
                                })
                                // console.log(that.data.navArray[j])
                            }
                            console.log(that.data.navArray)
                            break;
                        default:
                            for (var j = 0; j < that.data.navArray.length; j++) {
                                var tempSubArr = util.deepClone(that.data.navArray[j].subArray)
                                var tempUselessArr = util.deepClone(that.data.navArray[j].subUselessArray)
                                if (tempUselessArr.length != 0) {
                                    tempSubArr = tempSubArr.concat(tempUselessArr)
                                    //检查各种筛选条件
                                    tempSubArr = that.checkConditionForFilter(tempSubArr)
                                    tempUselessArr = []
                                    tempSubArr = tempSubArr.sort(function (a, b) {
                                        return a.vehicleTypeId - b.vehicleTypeId
                                    })
                                    that.setData({
                                        ['navArray[' + j + '].subArray']: tempSubArr,
                                        ['navArray[' + j + '].subUselessArray']: tempUselessArr
                                    })
                                    // that.data.navArray[j].subArray = tempSubArr
                                    // that.data.navArray[j].subUselessArray = tempUselessArr
                                }
                                console.log(that.data.navArray[j].subArray)
                                console.log(that.data.navArray[j].subUselessArray)
                                console.log(that.data.navArray[j])
                                console.log(that.data.navArray)
                            }
                            console.log(that.data.navArray)
                            break;
                    }
                }
            }
            //重新设置右侧布局
            this.setBlockHeight()


            that.selectComponent('#price').toggle(false)
        }
    },

    //改变价格按钮颜色的函数
    onClickButton1(e) {
        var that = this
        //e传的dataset参数里的colorid全部是小写
        console.log(e.currentTarget.dataset.colorid);
        var colorId = e.currentTarget.dataset.colorid;
        var shallowColorId;
        //检测是否有深颜色选中项 如果有并且与这次选择项不同
        //我们将它变为浅色未选中状态
        //如果有并且与这次选项相同 也将其转为浅色
        for (let index = 0; index < that.data.priceColorList.length; index++) {
            const element = that.data.priceColorList[index];
            if (element == '#012ea5' && index != colorId) {
                shallowColorId = index;
            }
            // else if(element == '#012ea5' && index == colorId){
            //     shallowColorId = index;
            // }
        }
        //如果第一次进入这个选择题
        //那么所有选项皆为浅色未选中样式 此时我们不需要修改之前的深色选中项 因为其还没出现
        if (shallowColorId == undefined) {
            that.setData({
                ['priceColorList[' + colorId + ']']: '#012ea5',
            })
        } else {
            //假如第二次或以后进入那么我们将之前的选中项变浅 将现在的选中项变深
            that.setData({
                ['priceColorList[' + colorId + ']']: '#012ea5',
                ['priceColorList[' + shallowColorId + ']']: '#4d6cc2',
            })
        }
        //颜色改变完毕 接下来为处理价格区间的函数
        //当选中的

    },


    //下拉菜单第四栏函数
    //下拉菜单第四栏函数
    //下拉菜单第四栏函数

    //子传父函数用来取消确认更多下拉菜单
    //包含搜寻各种配置的功能
    syncButtom3(e) {
        var that = this
        //取消键 直接关闭
        if (e.detail.value == 0) {
            this.selectComponent('#more').toggle(false)
            //确认键 
        } else if (e.detail.value == 1) {
            //config实例
            var config = {
                isCamera: false,
                isSunroof: false,
                isLeather: false
            }
            //车辆配置是否有选择的值
            var isConfigEntered = true
            var power
            var isPowerEntered = true
            var seats
            var isSeatsEntered = true
            var gear
            var isGearEntered = true
            var compartment
            var isCompartmentEntered = true
            var series
            var isSeriesEntered = true
            //设置车辆配置 将汽车配置转化为与后端契合的值 方便判断
            //车辆配置只取前三个 因为ETC等可以随意调配 不用筛选
            for (var i = 0; i < that.data.configColorList.length; i++) {
                if (that.data.configColorList[i] == '#012ea5' && i == 0) {
                    config.isCamera = true
                }
                if (that.data.configColorList[i] == '#012ea5' && i == 1) {
                    config.isSunroof = true
                }
                if (that.data.configColorList[i] == '#012ea5' && i == 2) {
                    config.isLeather = true
                }
            }
            //如果三个全部为false代表我们没有输入配置相关的需要 所以设置isConfigEntered为false
            if (config.isCamera == false && config.isLeather == false && config.isSunroof == false) {
                isConfigEntered = false
            }

            //设置动力配置 将动力配置转化为与后端数据契合的格式
            for (var i = 0; i < that.data.powerColorList.length; i++) {
                if (that.data.powerColorList[i] == '#012ea5' && i == 0) {
                    power = "油车"
                } else if (that.data.powerColorList[i] == '#012ea5' && i == 1) {
                    power = "混合动力"
                } else if (that.data.powerColorList[i] == '#012ea5' && i == 2) {
                    power = "电车"
                }
            }
            //动力没有值时 为false
            if (power == undefined) {
                isPowerEntered = false
            }
            //设置座位配置 将座位配置设置为与后端数据格式契合的格式
            for (var i = 0; i < that.data.seatColorList.length; i++) {
                if (that.data.seatColorList[i] == '#012ea5' && i == 0) {
                    seats = 4
                } else if (that.data.seatColorList[i] == '#012ea5' && i == 1) {
                    seats = 5
                }
            }
            //座位没有输入时
            if (seats == undefined) {
                isSeatsEntered = false
            }
            //设置档位配置 将该档位配置与后端数据的格式匹配
            for (var i = 0; i < that.data.gearColorList.length; i++) {
                if (that.data.gearColorList[i] == '#012ea5' && i == 0) {
                    gear = "自动挡"
                } else if (that.data.gearColorList[i] == '#012ea5' && i == 1) {
                    gear = "手动挡"
                }
            }
            //档位没有输入
            if (gear == undefined) {
                isGearEntered = false
            }
            //设置厢数配置 将该厢数配置与后端数据格式匹配
            for (var i = 0; i < that.data.compartmentColorList.length; i++) {
                if (that.data.compartmentColorList[i] == '#012ea5' && i == 0) {
                    compartment = "两厢"
                } else if (that.data.compartmentColorList[i] == '#012ea5' && i == 1) {
                    compartment = "三厢"
                }
            }
            //如果厢数没有输入
            if (compartment == undefined) {
                isCompartmentEntered = false
            }
            //设置车系配置 将该车系配置
            for (var i = 0; i < that.data.seriesColorList.length; i++) {
                if (that.data.seriesColorList[i] == '#012ea5' && i == 0) {
                    series = "国产"
                } else if (that.data.seriesColorList[i] == '#012ea5' && i == 1) {
                    series = "日系"
                } else if (that.data.seriesColorList[i] == '#012ea5' && i == 2) {
                    series = "德系"
                } else if (that.data.seriesColorList[i] == '#012ea5' && i == 3) {
                    series = "韩系"
                }
            }
            if (series == undefined) {
                isSeriesEntered = false
            }

            //如果所有选项全部为空 那么直接返回所有车辆类型数据
            if (
                config.isCamera == false &&
                config.isSunroof == false &&
                config.isLeather == false &&
                power == undefined &&
                seats == undefined &&
                gear == undefined &&
                compartment == undefined &&
                series == undefined) {
               
                // subArr = that.checkConditionForFilter(subArr)
                var subConfigArr = []
                for (var i = 0; i < that.data.navArray.length; i++) {
                    // that.data.navArray[i].subArray = util.deepClone(subArr)
                    that.data.navArray[i].subArray = that.data.navArray[i].subArray.concat(that.data.navArray[i].subUselessConfigArr)
                    that.data.navArray[i].subArray = that.checkConditionForFilter(that.data.navArray[i].subArray)
                    that.data.navArray[i].subUselessConfigArr = subConfigArr
                }
                that.setBlockHeight()
                that.selectComponent('#more').toggle(false)
                //如果有输入的数据
            } else {
                //先循环外层navArray
                for (var i = 0; i < that.data.navArray.length; i++) {
                    var subArr = util.deepClone(that.data.navArray[i].subArray)
                    var subConfigArr = util.deepClone(that.data.navArray[i].subUselessConfigArr)
                    var subResultArr = []
                    //将上次的无用数据放回subArray
                    if (subConfigArr.length != 0) {
                        subArr = subArr.concat(subConfigArr)
                        subArr = that.checkConditionForFilter(subArr)
                        subConfigArr = []
                        that.data.navArray[i].subArray = util.deepClone(subArr)
                        that.data.navArray[i].subUselessConfigArr = util.deepClone(subConfigArr)
                    }
                    //循环内层navArray[i].subArray
                    for (var j = 0; j < subArr.length; j++) {
                        //通过三元表达式 我们可以将没有任何输入的配置类型(档位...)
                        //设置为true 这样可以使&&连接起来更顺畅
                        console.log(j)
                        console.log("车辆"+j+"倒车影像"+subArr[j].isCamera)
                        console.log("车辆"+j+"天窗"+subArr[j].isSunroof)
                        console.log("车辆"+j+"皮革"+subArr[j].isLeather) 
                        console.log(config.isCamera)
                        console.log(config.isSunroof)
                        console.log(config.isLeather)
                        if ((isConfigEntered ? (config.isCamera == subArr[j].isCamera &&
                            config.isSunroof == subArr[j].isSunroof &&
                            config.isLeather == subArr[j].isLeather) : true) &&
                            (isPowerEntered ? power == subArr[j].power : true) &&
                            (isSeatsEntered ? seats == subArr[j].seats : true) &&
                            (isGearEntered ? gear == subArr[j].isAuto : true) &&
                            (isCompartmentEntered ? compartment == subArr[j].boxes : true) &&
                            (isSeriesEntered ? series == subArr[j].nation : true)) {
                            subResultArr.push(subArr[j])
                            // console.log(111111)
                        } else {
                            subConfigArr.push(subArr[j])
                            // console.log(22222)
                        }
                    }
                    // console.log(subResultArr)
                    // console.log(subConfigArr)
                    that.setData({
                        ['navArray[' + i + '].subArray']: subResultArr,
                        ['navArray[' + i + '].subUselessConfigArr']: subConfigArr
                    })
                    // that.data.navArray[i].subArray = util.deepClone(subResultArr)
                    // that.data.navArray[i].subUselessConfigArr = util.deepClone(subConfigArr)
                    that.selectComponent('#more').toggle(false)
                }
                that.setBlockHeight()
            }
        }
    },
    //车辆配置按钮设置
    onClickButton2(e) {
        //e传的dataset参数里的colorid全部是小写
        console.log(e.currentTarget.dataset.colorid);
        var colorId = e.currentTarget.dataset.colorid;
        var shallowColorId;
        //检测是否有深颜色选中项 如果有并且与这次选择项不同
        //我们将它变为浅色未选中状态
        //如果有并且与这次选项相同 也将其转为浅色
        for (let index = 0; index < this.data.configColorList.length; index++) {
            const element = this.data.configColorList[index];
            // if(element == '#012ea5' && index!= colorId){
            //     shallowColorId = index;
            // }else 
            if (element == '#012ea5' && index == colorId) {
                shallowColorId = index;
            }
        }
        //如果第一次进入这个选择题
        //那么所有选项皆为浅色未选中样式 此时我们不需要修改之前的深色选中项 因为气还没出现
        if (shallowColorId == undefined) {
            this.setData({
                ['configColorList[' + colorId + ']']: '#012ea5',
            })
        } else {
            //假如第二次或以后进入那么我们将之前的选中项变浅 将现在的选中项变深
            this.setData({
                ['configColorList[' + colorId + ']']: '#012ea5',
                ['configColorList[' + shallowColorId + ']']: '#4d6cc2',
            })
        }
    },

    //动力类型按钮设置
    onClickButton3(e) {
        //e传的dataset参数里的colorid全部是小写
        console.log(e.currentTarget.dataset.colorid);
        var colorId = e.currentTarget.dataset.colorid;
        var shallowColorId;
        //检测是否有深颜色选中项 如果有并且与这次选择项不同
        //我们将它变为浅色未选中状态
        //如果有并且与这次选项相同 也将其转为浅色
        for (let index = 0; index < this.data.powerColorList.length; index++) {
            const element = this.data.powerColorList[index];
            if (element == '#012ea5' && index != colorId) {
                shallowColorId = index;
            } else
                if (element == '#012ea5' && index == colorId) {
                    shallowColorId = index;
                }
        }
        //如果第一次进入这个选择题
        //那么所有选项皆为浅色未选中样式 此时我们不需要修改之前的深色选中项 因为气还没出现
        if (shallowColorId == undefined) {
            this.setData({
                ['powerColorList[' + colorId + ']']: '#012ea5',
            })
        } else {
            //假如第二次或以后进入那么我们将之前的选中项变浅 将现在的选中项变深
            this.setData({
                ['powerColorList[' + colorId + ']']: '#012ea5',
                ['powerColorList[' + shallowColorId + ']']: '#4d6cc2',
            })
        }
    },
    //座位按钮设置
    onClickButton4(e) {
        //e传的dataset参数里的colorid全部是小写
        console.log(e.currentTarget.dataset.colorid);
        var colorId = e.currentTarget.dataset.colorid;
        var shallowColorId;
        //检测是否有深颜色选中项 如果有并且与这次选择项不同
        //我们将它变为浅色未选中状态
        //如果有并且与这次选项相同 也将其转为浅色
        for (let index = 0; index < this.data.seatColorList.length; index++) {
            const element = this.data.seatColorList[index];
            if (element == '#012ea5' && index != colorId) {
                shallowColorId = index;
            } else
                if (element == '#012ea5' && index == colorId) {
                    shallowColorId = index;
                }
        }
        //如果第一次进入这个选择题
        //那么所有选项皆为浅色未选中样式 此时我们不需要修改之前的深色选中项 因为气还没出现
        if (shallowColorId == undefined) {
            this.setData({
                ['seatColorList[' + colorId + ']']: '#012ea5',
            })
        } else {
            //假如第二次或以后进入那么我们将之前的选中项变浅 将现在的选中项变深
            this.setData({
                ['seatColorList[' + colorId + ']']: '#012ea5',
                ['seatColorList[' + shallowColorId + ']']: '#4d6cc2',
            })
        }
    },

    //档位按钮设置
    onClickButton5(e) {
        //e传的dataset参数里的colorid全部是小写
        // console.log(e.currentTarget.dataset.colorid);
        var colorId = e.currentTarget.dataset.colorid;
        var shallowColorId;
        //检测是否有深颜色选中项 如果有并且与这次选择项不同
        //我们将它变为浅色未选中状态
        //如果有并且与这次选项相同 也将其转为浅色
        for (let index = 0; index < this.data.gearColorList.length; index++) {
            const element = this.data.gearColorList[index];
            if (element == '#012ea5' && index != colorId) {
                shallowColorId = index;
            } else
                if (element == '#012ea5' && index == colorId) {
                    shallowColorId = index;
                }
        }
        //如果第一次进入这个选择题
        //那么所有选项皆为浅色未选中样式 此时我们不需要修改之前的深色选中项 因为气还没出现
        if (shallowColorId == undefined) {
            this.setData({
                ['gearColorList[' + colorId + ']']: '#012ea5',
            })
        } else {
            //假如第二次或以后进入那么我们将之前的选中项变浅 将现在的选中项变深
            this.setData({
                ['gearColorList[' + colorId + ']']: '#012ea5',
                ['gearColorList[' + shallowColorId + ']']: '#4d6cc2',
            })
        }
    },

    //厢数按钮设置
    onClickButton6(e) {
        //e传的dataset参数里的colorid全部是小写
        // console.log(e.currentTarget.dataset.colorid);
        var colorId = e.currentTarget.dataset.colorid;
        var shallowColorId;
        //检测是否有深颜色选中项 如果有并且与这次选择项不同
        //我们将它变为浅色未选中状态
        //如果有并且与这次选项相同 也将其转为浅色
        for (let index = 0; index < this.data.compartmentColorList.length; index++) {
            const element = this.data.compartmentColorList[index];
            if (element == '#012ea5' && index != colorId) {
                shallowColorId = index;
            } else
                if (element == '#012ea5' && index == colorId) {
                    shallowColorId = index;
                }
        }
        //如果第一次进入这个选择题
        //那么所有选项皆为浅色未选中样式 此时我们不需要修改之前的深色选中项 因为气还没出现
        if (shallowColorId == undefined) {
            this.setData({
                ['compartmentColorList[' + colorId + ']']: '#012ea5',
            })
        } else {
            //假如第二次或以后进入那么我们将之前的选中项变浅 将现在的选中项变深
            this.setData({
                ['compartmentColorList[' + colorId + ']']: '#012ea5',
                ['compartmentColorList[' + shallowColorId + ']']: '#4d6cc2',
            })
        }
    },

    //车系按钮设置
    onClickButton7(e) {
        //e传的dataset参数里的colorid全部是小写
        // console.log(e.currentTarget.dataset.colorid);
        var colorId = e.currentTarget.dataset.colorid;
        var shallowColorId;
        //检测是否有深颜色选中项 如果有并且与这次选择项不同
        //我们将它变为浅色未选中状态
        //如果有并且与这次选项相同 也将其转为浅色
        for (let index = 0; index < this.data.seriesColorList.length; index++) {
            const element = this.data.seriesColorList[index];
            if (element == '#012ea5' && index != colorId) {
                shallowColorId = index;
            } else
                if (element == '#012ea5' && index == colorId) {
                    shallowColorId = index;
                }
        }
        //如果第一次进入这个选择题
        //那么所有选项皆为浅色未选中样式 此时我们不需要修改之前的深色选中项 因为气还没出现
        if (shallowColorId == undefined) {
            this.setData({
                ['seriesColorList[' + colorId + ']']: '#012ea5',
            })
        } else {
            //假如第二次或以后进入那么我们将之前的选中项变浅 将现在的选中项变深
            this.setData({
                ['seriesColorList[' + colorId + ']']: '#012ea5',
                ['seriesColorList[' + shallowColorId + ']']: '#4d6cc2',
            })
        }
    },



    //右侧scroll view函数
    //右侧scroll view函数
    //右侧scroll view函数
    //计算Scroll应有的高度
    setScrollHeight() {
        var that = this;
        // console.log(that)
        //获取页面的宽度和高度
        //因为getSystemInfoSync获取的是px为单位的长和宽
        //所以我们用公式将其转为rpx格式
        var windowWidth = wx.getSystemInfoSync().windowWidth;
        var windowHeight = wx.getSystemInfoSync().windowHeight;
        var ratio = 750 / windowWidth;
        var windowHeight = windowHeight * ratio;

        //获取id="row" 和id = "dropDown"的组件的高度 在当前也就是van-row的高度
        var query = wx.createSelectorQuery().in(this);
        query.select('#row').boundingClientRect()
        query.select('#dropDown').boundingClientRect()
        query.exec(res => {
            let rowHeight = res[0].height
            let dropDownHeight = res[1].height
            let scrollH = windowHeight - rowHeight * ratio - dropDownHeight * ratio
            that.setData({
                scrollHeight: scrollH
            })
        })

    },
    //设置右侧每个展示block的高度
    //从网上当的代码 大概意思为通过map函数将
    //原有的res[0]里面的数组转化为block高度的数组
    setBlockHeight() {
        let that = this;
        let initArr = [0];
        let initNum = 0;
        // setTimeout(()=>
        // {
        const query = wx.createSelectorQuery()
        query.selectAll('.rightblock').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function (res) {
            res[0].map(val => {
                initNum += val.height;
                initArr.push(initNum);
            })
            // console.log(initArr)
            that.setData({
                heightArr: initArr
            })
        })
        // }, 5000)
    },
    //设置右侧滑动对应左侧的nav的值
    rightScroll(e) {
        //scrollTop为距离顶端的距离
        let st = e.detail.scrollTop;
        let myarr = this.data.heightArr;
        for (let i = 0; i < myarr.length; i++) {
            if (st >= myarr[i] && st < myarr[i + 1] - 20) {
                this.setData({
                    leftId: "left" + i,
                    navIndex: i
                })
                // console.log(this.data.leftId)
                return;
            }
        }

    },
    //左侧scroll view函数
    //左侧scroll view函数
    //左侧scroll view函数
    //点击左侧导航函数
    clickNav(e) {
        this.setData({
            navIndex: e.target.dataset.id,
            leftId: "left" + e.target.dataset.id,
            rightId: "right" + e.target.dataset.id,
        })
        //    console.log(e.target.dataset)
        //    console.log(this.data.rightId)
    },



    //获取后端车辆数据
    //获取后端车辆数据
    //获取后端车辆数据
    async promisfyFetchVehicles() {
        var that = this;
        await promise.wxRequest({
            url: '/vehicle/getAllType',
            method: "GET",
            header: {
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                //将指向同一内存位置的浅拷贝 转为开辟新空间的深拷贝
                //原理：拷贝一个字符串会新辟一个新的存储地址，这样就切断了引用对象的指针联系，所以先转成一个字符串，在解析出对象，这样就可以深拷贝一个对象，换句话说其实就是新开辟个区域，所指向的指针也随之改变成新的指针。
                that.data.vehicleTypeArr = util.deepClone(res.data);
                // console.log(res.data)
                console.log(that.data.vehicleTypeArr)
                var tempVehicleTypeArr = util.deepClone(that.data.vehicleTypeArr)
                var res = that.convertBackEndData(tempVehicleTypeArr)
                that.insertBackEndDataIntoPage(res)
                console.log(that.data.navArray)
                // console.log(that.data.navArray)
                // setTimeout(()=>{
                //将品牌数据整理分类
                that.handleBrandData()
                that.reorderBrand()

                //将品牌图片地址拼接 并发送请求图片
                that.getImages()
                console.log(that.data.navArray)
                // },2000)
                // that.handleBrandData()
            }).catch(fail => {

            })
    },


    //将后端获取的车辆数据转化为可展示数据
    //将后端获取的车辆数据转化为可展示数据
    convertBackEndData(arr) {
        for (let i = 0; i < arr.length; i++) {
            // arr[i].feePerDay =  arr[i].feePerDay+ "元/天";  
            // arr[i].seats =  arr[i].seats+"座";
            // this.data.vehicleTypeArr[i].feePerDay = this.data.vehicleTypeArr[i].feePerDay+ "元/天";
            if (arr[i].isAuto == true) {
                arr[i].isAuto = "自动挡"
            } else {
                arr[i].isAuto = "手动挡"
            }
            if (arr[i].displacement == null) {
                arr[i].displacement = "";
            }
        }
        return arr
    },
    //将从后端获取的车辆类型数据 按照车辆风格相同的方式(商务型...)存进navArray
    //将从后端获取的车辆类型数据 按照车辆风格相同的方式(商务型...)存进navArray
    insertBackEndDataIntoPage(tempVehicleTypeArr) {
        // console.log(tempVehicleTypeArr)
        var that = this
        // var tempVehicleTypeArr = util.deepClone(that.data.vehicleTypeArr)
        // tempVehicleTypeArr = that.convertBackEndData(tempVehicleTypeArr)
        for (let i = 0; i < that.data.navArray.length; i++) {
            for (let j = 0; j < tempVehicleTypeArr.length; j++) {
                if (that.data.navArray[i].title == tempVehicleTypeArr[j].style) {
                    var vehicleTypeObj = tempVehicleTypeArr[j]
                    // console.log(i)
                    var tempSubArray = that.data.navArray[i].subArray
                    //用concat不用push是因为push返回连接后的数组长度
                    tempSubArray = tempSubArray.concat(vehicleTypeObj)
                    //这里必须要用setData因为 setData上有监听器 scrollview高度设置需要监听这里的数据改变
                    // this.data.navArray[i].subArray.push(this.data.vehicleTypeArr[j]);
                    //如果用上面这行代码的话 wx.createSelectorQuery()监听不到这些数据的设置 所以无法设置每个carBlock的height
                    that.setData({
                        ['navArray[' + i + '].subArray']: tempSubArray
                    })
                    // this.data.navArray[i].subArray.push(vehicleTypeObj);
                }
            }
        }
        console.log(that.data.navArray)
    },
    //整理汽车品牌的图片地址 并发送请求图片
    //暂时没用到因为测试用的是../../image/ 格式 而不是http:\\这样的格式
    async getImages() {
        var that = this
        //循环navArray和subArray来获取所有的后端汽车图片
        for (var i = 0; i < that.data.navArray.length; i++) {
            var subArr = util.deepClone(that.data.navArray[i].subArray)
            for (var j = 0; j < subArr.length; j++) {
                try{
                    await promise.wxRequest({
                        url:'/img/carBlock/'+subArr[j].imageName+'/',
                        responseType: 'arraybuffer',
                    }).then(res=>{
                        console.log(res)
                        let img = 'data:image/png;base64,' + wx.arrayBufferToBase64(res.data)
                        that.setData({
                            ['navArray[' + i + '].subArray['+j+'].img']:img
                            // 'navArray[i].subArray[j].url':img
                        })
                    }).catch(err=>{

                    })
                }catch(err){

                }
                
            }
            // console.log(that.data.navArray[i].subArray)
        }
    },

    //导航到review界面 并将当前车型传递给review界面
    navigateToLogin(e) {
        var that = this
        //必须确定车辆未租满 才跳转
        if (e.currentTarget.dataset.vehicle.isFull == false) {
            console.log(e.currentTarget.dataset.vehicle)
            app.globalData.vehicle = e.currentTarget.dataset.vehicle
            app.globalData.total = app.globalData.dayInBetween * e.currentTarget.dataset.vehicle.feePerDay
            console.log(app.globalData.vehicle)
            console.log(app.globalData.timeCurrent)
            console.log(app.globalData.timeEnd)
            //设置行车记录仪 ETC 手机支架 雨伞
            if(that.data.configColorList[3] == '#012ea5'){
                app.isRecorder = true
            }else{
                app.isRecorder = false
            }

            if(that.data.configColorList[4] == '#012ea5'){
                app.isETC = true
            }else{
                app.isETC = false
            }

            if(that.data.configColorList[5] == '#012ea5'){
                app.isMount = true
            }else{
                app.isMount = false
            }

            if(that.data.configColorList[6] == '#012ea5'){
                app.isUmbrella = true
            }else{
                app.isUmbrella = false
            }
            console.log(app.isRecorder)
            console.log(app.isETC)
            console.log(app.isMount)
            console.log(app.isUmbrella)

            console.log(app.globalData.vehicle)
            console.log(app.globalData.total)
            console.log(app.globalData.isLoggedIn)
            //通过微信登录态 来判断是否需要登录
            wx.checkSession({
                //session_key未过期 无需登录
                success: (res) => {
                    if (app.globalData.accessToken == '') {
                        wx.navigateTo({
                            url: '../login/login',
                        })
                        app.globalData.fromAccount = 2
                    } else {
                        wx.navigateTo({
                            url: '../review/review',
                        })
                    }
                },
                //session_key已过期 再登录
                fail: (res) => {
                    wx.navigateTo({
                        url: '../login/login',
                    })
                    app.globalData.fromAccount = 2
                }
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // this.test();
        this.promisfyFetchVehicles();
        const child2 = this.selectComponent('#selectTimeComponent')
        child2.setData({
            timeCurrent: app.globalData.timeCurrent,
            timeEnd: app.globalData.timeEnd,
            yearCurrent: app.globalData.yearCurrent,
            yearEnd: app.globalData.yearEnd,
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
            dayInBetween: app.globalData.dayInBetween,
            locations: app.globalData.locations.value,
            pickUpLocation: app.globalData.locations.value[0],
            dropOffLocation: app.globalData.locations.value[0]
        })
        this.setData({
            //locations应为Array类型 但现在暂且用不上 到需要的时候再修改
            locations: app.globalData.locations.value,
            timeCurrent: app.globalData.timeCurrent,
            timeEnd: app.globalData.timeEnd,
            dayInBetween: app.globalData.dayInBetween,
            pickUpLocation: app.globalData.locations.value[0],
            dropOffLocation: app.globalData.locations.value[0],
            show: false,
            // scrollHeight:windowHeight-rowHeight-dropDownHeight,
        })
        console.log(this.data.navArray)
        // console.log(this.data.timeCurrent)
        // console.log(app.globalData.timeCurrent)
        // console.log(this.data.locations)

        // console.log(this.data.rowHeight)
        // console.log(this.data.pageHeight)
        // let pageStack = getCurrentPages()
        // console.log(pageStack)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        //在onReady里面调用是因为
        //selectorQuery只能在页面布局完成时调用
        //此时可以调用节点信息
        // setTimeout(()=>
        // {
        this.setScrollHeight()
        this.setBlockHeight()
        // },2000)
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // console.log(this.data.scrollHeight)
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