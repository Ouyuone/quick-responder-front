<template>
	<view class="content">
		<view class="text-area" :style="{height:scrollerHeight}">
			<image src="/static/picture/indexTop.png" :style="{height:scrollerHeight,width:scrollerWidth}"></image>
			<text class="daydayword">
				{{daydayword}}
				<text class="daydayauthor">
					— {{daydayauthor}}
				</text>
			</text>
		</view>
		<view class="text-area-row" :style="{width:scrollerWidth}">
			<view class="">
				<view class="image-margin border-right-bottom" @tap="mycourse">
					<image src="/static/picture/course_pic.png" mode="aspectFit" :style="{width:picwidth,height:picwidth}"></image>
					<text>我的课程</text>
				</view>
				<view class="image-margin border-right-top" @tap="scoresys">
					<image src="/static/picture/score_pic.png" mode="aspectFit" :style="{width:picwidth,height:picwidth}"></image>
					<text>评分系统</text>
				</view>
			</view>

			<view class="">
				<view class="image-margin border-left-bottom" @tap="topic">
					<image src="/static/picture/topic_pic.png" mode="aspectFit" :style="{width:picwidth,height:picwidth}"></image>
					<text>在线刷题</text>
				</view>
				<view class="image-margin border-left-top" @tap="mygrade">
					<image src="/static/picture/grade_pic.png" mode="aspectFit" :style="{width:picwidth,height:picwidth}"></image>
					<text>我的班级</text>
				</view>
			</view>
		</view>
		<view>

		</view>
	</view>
</template>

<script>
	import {
		http
	} from "@/util/httpUtil.js"
	export default {
		// 414x736
		data() {
			return {
				title: 'Hello',
				height: 0,
				picwidth: '58px',
				// scrollerHeight: ((uni.getSystemInfoSync().screenHeight /uni.getSystemInfoSync().screenWidth - 44 - 50) - 10) / 2 + 'rpx',
				scrollerHeight:   (uni.getSystemInfoSync().screenHeight / uni.getSystemInfoSync().screenWidth)*750 /2+"rpx",
				scrollerWidth: (750 - 10) + 'rpx',
				daydayword: "今生最好不过你胖,我也爱!",
				daydayauthor: "无名"
			}
		},
		onLoad() {
		/*	uni.onWindowResize((res) => {
				console.log('变化后的窗口宽度=' + res.size.windowWidth)
				console.log('变化后的窗口高度=' + res.size.windowHeight)

				this.scrollerHeight = ((res.size.windowWidth - 44 - 50) - 10) / 2 + 'rpx';
				this.scrollerWidth = (res.size.windowHeight - 10) + 'rpx';
			})*/
			this.everydayword();
		},
		onShow() {

		},
		methods: {
			everydayword: function() {
				let config = {
					url: "/everyday/oneword",
					noToken:true
				}
				http.Get(config, (res) => {
					if (res.code == this.$HTTP.SUCCESS) {
						this.daydayword = res.data.oneword;
						this.daydayauthor = res.data.author;
					}
				});
			},
			mycourse: function() {
				uni.reLaunch({
					url: "/pages/course/course"
				})
			},
			scoresys: function() {
				uni.navigateTo({
					url: "/pages/scores/scores"
				})
			},
			topic: function() {
				uni.reLaunch({
					url: "/pages/liveTopic/liveTopic"
				})
			},
			mygrade: function() {
				uni.navigateTo({
					url: "/pages/grade/grade"
				})
			}
		},
		computed: {
			// scrollerHeight: function() {
			// 	return ((window.innerHeight - 44 - 50) - 10) / 2 + 'px'
			// },
			// scrollerWidth: function(){
			// 	return (window.innerWidth - 10)+'px'
			// }
		},
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: #007AFF;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
		/* height: 286px; */
		margin-top: 5px;
	}

	.text-area-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		/* height: 286px; */
		margin-top: 5px;
		background-image: url(../../static/picture/groupback.png);
		background-size: 100%;
		background-repeat: round;
	}


	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}



	.image-margin {
		padding: 15px;
		display: flex;
		flex-direction: column;
		text-align: center;
		color: white;
		/* font-family: cursive; */
		font-family: hwxk;
	}

	.border-right-bottom {
		border-right: 1px dotted white;
		border-bottom: 1px dotted white;
		margin-right: 0px;
		margin-bottom: 0px;
	}

	.border-right-top {
		border-right: 1px dotted white;
		border-top: 1px dotted white;
		margin-right: 0px;
		margin-top: 0px;
	}

	.border-left-top {
		border-left: 1px dotted white;
		border-top: 1px dotted white;
		margin-left: 0px;
		margin-top: 0px;
	}

	.border-left-bottom {
		border-left: 1px dotted white;
		border-bottom: 1px dotted white;
		margin-left: 0px;
		margin-bottom: 0px;
	}

	.daydayword {
		margin: 0 auto;
		/* height: 443rpx; */
		height: 520rpx;
		writing-mode: vertical-lr;
		color: ivory;
		font-size: 31px;
		position: absolute;
		/* left: 235rpx; */
		left: 90rpx;
		top: 50rpx;
		font-family: hwxk;
	}

	.daydayauthor {
		position: absolute;
		writing-mode: vertical-lr;
		bottom: 0rpx;
		right: -80rpx;
		font-family: hwxk;
		/* color: cadetblue; */
		color: cadetblue;
	}
</style>
