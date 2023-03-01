// components/confirmButton.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        //1为确定键 0为取消键
        confirm:0,
        
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
        onClickCancel(){
            this.setData({
                confirm:0
            })
            this.triggerEvent('sync',{value:this.properties.confirm})
        },
        onClickConfirm(){
            this.setData({
                confirm:1
            })
            this.triggerEvent('sync',{value:this.properties.confirm})
        }
    }
})
