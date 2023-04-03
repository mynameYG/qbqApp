<template>
	<view class="bg">
		<template  v-if="channelList.length > 0" >
			<view class="my-nav p15 whiteBg no-pb">
				<view class="my-item flex flexmid arrow"  v-for="item in channelList" :key="item.id" @tap="navTo(item)">
					<text class="iconfont" :class="channelIcon"></text>
					<text class="my-text flex1">{{item.name}}</text>
				</view>
			</view>
		</template>
		<template v-else>
			<view class="emptyPage">
				<view class="img"></view>
				<view>暂无内容，去其他页面看看吧</view>
			</view>
		</template>
	</view>
</template>

<script>
	import channel from '@/common/channel.js'
	export default {
		data(){
			return {
				channelList:[],
				channelId:"",
				channelIcon:"",
				childrenChannel:false
			}
		},
		onLoad(option) {
			this.channelId = option.channelId;
			this.childrenChannel = option.childrenChannel;
			if(option.channelIcon){
				this.channelIcon = option.channelIcon
			}
			if(option.pageName){
				uni.setNavigationBarTitle({
					title: option.pageName
				})
			}
		},
		mounted(){
			this.getChannel();
		},
		methods:{
			getChannel(){
				if(this.childrenChannel){
					this.$http.get(`/mobile/channel/info/channels/${this.channelId}`).then(res => {
						console.log('ra',res)
						this.channelList = res;
					})
				}
			},
			navTo(item){
				console.log('item',item)
				channel.render(item)
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
		background-color:#4D8CF4;
	}
	.my-text{
	    font-size: 14px;
	    color:#333;
	    line-height: 26px;
	}

</style>
