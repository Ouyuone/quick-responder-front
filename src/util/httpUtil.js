import Vue from 'vue'
var serverInfo = {
	baseUrl: "http://localhost:1354"
};
var DLStorage = {
	//缓存key
	keyDataSet:{
		accessToken:"accessToken",
		userInfo: "userInfo"
	},
	setCacheStorage: function(key, obj) {
		var data = null;
		console.info("www",typeof obj)
		if (typeof obj === "object") {
			data = "obj-" + JSON.stringify(obj);
		} else {
			data = obj;
		}
		uni.setStorage({
			key: key,
			data: data,
			success() {},
			complete() {},
			fail() {
				Toast(key + "缓存失败");
			}
		});
	},
	getCacheStorage: function(key) {
		var retData = null;
		try{
			var res = uni.getStorageSync(key);
			if (typeof res === "string" && res.indexOf("obj-") == 0) {
				retData = JSON.parse(res.slice(4));
			} else {
				retData = res;
			}
		} catch (e) {
		// error
			console.error("获取缓存"+key+"失败",e)
		}
		return retData;
	},
	removeCacheStorage(key) {
		uni.removeStorage({
			key: key,
			success() {},
			fail() {},
			complete() {}
		})
	}
};


var Toast= function(titleText, iconVal = 'none', durationTimeVal = 2000) {
	if (titleText && titleText.length < 1) return;
	uni.showToast({
		title: titleText,
		duration: durationTimeVal,
		icon: ['success', 'loading'].indexOf(iconVal) > -1 ? iconVal : 'none'
	})
}
var http = {
	fillRequestData: function(obj) {
		var config = {};
		if (obj.url.length < 1) return null;
		config.method = obj.method || "GET",
			config.url = serverInfo.baseUrl + obj.url;
		if (obj.data) config.data = obj.data;

		var headerCus = {};
		if (obj.header) {
			for (var o in obj.header) {
				headerCus[o] = obj.header[o];
			}
		}
		// var isFillHeader=false;
		// noToken = false 需要加token头
		if(!obj.noToken){
			var xAuthToken = DLStorage.getCacheStorage(DLStorage.keyDataSet.accessToken);
			if (xAuthToken) {
				headerCus["X-CURRENT-TOKEN"] = xAuthToken;
				// isFillHeader=true;
			}
		}

		// if(isFillHeader) 
		config.header = headerCus;
		return config;
	},
	/*
	  url			String				是		开发者服务器接口地址
	  data	Object/String/ArrayBuffer	否		请求的参数	5+App（自定义组件编译模式）不支持ArrayBuffer类型
	  header		Object				否		设置请求的 header，header 中不能设置 Referer。
	  method		String				否		GET	有效值详见下方说明
	  dataType		String				否		json	如果设为 json，会尝试对返回的数据做一次 JSON.parse
	  responseType	String				否			text	设置响应的数据类型。合法值：text、arraybuffer	5+App和支付宝小程序不支持
	  sslVerify		Boolean				否	true	验证 ssl 证书	仅5+App安卓端支持（HBuilderX 2.3.3+）
	  success		Function			否		收到开发者服务成功返回的回调函数
	  fail			Function			否		接口调用失败的回调函数
	  complete		Function			否		接口调用结束的回调函数（调用成功、失败都会执行）
	  */
	Get: function(configInf, processFunc) {
		var config = this.fillRequestData(configInf);
		if (!config || !(typeof processFunc == "function")) return;
		uni.request({
			...config,
			timeout: 30000,
			success: function(res) {
				if (res.statusCode != 200) {
					Toast('网络错误，数据获取失败' + config['url']);
					return;
				} else {
					if(res.code == HTTP.FAIL){
						Toast(res.message);
						return;
					}
					processFunc(res.data);
				}
				console.log("返回数据", res.data)
			},
			fail: (error) => {
				uni.$emit("messagePrompEmit", "close", null);
				console.log("requestStart error:", error, config['url']);
				Toast('网络错误:' + config['url']);

			}
		})
	},
	Post: function(configInf, processFunc) {
		configInf.method = "POST";
		var config = this.fillRequestData(configInf);
		if (!config || !(typeof processFunc == "function")) return;
		uni.request({
			...config,
			timeout: 30000,
			success: function(res) {
				if (res.statusCode != 200) {
					Toast('网络错误，数据获取失败' + config['url']);
					return;
				} else {
					if(res.code == HTTP.FAIL){
						Toast(res.message);
						return;
					}
					processFunc(res.data);
				}
				console.log("返回数据", res.data)
			},
			fail: (error) => {
				uni.$emit("messagePrompEmit", "close", null);
				console.log("requestStart error:", error, config['url']);
				Toast('网络错误:' + config['url']);

			}
		})
	}
}
var HTTP={
	SUCCESS:0,
	FAIL:999
}
Vue.prototype.$HTTP = HTTP;
export  {http,DLStorage,Toast,serverInfo};
