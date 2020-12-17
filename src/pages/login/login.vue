<template>
    <view class="content">
        <view>
            <form @submit="formSubmit" @reset="formReset">
                <view class="uni-form-item uni-column" style="margin-top: 100rpx">
                    <view class="title qr-title">登录名:</view>
                    <input class="uni-input qr-input" name="commonNumber" placeholder="输入用户名、手机号或学号" />
                </view>
                <view class="uni-form-item uni-column" >
                    <view class="title qr-title">密码:</view>
                    <input class="uni-input qr-input" name="password" type="password" placeholder="输入密码" />
                </view>
                <view class="uni-form-item uni-column" >
                    <view class="title qr-title">验证码:</view>
                    <view class="uni-inline-item">
                        <input class="uni-input qr-input-valicode" name="captcha" placeholder="输入验证码" />
                        <image :src=captchaImg class="qr-image" @tap="changeCaptcha"></image>
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
                    <button form-type="submit" class="qr-button" >登录</button>
                    <view @tap="goto('/pages/register/register')">
                        注册？
                    </view>
                    <view @tap="forgot">
                        忘记密码？
                    </view>
                </view>
            </form>
        </view>
    </view>

</template>

<script>
    import {http,DLStorage,Toast,serverInfo} from "@/util/httpUtil.js";

    export default {
        name: "login",
        data(){
            return{
                captchaImg:serverInfo.baseUrl+'/document/captcha?type=math'
            }
        },
        onLoad(){

            // this.validCode()
        },
        methods:{
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
                userBean.rememberMe = true
                let config={
                    url:"/user/doLogin",
                    data:userBean,
                    noToken: true
                }
                http.Post(config,(data)=>{
                    console.log("登录成功",data)
                    if(data.code == this.$HTTP.SUCCESS){
                        var token = data.data;
                        //保存accessTOken
                        DLStorage.setCacheStorage(DLStorage.keyDataSet.accessToken,token);
                        //返回到个人页面
                        uni.navigateBack({
                            delta: 1
                        });
                        uni.$emit("doLogin",data.message)
                        return;
                    }
                    Toast(data.message)
                })
            },
            //忘记密码
            forgot:function () {

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
</style>