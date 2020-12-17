<template>
    <view class="content">
        <view>
            <form @submit="formSubmit" @reset="formReset">
                <view class="uni-form-item uni-column" style="margin-top: 100rpx">
                    <view class="title qr-title">登录名:</view>
                    <input class="uni-input qr-input" name="username" placeholder="输入用户名" v-model="username"/>
                </view>
                <view class="uni-form-item uni-column">
                    <view class="title qr-title">手机号:</view>
                    <input class="uni-input qr-input" name="phone"  placeholder="输入手机号" v-model="phone"/>
                </view>
                <view class="uni-form-item uni-column" >
                    <view class="title qr-title">密码:</view>
                    <input class="uni-input qr-input" name="password" v-model="password"  @input="repassword" type="password" placeholder="输入密码" />
                </view>
                <view class="uni-form-item uni-column" >
                    <view class="title qr-title">确认密码:</view>
                    <view class="uni-inline-item">
                        <input class="uni-input qr-input " name="repassword" v-model="password2" type="password" placeholder="二次确认密码" @input="repassword" @blur="repassword"/>
                        <text :class="{qr_success_font:repasswordflag}" >&#xe60b;</text>
                    </view>


                </view>
                <view class="uni-form-item uni-column" >
                    <view class="title qr-title">验证码:</view>
                    <view class="uni-inline-item">
                        <input class="uni-input qr-input-valicode" name="captcha" placeholder="输入验证码" />
                        <image :src=captchaImg class="qr-image" @tap="changeCaptcha"></image>
                    </view>
                </view>
                <view class="uni-form-item uni-column">
                    <view class="uni-inline-item qr-picker">
                        <text class="qr-title">我是:</text>
                        <picker @change="bindPickerChange" :value="index" :range="range">
                            <view class="uni-input" style="background: #ca5555;color: lightgoldenrodyellow;">{{range[index]}}</view>
                        </picker>
                    </view>
                </view>
                <view class="uni-form-item uni-column qr-agree">
                    <view class="title qr-title" style="font-size: 24rpx">
                        <checkbox-group name="rememberMe" >
                            <label >
                                <checkbox value="agree" style="transform:scale(0.8)"/>
                                <text >我已同意 <text @tap="goto('/pages/agree/agree')" style="color: rgb(72 19 247);">《快速答题个人服务协议》</text>
                                </text>
                            </label>

                        </checkbox-group>
                    </view>
                </view>
                <view class="uni-form-item uni-row" style="align-items: baseline">
                    <button form-type="submit" class="qr-button" >注册</button>
                </view>
            </form>
        </view>
    </view>

</template>

<script>
    import {http,DLStorage,Toast,serverInfo} from "@/util/httpUtil.js";

    export default {
        name: "register",
        data(){
            return{
                captchaImg:serverInfo.baseUrl+'/document/captcha?type=math',
                index:0,
                range:["老师","学生"],
                roles:[],
                password:"",
                username:"",
                phone:"",
                password2:"",
                repasswordflag:""
            }
        },
        onLoad(){

            // this.validCode()
            this.getRoleRange();
        },
        methods:{
            getRoleRange:function(){
                let config={
                    url:"/role/roles",
                    noToken: true
                }
                http.Get(config,(data)=>{
                    if(data.code == this.$HTTP.SUCCESS){
                        this.roles = data.data;
                        this.range = [];
                        for(var i=0;i<data.data.length;i++){
                            this.range.push(data.data[i].roleName)
                        }
                    }
                })
            },
            repassword:function(e){
                let type = e.type;
                if(type == "input"){
                    console.log("二次确认密码",e)
                    if(this.password2== this.password){
                        this.repasswordflag = true
                        console.log(true)
                    }else{
                        this.repasswordflag = false
                    }
                }else if(type == "blur"){
                    if(this.password2 != this.password){
                        this.repasswordflag = false
                        Toast("请确认你的密码")
                    }
                }

            },
            bindPickerChange: function(e) {
                console.log('picker发送选择改变，携带值为', e.target.value)
                this.index = e.target.value

            },
            //换验证码
            changeCaptcha:function(){
                this.captchaImg = serverInfo.baseUrl+'/document/captcha?type=math&time='+new Date().getTime()
            },
            formReset:function () {

            },
            formSubmit:function (e) {
                console.log(e)
                let userBean = e.detail.value;
                if(userBean.rememberMe.length == 0){
                    Toast("请勾选服务协议");
                    return;
                }
                //获取对应的角色代码
                userBean.roleCode = this.roles[this.index].roleCode
                //勾选了协议
                userBean.rememberMe = true
                let config={
                    url:"/user/doRegister",
                    data:userBean,
                    noToken: true
                }
                http.Post(config,(data)=>{
                    console.log("注册成功",data)
                    if(data.code == this.$HTTP.SUCCESS){
                        var token = data.data;
                        //保存accessTOken
                        DLStorage.setCacheStorage(DLStorage.keyDataSet.accessToken,token);
                        //返回到个人页面
                        uni.navigateBack({
                            delta: 2
                        });
                        uni.$emit("doLogin",data.message)
                        return;
                    }
                    Toast(data.message)
                })
            },
            goto(url){
                uni.navigateTo({
                    url:url
                })
            }

        }
    }
</script>

<style scoped>

    .content{
        display: flex;
        flex-direction: column;
        margin: 30rpx;
        justify-content: center;
        align-items: center;
    }
    .qr-input{
        width: 400rpx;
    }
    .qr-title{
        font-size: 36rpx;
    }
    .qr-input-valicode{
        width: 200rpx;
    }
    .qr-image{
        width: 190rpx;
        height: 80rpx;
        margin-left: 15rpx;
    }
    .qr-button{
        margin-top: 20rpx;
        width: 200rpx;
        background: #e80080;
        color: white;
    }
    .qr-agree{
        margin-top: 20rpx;
    }
    .qr-picker{
        display:flex;
        justify-content: space-evenly;
        margin-top: 20rpx;
    }
    @font-face {
        font-family: "success";
        src: url('http://localhost:8080/static/font/success-font.ttf?t=1608088167797') /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
    }
    .qr_success_font{
        font-family: success !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /*content: "ssss";*/
    }
</style>