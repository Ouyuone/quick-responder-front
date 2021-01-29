<template>
    <view class="content">
        <view class="qr_top">
            <view class="qr_title">
                {{course.title}}
            </view>
            <view class="qr_picker" style="border: none">
                <picker  @change="bindPickerChange" :value="classGradeId" :range="classGrades">
                    <view class="uni-input">{{(classGrades[classGradeId])}}</view>
                </picker>
            </view>
        </view>

        <view v-for="item,index in course.courses" class="qr_body" :id="item.subjectId" :ref="item.subjectId" :key="index">
            <view >
                <view class="qr_body_top">
                    <view>{{item.subject}}</view>
                    <view  :class="[item.schoolTimeMark? 'schoolTime':'noschoolTime']">{{item.schoolTimeDesc}}</view>
                </view>
                <view class="qr_body_bottom">
                    {{item.grade}}
                </view>
            </view>
            <view class="qr__" @tap="addCourse(item.subjectId)" v-if="course.roleCode =='QR_STUDENT'">
                +
            </view>
        </view>
        <view  class="qr_body__" v-if="course.roleCode =='QR_TEACHER'">
            <view  @tap="addTeacherCourse" >
                +
            </view>
        </view>
        <view v-show="!course.courses" style="color: darkred;font-size: 40rpx">
            现在已经没有课可以添加了,如需添加课程请先联系老师创建课程！
        </view>
    </view>
</template>

<script>
    import {http,DLStorage,Toast} from "../../../util/httpUtil";

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

                },
                classGrades:[],
                classGradeId:0
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
                let config={
                    url:"/authAccess/course",
                    data:{
                        accessUrl:"pages/course/course"
                    }
                }
                //选择班级的时候需要传班级号
                if(realClassGradeId){
                    config.data['classGradeId']=realClassGradeId;
                }
                //是同学的时候需要传班级号，好把当前班级的所有学科拉出来
                var userInfo = DLStorage.getCacheStorage(DLStorage.keyDataSet.userInfo);

                if(userInfo && userInfo.roleCode == "QR_STUDENT"){
                    config.data['classGradeId']=userInfo.classGradeId;
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
            addCourse:function (courseId) {
                console.log("学科id",courseId)
                let config={
                    url:"/course/addCourse",
                    data:{
                        courseId:courseId
                    },
                    header:{
                        "content-type":'application/x-www-form-urlencoded'
                    },
                    toForm:true
                };
                http.Post(config,(data)=>{
                    if(data.code == this.$HTTP.SUCCESS){
                        this.course = data.data;
                        this.classGrades =[];
                        this.course.classGrades.forEach(classGrade=>{
                            this.classGrades.push(classGrade.classGradeName)
                        })
                    }
                })
            },
            addTeacherCourse:function () {
                //拿到真实的班级id
                let realClassGrade = this.course.classGrades[this.classGradeId];
                // let realClassGradeId = this.course.classGrades[this.classGradeId].id;
                console.log("班级id",realClassGrade);
                uni.navigateTo({
                    url:"/pages/course/teacherAddCourse/teacherAddCourse?classGrade="+JSON.stringify(realClassGrade)
                });
                // let config={
                //     url:"/course/addTeacherCourse",
                //     data:{
                //         classGradeId:realClassGradeId
                //     },
                //     header:{
                //         "content-type":'application/x-www-form-urlencoded'
                //     },
                //     toForm:true
                // };
                // http.Post(config,(data)=>{
                //     if(data.code == this.$HTTP.SUCCESS){
                //         this.course = data.data;
                //         this.classGrades =[];
                //         this.course.classGrades.forEach(classGrade=>{
                //             this.classGrades.push(classGrade.classGradeName)
                //         })
                //     }
                // })

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
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .qr_body .qr_body_top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 273px;
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
    .qr__{
        color: white;
        border: 1px solid white;
        width:80rpx;
        height: 80rpx;
        border-radius: 24rpx;
        text-align: center;
        line-height: 80rpx;
    }
    .qr_body__ view {
        padding: 30rpx;
        margin: 20rpx 10rpx;
        border: 1px dashed white;
        border-radius: 20rpx;
       text-align: center;
        font-size: 50rpx;
        color: white;
    }
    .qr_picker view{
        width: 150rpx;
        font-size: 20rpx;
        margin-left: -5rpx;
    }
</style>
