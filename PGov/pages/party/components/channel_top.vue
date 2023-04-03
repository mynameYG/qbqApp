<template>
	<view>
		<view class="channel-banner" :style="{height:ImageHeight + 'px'}">
			<image :src="getBanner()"  @load="getImgHeight"></image>
		</view>
		<view class="index-nav-wrap">
			<view class="index-nav-box clearfix whiteBg">
				<view class="index-nav-item tc" :style="{width:100/lie + '%'}" v-for="(item,index) in channelList" :key="index" @tap="navTo(item)">
					<view class="index-nav-bg flex flexmid" :style="{background:item.colour , width:width + 'px' , height:width + 'px'}">
						<i class="iconfont flex1" :class="item.icon" ></i>
					</view>
					<view class="index-nav-text">{{item.title || item.name}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import channelUrlJson from '@/common/channel_Url.js'
	export default {
		props:{
			code:""
		},
		data() {
			return {
				ImageHeight:100,
				channelList: [],
				lie:"",//列数
				width:0,
			}
		},
		mounted(){
			console.log('channelUrlJson‘',this.code,channelUrlJson)
			this.channelList = channelUrlJson[this.code].childJson;
			let childLength = channelUrlJson[this.code].childJson.length;
			if(childLength < 6){
				this.lie = childLength;
			}else{
				this.lie = 5
			}
			const getSystemInfo = uni.getSystemInfoSync();
			this.width = (getSystemInfo.windowWidth / this.lie) * 0.5;
		},
		methods:{
			getImgHeight(e){
				let scale = e.detail.width/e.detail.height;
				const getSystemInfo = uni.getSystemInfoSync();
				let windowWidth = getSystemInfo.windowWidth;
				let windowHeight = Math.round((windowWidth - 30)/scale);
				if(windowHeight > this.ImageHeight){
					this.ImageHeight = windowHeight;
				}
			},
			//获取图片地址
			getBanner(){
				return require(`@/static/img/banner_${this.code}.png`);
			},
			navTo(item){
				console.log(item);
				this.jump(item.url)
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
		background-color:#56D027;
	}
	.my-text{
	    font-size: 14px;
	    color:#333;
	    line-height: 26px;
	}

</style>
