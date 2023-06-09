var mapJson ={
	mapCenter:[114.305077,35.747611],//地图中心点坐标
	mapZoom:15,//地图级别
	similarity:60,//百度地图搜索信息与采集信息对比度
	CircleRadius:['450','900','1350'],//画圈半径
	pageCapacity:100,//搜索结果数量
	searchNearbyRadius:2000,//搜索半径
	Maxdistance:1350,//页面显示结果最大距离
	mapType:'baidu',
	search_baidu_data: false,//是否查询百度数据
	map_dragend: true, //是否开启地图当前位置拖动
	clzJson:{//地图标注点类名
		"001":"school",//学校
		"002":"school",
		"003":"school",
		"006":"school",
		"004":"bus",
		"005":"bicycle",
		"007":"hospital",//医院
		"008":"clinic",//诊所
		"009":"communityS",//社区服务中心
		"010":"gov",//党政机关
		"011":"community",//社区
		"012":"village",//小区
		"013":"old",//社区日间照料中心
		"033":"old",//街道综合养老服务中心
		"014":"book",//淇河书屋
		"015":"love",//爱心驿站
		"016":"wc",//公厕
		"017":"view",//景区景点
		"018":"park",//公园游园
		"050":"park",//游园
		"019":"food",//餐饮
		"020":"stationery",//文具店
		"021":"cinema",//文具店
		"022":"internet",//网吧
		"023":"bar",//酒吧
		"024":"gym",//健身房
		"025":"drugstore",//药店
		"027":"repair",//修理店
		"028":"beautyworld",//美容美发
		"029":"hotel",//宾馆
		"030":"consume",//其他
		"031":"gov",//社区综合服务站
		"032":"wc"//社区综合服务站
	},
	typeJson:{
		"intserv":{
			code:"综",
			title:"综合服务圈"
		},
		"fitness":{
			code:"健",
			title:"全民健身圈"
		},
		"oldLife":{
			code:"养",
			title:"养老服务圈"
		},
		"health":{
			code:"医",
			title:"健康医疗圈"
		},
		"culture":{
			code:"文",
			title:"社区文化圈"
		},
		"school":{
			code:"学",
			title:"就学便利圈"
		},
		"green":{
			code:"出",
			title:"绿色出行圈"
		},
		"consume":{
			code:"便",
			title:"便捷消费圈"
		},
		"municipal":{
			code:"政",
			title:"市政提质圈"
		},
		"characteristic":{
			code:"特",
			title:"特色提质圈"
		}
	}
} ;