var channel_UrlJson = {
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
		url:"/PGov/pages/party/party-index",
		childJson:[
			{
				code:"sqdq",
				title: '社区党群',
				fun:"jump",
				icon:"icon-shequ1",
				colour:"linear-gradient(to bottom, #FFB934 0, #FFAA33 100%)",
				url:"/PBusiness/pages/service/partyOrg/partyOrg?pageName=社区党群"
			},
			{
				code:"gyhd",
				title: '公益活动',
				fun:"jump",
				icon:"icon-gongyihuodong",
				colour:"linear-gradient(to bottom, #FE442B 0, #FC3425 100%)",
				url:"/PBusiness/pages/service/activity/activity-list?pageName=公益活动"
			},
			{
				code:"zyfw",
				title: '志愿服务',
				fun:"jump",
				icon:"icon-wenjuantiaocha",
				colour:"linear-gradient(to bottom, #5FEAFE 0, #2AB3FC 100%)",
				url:`/PBusiness/pages/service/voluntary/voluntary`
			},
			{
				code:"dyxf",
				title: '党员先锋',
				fun:"jump",
				icon:"icon-dangjianzixun",
				colour:"linear-gradient(to bottom, #FC3964 0, #F82B53 100%)",
				url:`/PBusiness/pages/service/voluntary/voluntary-people?channelCode=service&listCode=sbhr&pageName=党员先锋`
			}
		]
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
		url:"/pages/service/service-index?code=sqfw",
		childJson:[
			{
				code:"zwfw",
				title: '政务服务',
				fun:"jump",
				icon:"icon-tongzhigonggao",
				colour:"#FFEFF3",
				url:`/PGov/pages/party/gov-index?code=zwfw`
			},
			{
				code:"wyfw",
				verify: ['login', 'yezhu'],
				title: '物业服务',
				fun:"jump",
				icon:"icon-tongzhigonggao",
				colour:"#FFF7EB",
				url:`/PGov/pages/party/party-index?code=wyfw`
			},
			{
				code:"jzfw",
				title: '家政服务',
				fun:"webPage",
				icon:"icon-tongzhigonggao",
				colour:"#FAF1FC",
				url:`http://hb.xiaolintong.net.cn/index`
			},
			{
				code:"zhqb",
				title: '智汇淇滨',
				fun:"WEIXIN",
				icon:"icon-tongzhigonggao",
				colour:"#FFF7EB",
				url:``
			}
		]
		
	},
	'qzgj':{
		code:"qzgj",
		title: '群智共建',
		fun:"jump",
		url:`/PGov/pages/party/party-index?code=qzgj`,
		childJson:[
			{
				code:"sqpk",
				title: '社区拍客',
				fun:"jump",
				icon:"icon-tongzhigonggao",
				colour:"linear-gradient(to bottom, #FFB934 0, #FFAA33 100%)",
				url:`/PProperty/pages/service/clapper-index?pageName=社区拍客`
			},
			{
				code:"sqmy",
				title: '社情民意',
				fun:"jump",
				icon:"icon-sheqing",
				colour:"linear-gradient(to bottom, #FE442B 0, #FC3425 100%)",
				url:"/PGov/pages/popularWill/popularWill-list?pageName=社情民意"
			},
			{
				code:"wjdc",
				title: '问卷调查',
				fun:"jump",
				icon:"icon-wenjuantiaocha",
				colour:"linear-gradient(to bottom, #5FEAFE 0, #2AB3FC 100%)",
				// url:""
				url:"/PGov/pages/survey/survey-list"
			},
			{
				code:"zxtp",
				title: '在线投票',
				fun:"jump",
				icon:"icon-dangjianzixun",
				colour:"linear-gradient(to bottom, #FC3964 0, #F82B53 100%)",
				url:`/PProperty/pages/service/vote`
			}
		]
	},
	'wyfw':{
		code:"wyfw",
		verify: ['login', 'yezhu'],
		title: '物业服务',
		fun:"jump",
		url:'/PGov/pages/party/party-index?code=wyfw',
		childJson:[
			{
				code:"wyzs",
				title: '物业展示',
				fun:"jump",
				icon:"icon-tongzhigonggao",
				colour:"linear-gradient(to bottom, #FFB934 0, #FFAA33 100%)",
				url:`/PProperty/pages/service/property-zs-index`
			},
			{
				code:"zxbx",
				title: '在线报修',
				fun:"jump",
				icon:"icon-anzhuang",
				colour:"linear-gradient(to bottom, #FE442B 0, #FC3425 100%)",
				url:`/PProperty/pages/service/repair-index`
			},
			{
				code:"yjfk",
				title: '意见反馈',
				fun:"WEIXIN",
				icon:"icon-dangjianzixun",
				colour:"linear-gradient(to bottom, #FC3964 0, #F82B53 100%)",
				url:`/PProperty/pages/service/feedback-index`
			}
		]
	},
	'zwfw':{
		code:"zwfw",
		title: '政务服务',
		fun:"jump",
		url:'/PGov/pages/party/gov-index?code=zwfw',
		childJson:[
			{
				code:"ms",
				title: '民生',
				fun:"jump",
				icon:"icon-bianminfuwu",
				colour:"linear-gradient(to bottom, #FFB934 0, #FFAA33 100%)",
				url:`/PProperty/pages/service/property-zs-index`
			},
			{
				code:"mz",
				title: '民政',
				fun:"jump",
				icon:"icon-zhengwufuwuban-",
				colour:"linear-gradient(to bottom, #FE442B 0, #FC3425 100%)",
				url:`/PProperty/pages/service/repair-index`
			}
		]
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
	}	
}

export default channel_UrlJson;