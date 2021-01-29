<template>
    <view class="content" v-if="course.classGrades != null && course.classGrades.length != 0">
        <view class="qr_top">
            <view class="qr_title">
                {{course.title}}
            </view>
            <view class="qr_picker" style="border: none">
                <picker  @change="bindPickerChange" :value="classGradeId" :range="classGrades">
                    <view class="uni-input">{{(classGrades[classGradeId])}}</view>
                </picker>
            </view>
            <view @tap="addCourse" style="color: white;border: 1px solid white">+</view>
        </view>

        <view v-for="item,index in course.courses" class="qr_body" @tap="gotoClassRoom(item.schoolTimeMark)" :key="index">
            <view class="qr_body_top">
                <view>{{item.subject}}</view>
                <view  :class="[item.schoolTimeMark? 'schoolTime':'noschoolTime']">{{item.schoolTimeDesc}}</view>
            </view>
            <view class="qr_body_bottom">
                {{item.grade}}
            </view>
        </view>
        <view v-show="course.courses.length == 0">
            现在还没有课，请赶快添加，不然来不及了
        </view>
    </view>
    <view v-else>
        请先添加班级
    </view>
</template>

<script>
    import {http,DLStorage,Toast} from "../../util/httpUtil";

    export default {
        onLoad(){
            this.findCourse();
        },
        onShow(){
            this.findCourse();
        },
        data() {
            return {
                course: {
                    courses:[]
                   /* title: "我学的课",
                   classGrades:[]
                    courses: [
                        {
                            subject: "大学物理A2",
                            grade: "20级计算机一班",
                            schoolTimeDesc: "正在上课...",
                            schoolTimeMark:true,
                            schoolTime:"1,3,5",
                            week:2
                        },
                        {
                            subject: "大学物理A2",
                            grade: "20级计算机一班",
                            schoolTimeDesc: "等待上课...",
                            schoolTimeMark:false,
                            schoolTime:"2,4,6",
                            week:2
                        }
                    ]*/
                },
                classGrades:[],
                classGradeId:0,
            };
        },
        methods:{
            bindPickerChange: function(e) {
                console.log('picker发送选择改变，携带值为', e.target.value)
                this.classGradeId = e.target.value
                //拿到真实的班级id
                let realClassGradeId = this.course.classGrades[this.classGradeId].id;
                console.log('realLclassGradeId', realClassGradeId)
                this.findCourse(realClassGradeId);
            },
            findCourse:function(realClassGradeId){
                //初始化学科 为了防止有人添加了班级后再次解绑班级 我的课程还是显示的老的班级
                this.course= {
                    courses:[]
                };
                let config={
                    url:"/authAccess/course",
                    data:{
                        accessUrl:"pages/course/course"
                    }
                }
                if(realClassGradeId){
                    config.data['classGradeId']=realClassGradeId;
                }
                http.Get(config,(data)=>{
                    if(data.code == this.$HTTP.SUCCESS){
                        this.course = data.data;
                        this.classGrades =[];
                        this.course.classGrades.forEach(classGrade=>{
                            this.classGrades.push(classGrade.classGradeName)
                        })
                    }
                    console.log(this.course)
                })
            },
            gotoClassRoom(schoolTimeMark){
                if(!schoolTimeMark){
                    Toast("请等待上课，再进入!");
                }
            },
            addCourse:function () {
                uni.navigateTo({
                    url:"/pages/course/addCourse/addCourse"
                })
            }
        }
    }
</script>

<style>
    .content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

    }


    .qr_body{
        padding: 30rpx;
        margin: 20rpx 10rpx;
        border: 1px dashed black;
        border-radius: 20rpx;
    }

    .qr_body .qr_body_top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .qr_body .qr_body_bottom {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
    .schoolTime{
        color: gold;
    }
    .noschoolTime{
        color: grey;
    }
    .qr_top{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .qr_top view {
        font-size: 34rpx;
        border: 1px solid black;
        border-radius: 20rpx;
        width: 200rpx;
        text-align: center;
        margin: 10rpx 10rpx;
    }
    .qr_picker view{
        width: 150rpx;
        font-size: 20rpx;
    }
</style>
