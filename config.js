const config = {}

const initConfig = function() {
	config.serverHost = '';
	config.contextPath = contextPath;
	// #ifdef APP-PLUS
	config.serverHost = server_app;
	// #endif
	// #ifdef MP-WEIXIN
	config.serverHost = server_weixin;
	// #endif
	if(process.env.NODE_ENV === 'development'){
		// #ifdef H5
		config.serverHost = '';
		// #endif
		// #ifndef H5
		config.serverHost = server_test;
		// #endif
	}
}

config.init = initConfig;
const server_app = "http://36.133.213.162:18090";
// const server_app = "http://192.168.20.106:8080";
// const server_weixin = "https://www.hbsfqshq.cn";
const server_weixin = "https://qbq.hbsfqshq.cn";

// const ip = "192.168.20.106:8080";
// const port = "8081";
// const server_test = "https://sfqshq.adzjq.com";
const server_test = "http://36.133.213.162:18090";
config.debug = false;//测试数据
const contextPath = "";

initConfig();

// url处理
config.url = function(url){
	if(url.substr(0, 4) === 'http'){
		return url;
	}
	return `${config.serverHost}${config.contextPath}${url}`;
}
// 页面登录地址
config.loginUrl = '/PProperty/pages/login/login';

config.longitude = 114.305077;
config.latitude = 35.747611;

config.mapCenter = [config.longitude,config.latitude];

// #ifdef APP-PLUS || H5
config.mapType = 'baidu';
config.source = 'app';
//#endif
// #ifdef MP-WEIXIN
config.mapType = 'tencent';
config.source = 'webchat';
// #endif
config.projectName = '淇滨区一刻钟(15分钟)生活圈'
export default config