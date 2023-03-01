// components/carBlock.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        blockArr:{type:Array,value:[]},
        // navIndex:{type:Number,value:0}
        navIndex:Number
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {

    },
    lifetimes:{
        created(){
            console.log(this.properties.navIndex);
        },
        attached(){
            console.log(this.properties.navIndex);
        },
        ready(){
            console.log(this.properties.navIndex);
        }
    },
    pageLifetimes:{
        show(){
            console.log(this.properties.navIndex)
        }
    },
    options:{
        // styleIsolation:"shared",
        styleIsolation:"apply-shared"
    }
})
