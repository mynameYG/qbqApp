module.exports ={
    "list": [
		{
		    "letter": "政务公开",
		    "data": [
				{
					icon: 'icon-xinxigongkai',
					title: '机构概况',
					url: `/PGov/pages/gov/survey-detail?pageName=机构概况`
				}
				,{
					icon: 'icon-jigoushezhi',
					title: '机构设置',
					url: `/PGov/pages/gov/gov-list?channelName=jgsz&pageName=机构设置`
				},
				{
					icon: 'icon-wuyezhanshi',
					type:'webPage',
					title: '河南政务服务网',
					url: `hnzwfw`
				},
				{
					icon: 'icon-wuyezhanshi',
					type:'webPage',
					title: "示范区官方网站",
					url: `sfqgw`
				}
		    ]
		},
		{
		    "letter": "营商环境",
		    "data": [
				{
					icon: 'icon-xinxigongkai',
					title: '带您学条例',
					url: '/PBusiness/pages/service/business/business-channelList?channelName=busTiaoli&pageName=带您学条例'
				},{
					icon: 'icon-dangjianzixun',
					title: '带您看环境',
					url: '/PBusiness/pages/service/business/business-list?channelName=busHuanjing&pageName=带您看环境'
				},{
					icon: 'icon-shoucang-copy',
					title: '带您助万企',
					url: '/PBusiness/pages/service/business/business-company?pageName=带您助万企'
				}
		    ]
		},
		{
		    "letter": "党群服务",
		    "data": [
				{
					icon: 'icon-dangjianzhendi',
					title: '基层建党',
					url: '/PBusiness/pages/service/infoModel/infoModel-channel?channelCode=party&pageName=基层建党'
				},{
					icon: 'icon-dangzuzhi',
					title: '党组织',
					url: '/PBusiness/pages/service/partyOrg/partyOrg'
				},{
					icon: 'icon-dangyuanxianfenggang',
					title: '党员先锋岗',
					url: '/PBusiness/pages/service/partyOrg/partyPioneer'
				},{
					icon: 'icon-zhiyuanfuwu',
					title: '文明示范',
					url: '/PBusiness/pages/service/voluntary/voluntary-index'
				},{
					icon: 'icon-dangjianweixinyuan',
					title: '党建微心愿',
					url: '/PBusiness/pages/service/partyOrg/partyWish'
				}
		    ]
		}, 
		{
		    "letter": "平安建设",
		    "data": [
				{
					icon: 'icon-tongzhigonggao',
					title: '法制宣传',
					url: '/PGov/pages/index/map-channelChild?pageName=法制宣传&channelCode=safe&listCode=fzxc'
				},
				{
					icon: 'icon-dangjianzixun',
					title: '政策宣传',
					url: '/PGov/pages/index/medicine-list?pageName=政策宣传&channelCode=safe&listCode=safeZcxc'
				},{
					icon: 'icon-changdizhanshi',
					title: '活动开展',
					url: `/PGov/pages/index/medicine-list?pageName=活动开展&channelCode=safe&listCode=safeHdkz`
				},{
					icon: 'icon-xinxigongkai',
					title: '创建成效',
					url: '/PGov/pages/index/medicine-list?pageName=创建成效&channelCode=safe&listCode=safeZccx'
				}/* ,{
					icon: 'icon-xuexiqiangguo',
					title: '学习强国',
					url: ''
				} */
		    ]
		},
		{
        "letter": "物业服务",
        "data": [
			{
				icon: 'icon-wuyezhanshi',
				title: '物业展示',
				url: '/PProperty/pages/service/property-zs-index'
			},{
				icon: 'icon-zaixianbaoxiu',
				title: '在线报修',
				url: '/PProperty/pages/service/repair-index'
			},{
				icon: 'icon-wuyefei',
				title: '物业费',
				url: '/PProperty/pages/service/property-cost'
			},{
				icon: 'icon-zaixiantoupiao',
				title: '在线投票',
				url: '/PProperty/pages/service/vote'
			},{
				icon: 'icon-yijianfankui',
				title: '意见反馈',
				url: '/PProperty/pages/service/feedback-index'
			}
        ]
    }, {
        "letter": "啄木鸟拍客",
        "data": [
			{
				icon: 'icon-suishoupai',
				title: '随手拍',
				url: '/PProperty/pages/service/clapper-area'
			},{
				icon: 'icon-wodejifen',
				title: '我的积分',
				url: '/PProperty/pages/service/my-integral'
			}
		/* 	{
				icon: 'icon-jifenduihuan',
				title: '积分兑换',
				url: ''
			} */
        ]
    },
	{
	    "letter": "健身预约",
	    "data": [
			{
				icon: 'icon-changdizhanshi',
				title: '场地展示',
				url: '/PGov/pages/fitness/fitness-index'
			},{
				icon: 'icon-changdiyuyue',
				title: '场地预约',
				url: '/PGov/pages/fitness/fitness-list'
			}
	    ]
	}, {
	    "letter": "健康养老",
	    "data": [
			{
				icon: 'icon-yanglaojigou',
				title: '养老机构',
				url: `/PGov/pages/index/mapChannel?pageName=健康养老&type=oldLife`
			}
	    ]
	}, {
	    "letter": "全民健身",
	    "data": [
			{
				icon: 'icon-quanminjianshen',
				title: '全民健身',
				url: `/PGov/pages/index/mapChannel?type=fitness&pageName=全民健身`
			}
		]
	},{
	    "letter": "绿色出行",
	    "data": [
			{
				icon: 'icon-lvsechuhang',
				title: '绿色出行',
				url: `/PGov/pages/index/mapChannel?pageName=绿色出行&type=green`
			}
		]
	},
	{
	    "letter": "医疗卫生",
	    "data": [
			{
				icon: 'icon-yiliaoweisheng',
				title: '医疗卫生',
				url: `/PGov/pages/index/mapChannel?pageName=医疗卫生&type=health`
			}
		]
	},{
	    "letter": "教育教学",
	    "data": [
			{
				icon: 'icon-jiaoyujiaoxue',
				title: '教育教学',
				url: `/PGov/pages/index/mapChannel?type=school&pageName=教育教学`
			}
		]
	},{
	    "letter": "便捷消费",
	    "data": [
			{
				icon: 'icon-bianjiexiaofei',
				title: '便捷消费',
				url:  `/PGov/pages/index/mapChannel?type=consume&pageName=便捷消费`
			}
		]
	},
	{
	    "letter": "信用示范",
	    "data": [
	        {
	        	icon: 'icon-xinxigongkai',
	        	title: '信用条例',
	        	url: '/PBusiness/pages/service/credit/credit-list?channelCode=credit&listCode=xytl'
	        },
			{
				icon: 'icon-dangjianzixun',
				title: '诚信示范区',
				url: '/PBusiness/pages/service/credit/credit-list?channelCode=credit&listCode=cxsfq&pageName=诚信示范区'
			},
			{
				icon: 'icon-hangzhengxuke',
				title: '信易+',
				url: '/PBusiness/pages/service/credit/credit-channel?pageName=信易+'
			},
			{
				icon: 'icon-bianjiexiaofei',
				title: '联合奖惩',
				url: '/PBusiness/pages/service/credit/credit-list?channelCode=credit&listCode=lhjc&pageName=联合奖惩'
			}
	    ]
	},
	{
        "letter": "通知公告",
        "data": [
            {
            	icon: 'icon-tongzhigonggao',
            	title: '通知公告',
            	url: '/PGov/pages/notice/notice-index'
            }
        ]
    } ]
}
