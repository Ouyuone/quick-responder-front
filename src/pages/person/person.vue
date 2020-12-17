<template>
	<view class="content">
		<view class = "topCT" :class="{noauth:!userAuth}">
            <image :src="userAuth?userInfo.headPicture?userInfo.headPicture:defaultImage:defaultImage" mode="aspectFit" class="topCTHeadImg"></image>
            <view class="topCTright">
                <view style="margin-bottom: 10rpx;">
                    <view v-if="userAuth" style="font-size: 29px">{{userInfo.username}}</view>
                    <!--    #ifdef H5                -->
                    <button v-else  class="userAuthto uni-bg-red" @click="goto('/pages/login/login')">
                        用户登录
                    </button>
                    <!--     #endif               -->
                    <!--    #ifdef MP-WEIXIN               -->
                    <button v-else  class="userAuthto uni-bg-red" open-type="getUserInfo" @getuserinfo="getuserInfowx" @getphonenumber="getPhonenumber">
                        获取用户信息
                    </button>
                    <!--     #endif               -->
                </view>
                <view class="topCTBottom" v-if="userAuth">
                    <view>
                        {{userInfo.classGradeName}}
                    </view>
                    <view>
                        {{userInfo.studentNumber}}
                    </view>
                </view>
            </view>
        </view>
            <!--    为获取到用户信息    -->
		<view class = "bodyCT">
            <view class="qr-line">
                    <image src="/static/icon/tipc-icon.png" ></image>
                <view>我的题库</view>
            </view>
            <view class="qr-line">
                <image src="/static/icon/star-icon.png" ></image>
                <view>我的收藏</view>
            </view>
            <view class="qr-line" @tap="goto('/pages/grade/grade')">
                <image src="~@/static/icon/grade-icon.png"></image>
                <view>我的班级</view>
            </view>
            <view class="qr-line">
                <image src="~@/static/icon/history-icon.png"></image>
                <view>历史成绩</view>
            </view>
            <!--隐藏掉最后的下划需线-->
            <view class="qr-line" style="border-bottom: 1px solid white" @tap="goto('/pages/setting/setting')">
                <image src="~@/static/icon/setting-icon.png"></image>
                <view>设置</view>
            </view>
        </view>
	</view>
</template>

<script>
    import {http,DLStorage,Toast} from "../../util/httpUtil";

    export default {
		data() {
			return {
				"userInfo":{
				    // "username":"欧大哥",
                    // "classGradeName":"20级计算机一班",
                    // "studentNumber":"12020101900001",
                    // "headPicture":"/static/logo.png"
                },
                userAuth:false,
                defaultImage:"/static/logo.png"
			}
		},
		onLoad(){
		    this.getUserInfoStorage();
		    //监听登录成功弹窗
		    uni.$on("doLogin",(data)=>{
		       setTimeout(function () {
                   Toast(data);
               },500)
                // console.log(data)
            })
		},
        onShow(){
           this.getUserInfo();
        },
		methods: {
            getPhonenumber:function(phone){
                console.log("电话",phone)
            },
		    getUserInfoStorage:function(){
		        //获取内存中的用户信息 返显到页面
                var userInfo = DLStorage.getCacheStorage(DLStorage.keyDataSet.userInfo);
                if(userInfo){
                    this.userAuth = true;
                    this.userInfo = userInfo;
                }
                return  userInfo;
            },
            goto:function (url) {
                uni.navigateTo({
                    url:url
                })
            },
            getuserInfowx:function (userinfo) {
                console.log("用户信息",userinfo)
                if(userinfo.mp.detail.errMsg == "getUserInfo:ok"){
                    let rawData = userinfo.detail.userInfo;
                    this.userInfo.username = rawData.nickName;
                    this.userInfo.headPicture =rawData.avatarUrl;
                    //需要获取到wx token来关联用户信息
                    this.getOpenId();
                }else{
                    Toast("获取用户信息失败，请检查是否授权!");
                }

            },
            getUserIfoByOpenIdOrRegister:function(){
		        let config={
		            url:"/user/UserInfoByOpenIdOrRegister",
                    data:this.userInfo,
                    noToken:true
                }
                http.Post(config,(data)=>{
                    if(data.code == this.$HTTP.SUCCESS){
                        this.userInfo = data.data.userInfo;
                        //保存token
                        DLStorage.setCacheStorage(DLStorage.keyDataSet.accessToken,data.data.token);
                        //保存userInfo
                        DLStorage.setCacheStorage(DLStorage.keyDataSet.userInfo,this.userInfo);
                        this.userAuth = true;
                    }
                })
            },
            getOpenId:function(){
		        let self = this;
                uni.login({
                    provider: 'weixin',
                    success: function (loginRes) {
                        if(loginRes.errMsg == "login:ok"){
                            console.log("微信登录",JSON.stringify(loginRes));
                            let code= loginRes.code;
                            //bb5a61fb8ad3ff5215e2f633fdd948eb
                            let url = `https://api.weixin.qq.com/sns/jscode2session?appid=wx58acc8e7ec92fc40&secret=bb5a61fb8ad3ff5215e2f633fdd948eb&js_code=${code}&grant_type=authorization_code`;
                            uni.request({
                                url:url,
                                timeout: 30000,
                                success: function(data) {
                                    console.log("返回数据", data)
                                    if (data != null) {
                                        self.userInfo["openId"]=data.data.openid;
                                        //拿着openiD到后台去找用户没有则注册一个
                                        self.getUserIfoByOpenIdOrRegister();
                                    }
                                },
                                fail: (error) => {
                                    uni.$emit("messagePrompEmit", "close", null);
                                    console.log("requestStart error:", error, config['url']);
                                    Toast('网络错误:' + config['url']);

                                }
                            })
                        }
                    }
                });
            },
            getUserInfo:function () {
		        //能取出来就直接返回 否者去后台查询
		        if(this.getUserInfoStorage()){
		             return;
                }
		        //未登录也不去取用户信息
		        if(!DLStorage.getCacheStorage(DLStorage.keyDataSet.accessToken)){
		            return;
                }
		        //查询用户信息
                let config = {
                    url:"/user/userInfo"
                }
                http.Get(config,(data)=>{
                    if(data.code == this.$HTTP.SUCCESS){
                        DLStorage.setCacheStorage(DLStorage.keyDataSet.userInfo,data.data);
                        this.getUserInfoStorage();
                    }
                })
            }
		}
	}
</script>

<style>
    .content{
        display: flex;
        flex-direction: column;
        margin: 20rpx;
        background: white;
        border-radius: 30rpx;
        overflow: hidden;
    }
    body{
        background: white;
    }
    .topCT{
        display: flex;
        flex-direction: row;
        margin: 30rpx 0rpx;
        justify-content: space-around;
    }
    .topCTHeadImg{
        width: 150rpx;
        height: 150rpx;
        border-radius: 150rpx;
        border: solid gainsboro;
    }
    .topCTright{
        width: 250rpx;
        /*margin-right: 50rpx;*/
        position: relative;
        right: 1rem;
        font-family: hwxk;
    }
    .topCTBottom view{
        width: 250rpx;
        font-size: 18px;
    }
    .userAuthto{
        width: 280rpx;
        /*background: var(--uni-color-warning);*/
    }
    .noauth{
        align-items: center;
    }

    .bodyCT{
        display: flex;
        flex-direction: column;
        align-items: baseline;
    }
    .bodyCT view{
        margin-top: 20rpx;
        font-size: 50rpx;
    }
    .qr-line{
        width: 750rpx;
        border-bottom: 1px dashed black;
        border-color: black;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .qr-line image{
        width: 58rpx;
        height: 58rpx;
        margin-left: 40rpx;
        margin-right: 20rpx;
    }
</style>
