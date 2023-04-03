<template>
	<view class=" bg">
		<view class="shop-banner" v-if="info.url">
			<image class="shop-banner-img" :src="fileUrl(info.url)"  mode="center">
		</view>
		<view class="shop-header">
			<view class="shop-header-inner flex">
				<view class="shop-logo" v-if="info.url">
					<image :src="fileUrl(info.url)" alt="">
				</view>
				<view class="shop-body flex1">
					<h3 class="shop-name text-ellipsis">{{info.title||""}}</h3>
					<view class="text-ellipsis">{{info.phone}}</view>
					<view class="address text-ellipsis">{{info.address}}</view>
					<!-- <view class="shop-score flex flexmid clearfix">
						<span class="icon-stars icon-xing-s"></span>
						<span class="icon-stars icon-xing-s"></span>
						<span class="icon-stars icon-xing-s"></span>
						<span class="icon-stars icon-xing-s"></span>
						<span class="icon-stars icon-xing-k"></span>
						<span class="coupon-btn" @tap="coupon">领取优惠券</span>
					</view> -->
				</view>
				<view class="daohang" @tap="toMap">
					<image  class="icon" :src="getImgDaohang()"  alt="">
				</view>
			</view>
		</view>
		
		<!--基本信息-->
		<view class="shop-info">
			<view class="shop-info-inner">
				<view class="shop-module-title">
					<i class="icon"></i>
					基本信息
				</view>
				<view class="shop-info-body">
					<jyf-parser v-if="info.detail" class="art-con" :html="info.detail" :domain="fileUrl('/r')"></jyf-parser>
					<view class="color999" v-else>暂无内容</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:"",
				info:{},
				imei:"",
				url:{}
			}
		},
		onLoad(option) {
			this.id = option.id;
			if(option.pageName){
				uni.setNavigationBarTitle({
					title: option.pageName
				})
			}
		},
		mounted(){
			// #ifdef APP-PLUS
			var info = plus.push.getClientInfo();
			var vinfo = info.clientid;
			uni.setStorageSync('vinfo', vinfo);
			this.imei = vinfo;
			console.log('vinfo'+this.imei)
			// #endif
			// #ifdef MP-WEIXIN
			this.getWxCode().then(data =>{
				uni.setStorageSync('vinfo', data.code);
				this.imei = data.code;
				console.log('this.imei----'+this.imei)
			})
			// #endif
			this.getInfo();
		},
		methods:{
			getImgDaohang(){
				return require("@/static/img/store-location.png");
			},
			coupon(){
				this.$refs.popup.init();
			},
			getInfo(){
				this.$http.get(`/mobile/party/org/orgDetail/${this.id}`).then(res =>{
					this.info = res;
					console.log(this.info);
				})
			},
			toMap(){
				//跳转到地图页
				this.jump(`/PGov/pages/index/map?pageName=${this.info.name}
				&destinationLat=${this.info.latitude}&destinationLng=${this.info.longitude}
				&address=${this.info.address || ''}&phone=${this.info.phone || ''}`)
			}
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/static/css/store.scss';
	.shop-logo{
		margin-right: 20upx;
		width: 200upx;
		height: 150upx;
	}
	.shop-header{
		.shop-body{
			view{
				min-height: 40upx;
				}
		}
		.shop-name{
			margin-bottom: 10upx;
		}
		.address{
			margin-top: 10upx;
			padding-right: 70upx;
		}
	}
	.daohang{
		position: absolute;
		// top:50%;
		bottom:20upx;
		right:50upx;
		// transform: translateY(-50%);
		.icon{
			width: 60upx;
			height: 60upx;
			vertical-align: -0.15em;
			fill: currentColor;
			overflow: hidden;
		}
	}
.shop-nav{
	padding:30upx 0;
	margin-bottom: 0;
	position: fixed;
	bottom:0;
	width: 100%;
	box-shadow: 0 0 6px #e4e4e4;
	.shop-nav-item{
		text{
			box-sizing: content-box;
			display: inline-block;
			padding:12upx 0;
			color:#fff;
			border-radius: 10upx;
			overflow: hidden;
			min-width: 144upx;
		}
		&:nth-child(3n+1){
			text{
				background-color:#5ACAA2;
			}
		}
		&:nth-child(3n+2){
			text{
				background-color:#FFBC11;
			}
		}
		&:nth-child(3n+3){
			text{
				background-color:#F07870;
			}
		}
	}
}
.shop-info{
	padding-bottom: 200upx;
}
</style>
