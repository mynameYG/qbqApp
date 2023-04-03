<template>
	<view class="bg p15 channelPage">
		<channelTop :code="code"></channelTop>
		<view v-for="(item,index) in channelList" :key="index" v-if="index < 2"  class="news-model mb15 p15 whiteBg">
			<view class="news-title">{{item.title || item.name}}</view>
			<view class="news-list">
				<template v-if="index == 0">
					<template v-if="OneList.length > 0" >
						<view v-for="(child,i) in OneList" :key="child.id" v-if="i < 2"
							@tap="navToDetail(child,index)"
						class="news-list-item text-ellipsis arrow">{{child.name || child.title}}</view>
						<view class="more" @tap="jump(item.url)">查看更多</view>
					</template>
					<view class="emptyText" v-else>暂无内容</view>
				</template>
				<template v-if="index == 1">
					<template v-if="TwoList.length > 0" >
						<view v-for="(child,i)  in TwoList" :key="child.id" v-if="i < 2"
						@tap="navToDetail(child,index)"
						class="news-list-item text-ellipsis arrow">{{child.name || child.title}}</view>
						<view class="more" @tap="jump(item.url)">查看更多</view>
					</template>
					<view class="emptyText" v-else>暂无内容</view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	import channelUrlJson from '@/common/channel_Url.js'
	import channelTop from './components/channel_top.vue'
	export default {
		components:{
			channelTop
		},
		data() {
			return {
				code:"",
				channelList: [],
				OneList:[],
				TwoList:[],
				imei:""
			}
		},
		onLoad(option){
			this.code = option.code.split('?')[0];
			if(this.code == 'qzgj'){
				uni.setNavigationBarTitle({
					title:"群智共建"
				})
			}
			if(this.code == 'wyfw'){
				uni.setNavigationBarTitle({
					title:"物业服务"
				})
			}
		},
		watch:{
			/* channelList: {
			  handler (val) {
				console.log('深度监听：', val);
			  },
			  deep: true
			} */
		},
		mounted(){
			// #ifdef MP-WEIXIN
			this.getWxCode().then(data =>{
				console.log('data-----',data)
				this.imei = data.code
				uni.setStorageSync('vinfo', data.code);
				this.refresh();
			})
			// #endif
			// #ifdef APP-PLUS
			var info = plus.push.getClientInfo();
			var vinfo = info.clientid;
			uni.setStorageSync('vinfo', vinfo);
			this.imei = vinfo;
			/* plus.nativeUI.toast("info.clientid" + plus.push.getClientInfo().clientid); */
			// #endif
			
			this.channelList = channelUrlJson[this.code].childJson;
			this.getOneList();
			this.getTwoList();
		},
		methods:{
			getOneList(){
				let json = {
					'djzy':'/mobile/party/org/orgList',
					'qzgj':"/mobile/event/list",
					'wyfw':"/mobile/tenement/content/channels"
				}
				this.$http.get(json[this.code]).then(res =>{
					if(this.code == 'wyfw'){
						console.log('===',res[0].id)
						let channelId = res[0].id;
						this.$http.get(`/mobile/tenement/content/${channelId}`).then(res =>{
							console.log('---res',res)
							this.OneList = res.list;
						})
					}else{
						if(res.list){
							this.OneList = res.list;
						}else{
							this.OneList = res;
						}
					}
					console.log('this.OneList',this.OneList)
				})
			},
			getTwoList(){
				let json = {
					'djzy':'/mobile/party/benefit/activityList',
					'qzgj':`/mobile/popularWill/infoList?imei=${this.imei}`,
					'wyfw':"/mobile/tenement/repair/list"
				}
				this.$http.get(json[this.code]).then(res =>{
					if(res.list){
						this.TwoList = res.list;
					}else{
						this.TwoList = res;
					}
					console.log('this.TwoList',this.TwoList)
				})
			},
			navToDetail(item,index){
				let json = {
					'djzy':{
						//0 : `/PBusiness/pages/service/partyOrg/partyOrg?pageName=社区党群&mapCenter=${this.$config.mapCenter}&destinationLat=${item.latitude}&destinationLng=${item.longitude}&address=${item.address}&phone=${item.phone}`,
						0 : `/PStore/pages/store/party-detail?id=${item.id}&pageName=${item.name}`,
						1 : `/PBusiness/pages/service/activity/activity-detail?id=${item.id}`,
					},
					'qzgj':{
						0 : `/PProperty/pages/service/clapper-detail?id=${item.id}`,
						1 : `/PGov/pages/popularWill/popularWill-detail?id=${item.id}`,
					},
					'wyfw':{
						0 : `/PProperty/pages/service/property-zs-detail?id=${item.id}`,
						1 : `/PProperty/pages/service/repair-detail?id=${item.id}`,
					}
				}
				this.jump(json[this.code][index])
			}
			/* getList(item){
				let urlJson = {
					'sqdq':'/mobile/party/org/orgList',
					'gyhd':"/mobile/party/benefit/activityList"
				}
				this.channelList.forEach((item,index) =>{
					console.log('item',item)
					item.list = [];
					if(index < 2){
						this.$http.get(urlJson[item.code]).then(res =>{
							console.log('res',res)
							if(res.list && res.list.length > 0){
								item.list = res.list;
							}else{
								item.list = res;
							}
							this.SqdqList = res;
						})
					}
				})
			} */
		}

	}
</script>

<style lang="scss">
	.my-item{
	    width: 100%;
	    padding: 12px 0;
		border-bottom: 1px solid #f8f8f8;
		.iconfont{
			font-size: 18px;
			margin-right: 10px;
			width: 30px;
			height: 30px;
			line-height: 30px;
			text-align: center;
			border-radius: 50%;
			color:#fff;
		}
		&:last-child{
			border-bottom: 0;
		}
	}
	.my-item:nth-child(1) .iconfont{
		font-size: 16px;
		background-color: #F88799;
	}
	.my-item:nth-child(2) .iconfont{
		font-size: 16px;
		background-color:#62C6FF;
	}
	.my-item:nth-child(3) .iconfont{
		background-color:#CC9CFD;
	}
	.my-item:nth-child(4) .iconfont{
		background-color:#7A7AEE;
	}
	.my-item:nth-child(5) .iconfont{
		background-color:#28C689;
	}
	.my-item:nth-child(6) .iconfont{
		background-color:#56D027;
	}
	.my-text{
	    font-size: 14px;
	    color:#333;
	    line-height: 26px;
	}

</style>
