<template>
	<view class="bg">
		<view class="my-nav p15 whiteBg no-pb">
			<view class="my-item flex flexmid arrow" v-for="item in contList"  :key="item.id" @tap="navTo(item)">
				<text v-if="channelName == 'rzzd'" class="iconfont icon-wuyefei"></text>
				<text v-if="channelName == 'zwzd'" class="iconfont icon-xinxigongkai"></text>
				<text v-if="channelName.search('fwzd') !=-1 " class="iconfont icon-yonghuming"></text>
				<text class="my-text flex1">{{item.name}}</text>
			</view>
			<template v-if="channelName == 'zwzd'" >
				<view class="my-item pr15 flex flexmid arrow"
					@tap="jump(`/PGov/pages/index/map?pageName=淇水湾聆海御园社区“24小时政务自助服务站”&destinationLng=114.27988&destinationLat=35.699941&phone=15670082888&address=鹤壁市城乡一体化示范区淇水湾街道办事处恒大名都一期1号楼`)"
				>
					<text class="iconfont icon-ditu" ></text><text class="my-text flex1 text-ellipsis">淇水湾聆海御园社区“24小时政务自助服务站”</text>
				</view>	
				
				<view class="my-item pr15 flex flexmid arrow"
					@tap="jump(`/PGov/pages/index/map?pageName=古城博文社区“24小时政务自助服务站”&destinationLng=114.255466&destinationLat=35.687569&phone=18749187873&address=鹤壁市城乡一体化示范区古城街道办事处黄埔江路与韶山路交叉口向北200米`)"
				>
					<text class="iconfont icon-ditu"></text><text class="my-text flex1 text-ellipsis">古城博文社区“24小时政务自助服务站”</text>
				</view>	
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return{
				contList:[],
				channelId:"",
				channelName:""
			}
		},
		onLoad(option){
			this.channelId = option.channelId;
			this.channelName = option.channelName;
			if(option.pageName){
				uni.setNavigationBarTitle({
					title: option.pageName
				})
			}
		},
		mounted(){
			this.getContList();
		},
		methods:{
			getContList(){
				this.$http.get(`/mobile/business/zhida/channels/${this.channelId}`).then(res =>{
					this.contList = res;
				})
			},
			navTo(item){
				if(this.channelName =='fwzd'){
					this.$http.get(`/mobile/business/zhida/channels/${item.id}`).then(res =>{
						//this.contList = res;
						if(res.length > 1){
							this.jump(`/PBusiness/pages/service/business/business-contList?pageName=${item.name}&channelId=${item.id}&channelName=${item.permission}`);
							return false;
						}
						if(item.outsideUrl){
							this.jumpWebPage(`outSideUrl&url=${item.outsideUrl}&title=${item.name}`);
						}else{
							this.jump(`/PBusiness/pages/service/business/business-list?pageName=${item.name}&channelId=${item.id}&channelName=fwzd&currentChannel=${item.permission}`);
						}
					})
					return false
				}
				if(item.outsideUrl){
					this.jumpWebPage(`outSideUrl&url=${item.outsideUrl}&title=${item.name}`);
				}else{
					this.jump(`/PBusiness/pages/service/business/business-list?pageName=${item.name}&channelId=${item.id}&channelName=fwzd&currentChannel=${item.permission}`);
				}
			}
		}
	}
</script>

<style lang="scss">
	.my-item{
	    width: 100%;
	    padding: 12px 0;
		border-bottom: 1px solid #f8f8f8;
		.iconfont{
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
		background-color: #F88799;
	}
	.my-item:nth-child(2) .iconfont{
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
