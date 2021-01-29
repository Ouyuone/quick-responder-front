<template>
    <view class="content">
        <view>
            <text>{{classGradeName}}</text>
        </view>
        <view>
            <form @submit="addTeacherCourse">
                <view class="uni-form-item uni-row">
                    <view class="title">课程名:</view>
                    <view>
                        <input class="uni-input" name="input" v-model="addCourse.subject" placeholder="请输入添加的课程名" style="border: solid 1px #999999;width: 360rpx;"/>
                    </view>

                </view>
                <view class="uni-form-item uni-row">
                    <view class="title">课程结束日期:</view>
                    <view>
                        <picker mode="date" :value="addCourse.overdueTime"  @change="bindTimeChange">
                            <view class="uni-input">{{addCourse.overdueTime}}</view>
                        </picker>
                    </view>

                </view>
                <view class="uni-form-item uni-row">
                    <view style="color: rgb(162 57 115);font-size: 34rpx" class="title">
                        温馨提示:打上红色√的是被占用了的上课时间，请注意选择自己的上课时间！
                    </view>
                </view>
                <view class="uni-form-item uni-column qr_week">
                    <view class="title">上课时间:</view>
                    <view >
                        <radio-group @change="weekChange">
                            <label class="uni-list-cell uni-list-cell-pd" v-for="item,index in weeks" :key="index">
                                <view>
                                    <radio :value="item.week" :checked="currentWeek == item.week"/>
                                </view>
                                <view>{{item.desc}}</view>
                            </label>
                        </radio-group>
                    </view>
                </view>
                <view class="uni-inline-item qr_bottom">
                    <view class="uni-form-item uni-column qr_schoolTime">
                        <view class="title">上午:</view>
                        <view>
                            <checkbox-group style="transform:scale(0.8)" @change="amTimeChange">
                                <label v-for="item,index in amTime" class="uni-list-cell uni-list-cell-pd" :key="index">
                                    <checkbox :value="item.realSeveralLesson" :id="item.realSeveralLesson" :disabled="(item.checked && item.userId == 0)" :checked="item.checked"  :color='(item.checked && item.userId == 0)?"red":""'/>第{{item.severalLesson}}节
                                </label>
                            </checkbox-group>
                        </view>
                    </view>
                    <view class="uni-form-item uni-column qr_schoolTime">
                        <view class="title">下午:</view>
                        <view>
                            <checkbox-group style="transform:scale(0.8)" @change="pmTimeChange">
                                <label v-for="item,index in pmTime" class="uni-list-cell uni-list-cell-pd" :key="index">
                                    <checkbox :value="item.realSeveralLesson" :id="item.realSeveralLesson" :disabled="(item.checked && item.userId == 0)" :checked="item.checked"  :color='(item.checked && item.userId == 0)?"red":""' />第{{item.severalLesson}}节
                                </label>
                            </checkbox-group>
                        </view>
                    </view>
                    <view class="uni-form-item uni-column qr_schoolTime">
                        <view class="title">晚上:</view>
                        <view>
                            <checkbox-group style="transform:scale(0.8)" @change="evTimeChange">
                                <label v-for="item,index in evTime" class="uni-list-cell uni-list-cell-pd" :key="index">
                                    <checkbox :value="item.realSeveralLesson" :id="item.realSeveralLesson" :disabled="(item.checked && item.userId == 0)" :checked="item.checked"  :color='(item.checked && item.userId == 0)?"red":""'/>第{{item.severalLesson}}节
                                </label>
                            </checkbox-group>
                        </view>
                    </view>
                </view>
                <view class="uni-btn-v " style="margin-top:190rpx">
                    <button form-type="submit">确认提交</button>
                </view>
            </form>
        </view>
    </view>
</template>

<script>
    import {http, DLStorage, Toast} from "../../../util/httpUtil";

    export default {
        onLoad(option) {
            let classGrade = JSON.parse(option.classGrade);
            this.classGradeId = classGrade.id;
            this.classGradeName = classGrade.classGradeName;
            this.addCourse.gradeId = classGrade.id;
            this.loadSchoolTime();
        },
        onShow() {
        },
        data() {
            return {
                addCourse:{
                    subject:"",
                    overdueTime:new Date().getFullYear()+"-"+(new Date().getDay()+1)+"-"+new Date().getDate(),
                    gradeId:""
                },
                classGradeName: "",
                classGradeId: 0,
                weeks:[{
                    week:"1",desc:"星期一",
                    amTime:[{realSeveralLesson:"1",severalLesson:"1",checked:true},{realSeveralLesson:"2",severalLesson:"2",checked:false},{realSeveralLesson:"3",severalLesson:"3",checked:false},{realSeveralLesson:"4",severalLesson:"4",checked:false},{realSeveralLesson:"5",severalLesson:"5",checked:false}],
                    pmTime:[{realSeveralLesson:"6",severalLesson:"1",checked:false},{realSeveralLesson:"7",severalLesson:"2",checked:true}],
                    evTime:[{realSeveralLesson:"8",severalLesson:"1",checked:false}]}
                    ,{week:"2",desc:"星期二",
                        amTime:[{realSeveralLesson:"1",severalLesson:"1",checked:true},{realSeveralLesson:"2",severalLesson:"2",checked:false},{realSeveralLesson:"3",severalLesson:"3",checked:false},{realSeveralLesson:"4",severalLesson:"4",checked:false},{realSeveralLesson:"5",severalLesson:"5",checked:false}],
                        pmTime:[{realSeveralLesson:"6",severalLesson:"1",checked:false},{realSeveralLesson:"7",severalLesson:"2",checked:true}],
                        evTime:[{realSeveralLesson:"8",severalLesson:"1",checked:false}]}
                        ,{week:"3",desc:"星期三"},{week:"4",desc:"星期四"},{week:"5",desc:"星期五"}],
                amTime:[{realSeveralLesson:"1",severalLesson:"1",checked:true,userId:0},{realSeveralLesson:"2",severalLesson:"2",checked:false},{realSeveralLesson:"3",severalLesson:"3",checked:false},{realSeveralLesson:"4",severalLesson:"4",checked:false},{realSeveralLesson:"5",severalLesson:"5",checked:false}],
                pmTime:[{realSeveralLesson:"6",severalLesson:"1",checked:false},{realSeveralLesson:"7",severalLesson:"2",checked:true}],
                evTime:[{realSeveralLesson:"8",severalLesson:"1",checked:false}],
                currentWeek:1,
                isValid:0
            };
        },
        methods: {
            bindTimeChange:function(e){
                this.addCourse.overdueTime =e.detail.value;
            },
            weekChange:function(e){
               this.currentWeek = e.detail.value;
               console.log("选择的星期",this.currentWeek)
                // this.loadSchoolTime(week);
               this.amTime =this.weeks[this.currentWeek-1].amTime;
               this.pmTime =this.weeks[this.currentWeek-1].pmTime;
               this.evTime =this.weeks[this.currentWeek-1].evTime;
            },
            amTimeChange:function(e){
               let checked =  e.detail.value;
                for(var i=0;i<checked.length;i++){
                    for(var ii=0;ii<this.amTime.length;ii++){
                        if (checked[i] == this.amTime[ii].realSeveralLesson && !this.amTime[ii].checked) {
                            this.amTime[ii]['userId']=1;
                            this.amTime[ii]['checked']=true;
                            console.log("新增第",ii+1,this.amTime)
                            this.isValid++;
                        }else if(this.amTime[ii].checked && this.amTime[ii].userId ==1 && checked.indexOf(this.amTime[ii].realSeveralLesson) == -1){
                            //这个是说明是取消了的
                            this.amTime[ii]['userId']=0;
                            this.amTime[ii]['checked']=false;
                            console.log("删除第",ii+1,this.amTime)
                            this.isValid--;
                        }
                    }
                }
                //把选择后的返显
                this.weeks[this.currentWeek-1].amTime = this.amTime;
            },
            pmTimeChange:function(e){
                console.log(e)
                let checked =  e.detail.value;
                for(var i=0;i<checked.length;i++){
                    for(var ii=0;ii<this.pmTime.length;ii++){
                        if (checked[i] == this.pmTime[ii].realSeveralLesson && !this.pmTime[ii].checked) {
                            this.pmTime[ii]['userId']=1;
                            this.pmTime[ii]['checked']=true;
                            console.log("新增第",ii+1,this.pmTime)
                            this.isValid++;
                        }else if(this.pmTime[ii].checked && this.pmTime[ii].userId ==1 && checked.indexOf(this.pmTime[ii].realSeveralLesson) == -1){
                            //这个是说明是取消了的
                            this.pmTime[ii]['userId']=0;
                            this.pmTime[ii]['checked']=false;
                            console.log("删除第",ii+1,this.pmTime)
                            this.isValid--;
                        }
                    }
                }
                //把选择后的返显
                this.weeks[this.currentWeek-1].pmTime = this.pmTime;
            },
            evTimeChange:function(e){
                console.log(e)
                let checked =  e.detail.value;
                for(var i=0;i<checked.length;i++){
                    for(var ii=0;ii<this.evTime.length;ii++){
                        if (checked[i] == this.evTime[ii].realSeveralLesson && !this.evTime[ii].checked) {
                            this.evTime[ii]['userId']=1;
                            this.evTime[ii]['checked']=true;
                            console.log("新增第",ii+1,this.evTime)
                            this.isValid++;
                        }else if(this.evTime[ii].checked && this.evTime[ii].userId ==1 && checked.indexOf(this.evTime[ii].realSeveralLesson) == -1){
                            //这个是说明是取消了的
                            this.evTime[ii]['userId']=0;
                            this.evTime[ii]['checked']=false;
                            console.log("删除第",ii+1,this.evTime)
                            this.isValid--;
                        }
                    }
                }
                //把选择后的返显
                this.weeks[this.currentWeek-1].evTime = this.evTime;
            },
            addTeacherCourse: function (e) {
                console.log(this.weeks)
                if(!this.addCourse.subject){
                    Toast("请填写课程名称");
                    return;
                }
                if(this.isValid == 0){
                    Toast("请先选择上课时间")
                    return;
                }
                return;
                this.addCourse.weeks=this.weeks
                console.log(this.addCourse)
                let data = this.addCourse;
                let config={
                    url:"/course/teacherAddCourse",
                    data:data
                };
                http.Post(config,(data)=>{
                    if(data.code ==  this.$HTTP.SUCCESS){
                        uni.navigateTo({
                            url:"/pages/course/addCourse/addCourse"
                        })
                    }
                })

            },
            loadSchoolTime(){
                let config={
                    url:"/schoolTime/findByFreeTime",
                    data:{
                        classGradeId:this.classGradeId
                    }
                };
                http.Get(config,(data)=>{
                    if(data.code ==  this.$HTTP.SUCCESS){
                        console.log("加载空闲上课时间成功",data.data);
                        this.weeks = data.data;
                        console.log("加载",this.weeks)
                        this.amTime =this.weeks[this.currentWeek-1].amTime;
                        this.pmTime =this.weeks[this.currentWeek-1].pmTime;
                        this.evTime =this.weeks[this.currentWeek-1].evTime;
                    }
                })
            }
        }
    }
</script>

<style>
    .content {
        display: flex;
        flex-direction: column;
        /*justify-content: center;*/
        align-items: center;
        padding: 20rpx;
    }
    .qr_row{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        /*width: 750rpx;*/
    }
    .qr_week radio-group{
        /*width: 750rpx;*/
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }
    .qr_schoolTime checkbox-group{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        height: 200rpx;

    }
    .qr_bottom {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
    }
    .qr_disable{

    }
</style>
