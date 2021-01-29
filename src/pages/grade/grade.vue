<template>

    <view class="qr-content" >
        <view class="qr-noGrade" :style="{height: scrollerHeight}" v-if="isNoGradeShow">
            <view>
                <image src="~@/static/picture/noGrade.png" mode="scaleToFill" style="width: 500rpx"></image>
            </view>
            <view style=" font-size: 40rpx;">
                暂未加入班级,请先添加
            </view>

        </view>

        <view class="qr-body" v-for="grade,index in grades" v-else :key="index">
            <view class="qr-body-a">
                <view class="qr-icon">
                    &#xe608;
                </view>
                <view class="qr-gradeInfo">
                    <view class="qr-classGrade">{{grade.classGradeName}}</view>
                    <view style="color: antiquewhite">{{grade.studetName}}:{{grade.say}}</view>
                </view>
            </view>
        </view>
        <view>
            <uni-fab
                    ref="fab"
                    :pattern="pattern"
                    :content="content"
                    horizontal="right"
                    vertical="bottom"
                    direction="vertical"
                    @trigger="trigger"
            ></uni-fab>
        </view>

        <pop ref="pop" :direction="direction" :is_close="true" :is_mask="true" :width="100" @closePop="closePop">
            <view v-for="classGrade,index in notClassGrades" :key="index" class="qr_pop">
                <view class="qr_pop_row">
                    <view class="qr-classGrade">{{classGrade.classGradeName}}</view>
                    <view style="color:cadetblue" @tap="doAddClassGrade(classGrade.id)">
                        +
                    </view>
                </view>
            </view>
        </pop>

        <pop ref="newpop" direction="center" :is_close="true" :is_mask="true" :mask_close="false" :width="100">
            <view class="qr_pop">
                <form @submit="addNewClassGrade" >
                    <view class="uni-form-item uni-column">
                        <view class="title">班级名</view>
                        <input class="uni-input" name="classGradeName" placeholder="请输入班级名称" />
                    </view>
                    <view class="uni-btn-v">
                        <button form-type="submit">添加</button>
                    </view>
                </form>
            </view>
        </pop>

    </view>
</template>

<script>
    import {http, DLStorage, Toast} from "@/util/httpUtil.js"
    import uniFab from '@/components/uni-fab/uni-fab.vue';
    import pop from "@/components/ming-pop/ming-pop.vue"
    export default {
        data() {
            return {
                pattern:{
                    // color:'blue',
                    buttonColor:'#0A98D5',
                    selectedColor:'red'
                },
                direction: "left",
                content:[],
                grades: [/*{
                    classGradeId: 0,
                    classGradeName: "2020级计算机一班",
                    studetName:"XXX",
                    say:"ririr"
                },{
                    classGradeId: 0,
                    classGradeName: "2020级计算机一班",
                    studetName:"XXX",
                    say:"ririr"
                }*/],
                scrollerHeight:uni.getSystemInfoSync().screenHeight-44+"px",
                isNoGradeShow:false,
                userInfo:DLStorage.getCacheStorage(DLStorage.keyDataSet.userInfo),
                notClassGrades:[]
            }
        },
        onLoad() {
            this.getMyGrade();
            //填充fab悬浮按钮内容
            this.addContent();
        },
        onShow() {

        },
        methods: {
            addContent:function(){
                let self = this;
                let content=[{
                    text:"添加班级",
                    iconPath:"/static/icon/addGrades.png",
                    fun:function () {
                        self.addClassGrade()
                    }
                },{
                    text:"添加朋友",
                    iconPath:"/static/icon/addFirend.png",
                    fun:function () {
                        self.addFirend()
                    }
                },{
                    text:"扫一扫",
                    iconPath:"/static/icon/saomiao.png",
                    fun:function () {
                        self.saoyisao()
                    }
                }];
                //是老师增加 可新建班级
                if(this.userInfo.roleCode == 'QR_TEACHER'){
                    content.splice(0,0,{
                        text:"新建班级",
                        iconPath:"/static/icon/newCreate.png",
                        fun:function () {
                            self.newCreateClassGrade()
                        }
                    })
                }
                this.content=content;
            },
            getMyGrade:function () {
                this.isNoGradeShow = false;
                let config={
                    url:"/classGrade/getMyGrade"
                };
                http.Get(config,data=>{
                    if(data.code == this.$HTTP.SUCCESS){
                        this.grades =  data.data;
                    }
                    if(this.grades.length == 0){
                        this.isNoGradeShow = true
                    }
                })
            },
            //打开添加班级的弹窗
            addClassGrade:function () {
                //TODO 添加班级
                let config={
                    url:"/classGrade/getAllGrade"
                }
                http.Get(config,data=>{
                    if(data.code == this.$HTTP.SUCCESS){
                        this.notClassGrades = data.data;
                        //打开弹窗
                        this.$refs.pop.show();
                    }

                });

            },
            //添加班级
            doAddClassGrade:function(classGradeId){
               if(!classGradeId){
                   Toast("请选择班级")
               }
               let config={
                   url:"/classGrade/doAddClassGrade",
                   data:{
                       classGradeId:classGradeId
                   },
                   header:{
                       "content-type":'application/x-www-form-urlencoded'
                   }
               }
               http.Post(config,data=>{
                   if(data.code == this.$HTTP.SUCCESS){
                       let data_ = data.data;
                        if(data_.length == 0){
                            this.$refs.pop.close();
                        }else{
                            this.notClassGrades = data_;
                        }
                   }
               })
            },
            closePop:function(close){
                if(close){
                    //关闭弹窗调用查询
                    this.getMyGrade();
                }
            },
            newCreateClassGrade:function () {
                // TODO 新建班级

                this.$refs.newpop.show()

            },
            addNewClassGrade:function(e){
                var formdata = e.detail.value
                if(!formdata.classGradeName){
                    uni.showModal({
                        content: '请填写班级名称',
                        showCancel: false
                    })
                }
                let config={
                    url:"/classGrade/addNewClassGrade",
                    data:{
                        classGradeName:formdata.classGradeName
                    },
                    header:{
                        'content-type':'application/x-www-form-urlencoded'
                    }
                }
                http.Post(config,data=>{
                    if(data.code == this.$HTTP.SUCCESS){
                        this.$refs.newpop.close()
                    }
                });
            },
            addFirend:function(){
                //TODO 添加朋友
                Toast("还在开发中....请期待")
            },
            saoyisao:function(){
                //TODO 扫一扫
                Toast("还在开发中....请期待")
            },
            trigger:function (e) {
                console.log("点击",e);
                this.content.map(e=>{
                    e.active=false;
                })
               /* if(this.userInfo.roleCode=='QR_TEACHER'){

                }else if(this.userInfo.roleCode=='QR_STUDENT'){
                    this.$nextTick(function () {
                        this.content[e.index].active = true
                    })
                     this.content[e.index].fun();
                }*/
                this.$nextTick(function () {
                    this.content[e.index].active = true
                })
                this.content[e.index].fun();
                //关闭悬浮按钮
                this.$refs.fab.close();
            }
        },
        components:{
            uniFab,
            pop
        }
    }
</script>
<style>
    @font-face {
        font-family: grade-icon;
        src: url('~@/static/font/grade-icon.ttf');
    }

    .qr-icon {
        font-family: grade-icon !important;
        font-size: 90rpx;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .qr-body{
        border: 2px dashed white;
        margin: 20rpx;
        border-radius: 20rpx;
    }
    .qr-body-a{
        width: 550rpx;
    }
    .qr-gradeInfo view{
        font-size: 40rpx;
    }
    .qr-body-a{
        display: flex;
        flex-direction: row;
        align-items:center;
        justify-content: space-around;
    }
    .qr-body-b{
        display: flex;
        flex-direction: row;
        align-items:center;
        justify-content: center;
        color: #e80080;
    }
    .qr-body-b .qr-gradeInfo{
        font-size: 60rpx;
    }
    .qr-noGrade{
        display: flex;
        flex-direction: column;
        /*justify-content: center; !* 水平居中 *!*/
        align-items: center;     /* 垂直居中 */
        /*height: 600px;*/
    }
    .qr-top-right{
        position: absolute;
        /*top: 0px;*/
        z-index: 999999;
        right: 17px;
        font-size: 40rpx;
    }
    .status_bar {
        position: absolute;
        top: 0px;
        height: var(--window-bottom) + 10px;
        width: 100%;
    }
    .qr-addClassGradeModal{
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid black;
        width: 400rpx;
        /*height: 300rpx;*/
        margin: auto;
        border-radius: 20rpx;
    }
    .qr-addClassGradeModal view{
        line-height: 100rpx;
        font-size: 40rpx;
        width: 400rpx;
        height: 100rpx;
        text-align: center  ;
        border-bottom: 1px solid beige;
    }
    .qr_pop{
        display: flex;
        flex-direction: column;
    }
    .qr_pop_row{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        border: 1px solid wheat;
        padding: 10rpx;
        margin: 10rpx;
        border-radius: 10rpx;
    }
    .qr_pop_row view{
        font-size: 35rpx;
    }
    .qr-classGrade{
        width: 350rpx;
    }
</style>
