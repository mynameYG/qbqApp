<template>
	<view class="bg">
		<view class="my-nav whiteBg no-pb radius5">
			<view class="my-item flex flexmid arrow pl15" v-for="item in channelChild"  :key="item.id" @tap="navTo(item)">
				<text v-if="item.moduleCode == 'medicine'" class="iconfont icon-yiliaoweisheng"></text>
				<text v-if="item.moduleCode == 'service'" class="iconfont icon-tongzhigonggao"></text>
				<text v-if="item.channelCode == 'safeZcxc'" class="iconfont icon-dangjianzixun"></text>
				<text v-if="item.channelCode == 'safeHdkz'" class="iconfont icon-changdizhanshi"></text>
				<text v-if="item.channelCode == 'safeZccx'" class="iconfont icon-xinxigongkai"></text>
				<text v-if="item.channelCode == 'fzxc'" class="iconfont icon-tongzhigonggao"></text>
				<text class="my-text flex1">{{item.title}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return{
				channelCode:"",
				listCode:"",
				channelChild:[],
				channelId:"",
			}
		},
		onLoad(option){
			if(option.channelCode){
				this.channelCode = option.channelCode;
			}
			if(option.listCode){
				this.listCode = option.listCode;
			}
			if(option.channelId){
				this.channelId = option.channelId
			}
			if(option.pageName){
				uni.setNavigationBarTitle({
					title: option.pageName
				})
			}
			
		},
		mounted(){
			this.getChannelChildList();
		},
		methods:{
			getChannelChildList(){
				let url = "";
				if(this.channelId){
					url = `/mobile/party/channel/childChannelList/${this.channelId}`
				}else if(this.listCode){
					url = `/mobile/party/channel/childChannelListByCode/${this.listCode}`
				}else{
					url = `/mobile/party/channel/channelList/${this.channelCode}`
				}
				this.$http.get(url).then(res =>{
						// this.channelChild = res;
						this.channelChild = res;
					})
			},
			navTo(item){
				this.$http.get(`/mobile/party/channel/childChannelList/${item.id}`).then(res =>{
					if(res.length > 0){
						this.jump(`/PGov/pages/index/map-channelChild?pageName=${item.title}&channelId=${item.id}&channelCode=${item.channelCode}&listCode=${item.channelCode}`);
						return false;
					}
					if(item.outsideUrl){
						this.jumpWebPage(`outSideUrl&url=${item.outsideUrl}&title=${item.title}`);
					}else{
						this.jump(`/PGov/pages/index/medicine-list?pageName=${item.title}&channelId=${item.id}&currentChannel=${item.channelCode}`);
					}
				})
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
	.my-item:nth-child(6n+1) .iconfont{
		background-color: #F88799;
	}
	.my-item:nth-child(6n+2) .iconfont{
		background-color:#62C6FF;
	}
	.my-item:nth-child(6n+3) .iconfont{
		background-color:#CC9CFD;
	}
	.my-item:nth-child(6n+4) .iconfont{
		background-color:#7A7AEE;
	}
	.my-item:nth-child(6n+5) .iconfont{
		background-color:#28C689;
	}
	.my-item:nth-child(6n+6) .iconfont{
		background-color:#56D027;
	}
	.my-text{
	    font-size: 14px;
	    color:#333;
	    line-height: 26px;
	}

</style>
