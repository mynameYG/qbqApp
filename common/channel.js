import util from '@/util/util'
import store from '@/store'

var channel_json = {
	"xsdt":{
		code:"xsdt",
		title: '地图',
		fun:"reLaunch",
		url:"/pages/map/map"
	},
	'djzy':{
		code:"djzy",
		title: '党建志愿',
		fun:"jump",
		url:`/PGov/pages/party/party-index?code=djzy`
	},
	'qzgj':{
		code:"qzgj",
		title: '群智共建',
		fun:"jump",
		url:`/PGov/pages/party/party-index?code=qzgj`
	},
	'zbsh':{
		code:"zbsh",
		title: '周边生活',
		fun:"jump",
		url:"/PStore/pages/store/store-index"
	},
	'sqfw':{
		code:"sqfw",
		title: '社区服务',
		fun:"reLaunch",
		url:"/pages/service/service-index?code=sqfw"
	},
	'wyfw':{
		code:"wyfw",
		verify: ['login', 'yezhu'],
		title: '物业服务',
		fun:"jump",
		url:'/PProperty/pages/service/property'
	},
	'xwxc':{
		code:"xwxc",
		title: '新闻宣传',
		fun:"jump",
		url:""
	},
	"wmsf":{
		code:"wmsf",
		title: '文明示范',
		fun:"jump",
		url:"/PBusiness/pages/service/voluntary/voluntary-index"
	},
	"zmnpk":{
		code:"zmnpk",
		title: '啄木鸟拍客',
		fun:"jump",
		url:"/PProperty/pages/service/clapper-index"
	},
	"jsyy":{
		code:"jsyy",
		title: '健身预约',
		fun:"jump",
		url:"/PGov/pages/fitness/fitness-index"
	},
	"tzgg":{
		code:"tzgg",
		title: '通知公告',
		fun:"jump",
		url:"/PGov/pages/notice/notice-index"
	},
	"zwfw":{
		code:"zwfw",
		title: '政务服务',
		fun:"jump",
		url:""
	},
	"dtdt":{
		code:"dtdt",
		title: '动态地图',
		fun:"jump",
		url:"/pages/map/newMap"
	}
}

var verify_config = {
	login(channel){
		// 校验是否登录
		if(store.state.hasLogin){
			return true;
		}else{
			// 跳转登录页
			util.jump('/PProperty/pages/login/login')
			return false;
		}
		
	},
	yezhu(channel){
		let userType = store.state.user.ext.proprietor;
		if(userType){
			return true;
		}
		uni.showModal({
			title: '提示',
			content: '请填写业主信息',
			success: function (res) {
				if (res.confirm) {
					console.log('用户点击确定');
					util.jump('/PProperty/pages/my/my-info')
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
		return false;
		
		
		
		
	/* 	let userType = store.state.user.ext.type;
		if(userType && userType.value == 'proprietor'){
			return true;
		}
		uni.showToast({
			title: '此功能只针对业主开放',
			icon: 'none'
		});
		return false; */
	},
	
}

var channel = { 
	render(c){
		this[c.type.value](c);
	},
	// 指定功能处理
	appoint(c){
		console.log(c)
		let code = c.appointAbility && c.appointAbility.code;
		if(code == 'develop'){
			util.tips();
			return true;
		}
		var json = channel_json[code];
		if(!json){
			// TODO 后台配置栏目未开发
			console.log('后台配置栏目未开发')
			util.tips();
			return false;
		}
		
		if(json.verify){
			for(var v of json.verify){
				if(!verify_config[v](json)){
					return false;
				}
			}
		}
		switch(json.fun){
			case 'jump':
				if(!json.url){
					util.tips();
					return false
				}
				util.jump(`${json.url}?channelIcon=${c.icon}&functionParam=${c.functionParam}&name=${c.name}`);
				break;
			case 'reLaunch':
				util.reLaunch(json.url);
				break;
			default:
				// TODO 
		}
		return true;
	},
	// 文章发布
	article(c){
		console.log('c',c)
		if(c.childrenChannel){
			util.jump(`/PBusiness/pages/service/articleModel/articleModel-channel-${c.channelStyle.code}?pageName=${c.name}&channelId=${c.id}&childrenChannel=${c.childrenChannel}&channelIcon=${c.icon}`)
		}else{
			util.jump(`/PBusiness/pages/service/articleModel/articleModel-infoList-s?pageName=${c.name}&channelId=${c.id}&childrenChannel=${c.childrenChannel}&channelIcon=${c.icon}`)
		}
	},
	// 链接跳转
	url(c){
		// 判断 链接地址是否存在
		if(c.outsideUrl){
			util.jumpWebPage(`outSideUrl&url=${c.outsideUrl}&title=${c.name}`)
		}
	},
	// 栏目单页
	one_page(c){
		if(c.outsideUrl){
			util.jumpWebPage(`outSideUrl&url=${c.outsideUrl}&title=${c.name}`)
		}else{
			util.jump(`/PBusiness/pages/service/articleModel/articleModel-detail?pageName=${c.name}&id=${c.id}`)
		}
	}
}

export default channel;