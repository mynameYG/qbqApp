<template>
	<view class="bg" :class="info.type && info.type.flag == 'tips'? 'store-detail-wrap' : ''">
		<view class="shop-banner" v-if="info.url">
			<image class="shop-banner-img" :src="fileUrl(info.url)"  mode="center">
		</view>
		<view class="shop-header">
			<view class="shop-header-inner flex">
				<view class="shop-logo" v-if="info.url">
					<image :src="fileUrl(info.url)" alt="">
				</view>
				<view class="shop-body flex1">
					<h3 class="shop-name text-ellipsis" :class="curTypeCode == 'consume' ? 'text-ellipsis-2':''" :style="curTypeCode == 'consume' ? 'padding-right:130upx':''">{{info.title||""}}</h3>
					<view class="text-ellipsis">{{info.phone}}</view>
					<view class="address text-ellipsis">{{info.address}}</view>
					<!-- <view class="shop-score flex flexmid clearfix">
						<span class="icon-stars icon-xing-s"></span>
						<span class="icon-stars icon-xing-s"></span>
						<span class="icon-stars icon-xing-s"></span>
						<span class="icon-stars icon-xing-s"></span>
						<span class="icon-stars icon-xing-k"></span>
					</view> -->
					<span v-if="curTypeCode == 'consume'" class="coupon-btn" @tap="coupon">领取优惠券</span>
				</view>
				<view class="daohang" @tap="toMap">
					<image  class="icon" :src="getImgDaohang()"  alt="">
				</view>
			</view>
		</view>
		<!-- 淇河书屋 -->
		<bookList v-if="curTypeCode == '014'" :detailId="id"></bookList>
		<!--基本信息-->
		<view class="shop-info mb15">
			<view class="shop-info-inner">
				<view class="shop-module-title">
					<i class="icon"></i>
					基本信息
				</view>
				<view class="shop-info-body">
					<jyf-parser v-if="info.detail" class="art-con" :html="info.detail" :domain="fileUrl('/r')"></jyf-parser>
					<view class="color999" v-else>暂无内容</view>
					<!-- <view v-if="info.detail" class="more">查看更多</view> -->
				</view>
			</view>
		</view>
		<!-- 013 社区日间照料中心 -->
		<yuyueList v-if="curTypeCode == '013'" :List='yuyueList' :detailId="id"></yuyueList>
		
		<view class="shop-nav module-box" v-if="info.type && info.type.flag == 'tips'">
			<view class="shop-nav-item" @tap="tips">
				<text>评价</text>
			</view>
			<view class="shop-nav-item" @tap="tips">
				<text>投诉</text>
			</view>
			<view class="shop-nav-item" @tap="tips">
				<text>百姓心声</text>
			</view>
		</view>
		
		<popupCoupon ref="popup" :detailId="id"></popupCoupon>
		
		<!-- 009社区卫生服务中心 -->
		<view v-if="curTypeCode == '009'" class="fixed-btn">
			<view class="btn-item">
				<view class="inner" @tap="weixin('gh_9b27b9853f2e')" ><text>核酸<br>预约</text></view>
			</view>
			<view class="btn-item">
				<view class="inner">
					<text>体检<br>预约</text>
				</view>
			</view>
			<view class="btn-item">
				<view class="inner"><text>接种<br>预约</text></view>
			</view>
			<view class="btn-item">
				<view class="inner"><text>孕检<br>预约</text></view>
			</view>
			<view class="btn-item">
				<view class="inner"><text>康复<br>预约</text></view>
			</view>
		</view>
		
		
		<!-- 淇河书屋 -->
		<view  v-if="curTypeCode == '014'"  @tap="weixin('gh_68e1a9c909c8')" class="fixed-btn-rightBottom" style="line-height:1.2;padding-top:10px">
			<view>书香<br>淇滨</view>
		</view>
	</view>
</template>

<script>
	import popupCoupon from "../../components/popupCoupon.vue"
	import yuyueList  from '../../components/yuyueList.vue'
	import bookList  from '../../components/bookList.vue'
	export default {
		components:{
			popupCoupon,
			yuyueList,
			bookList
		},
		data() {
			return {
				id:"",
				info:{},
				imei:"",
				url:{},
				curTypeCode:"",//当前typecode
				yuyueList:[{
					title:"床位预约"
				}
				],
				
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
		onNavigationBarButtonTap(e) {
			/* uni.navigateTo({
				url:`fitness-occupancy?manage=false&id=${this.id}`
			}) */
			this.follow();
			
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
			//获取图片地址
			getImgDaohang(){
				return require("@/static/img/store-location.png");
			},
			follow(){
				if(process.env.NODE_ENV === 'development'){
					this.imei = '5659d16f2a842deb31a77930aa8419bf';
				}
				let routes = getCurrentPages() //获取当前页面栈
				let curRoute = routes[routes.length - 1].route; //获取当前页面的路由
				console.log('routes' , routes,curRoute)
				
				this.url = curRoute;
				let _self = this;
				this.$http.get(`/mobile/follow/isFollow?id=${this.id}&imei=${this.imei}`).then(res =>{
					if(res == 0){
						uni.showModal({
							title: '提示',
							content: '是否确定关注',
							success: function (res) {
								if (res.confirm) {
									console.log('用户点击确定');
									let params = {
										infoId:_self.info.id,
										title:_self.info.title,
										url:_self.url,
										imei:_self.imei
									}
									_self.$http.post(`/mobile/follow/followData`, params).then(res =>{
										uni.showToast({title: "关注成功",icon: 'none'});
									})
									
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						});
					}else{
						uni.showToast({
							icon:"none",
							title:"已关注"
						})
					}
				})
			},
			//获取图片地址
			getImgDaohang(){
				return require("@/static/img/store-location.png");
			},
			coupon(){
				this.$refs.popup.init();
			},
			getInfo(){
				this.$http.get(`/app/collection/detail/${this.id}`).then(res =>{
					this.info = res;
					this.curTypeCode = res.type.code;
					if(res.type.sort == 'consume'){
						this.curTypeCode = res.type.sort;
					}
				})
			},
			toMap(){
				//跳转到地图页
				this.jump(`/PGov/pages/index/map?pageName=${this.info.title}
				&destinationLat=${this.info.lat}&destinationLng=${this.info.lng}
				&address=${this.info.address || ''}&phone=${this.info.phone || ''}`)
			},
			weixin(weixinId){
				// #ifdef MP-WEIXIN
					uni.navigateToMiniProgram({appId:param.appId})
					// #endif
					
					// #ifdef APP-PLUS
					plus.share.getServices(shareList=>{
					let shareWx = shareList.find(val=> val.id == 'weixin')
					if(shareWx){
					 shareWx.launchMiniProgram({id: weixinId})
					}else{
					 uni.showToast({icon: 'none', title: "未安装微信,无法打开对应小程序"})
					}
					}, e=>{
					 uni.showToast({icon: 'none', title: "获取分享服务列表失败:"+JSON.stringify(e)})
					})
				// #endif
			}
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/static/css/store.scss';
	.store-detail-wrap{
		padding-bottom: 150upx;
	}
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
.fixed-btn-rightBottom{
	bottom:60upx;
}


</style>
