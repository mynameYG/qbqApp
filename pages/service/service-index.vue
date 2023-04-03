<template>
	<view class="channelPage whiteBg">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="channel-banner" :style="{height:ImageHeight + 'px'}">
					<image :src="getBanner()" :style="{height:ImageHeight + 'px'}" @load="getImgHeight"></image>
				</view>
				<view class="store-nav pl15 pr15 mb15">
					<view class="index-nav-box clearfix">
						<view class="index-nav-item tc no-mb" :style="{width:100/lie + '%'}" v-for="(item,index) in channelList" :key="index" @tap="JumpLink(item)">
							<view  class="index-nav-item-inner" :style="{background:item.colour}" >
								<view class="index-nav-text no-before">{{item.title || item.name}}</view>
								<i class="img" :style="{width:width + 'px' , height:width + 'px'}">
									<image :src="getImgNav(item.code)"></image>
								</i>
							</view>
						</view>
					</view>
				</view>
				<view class="store-list-scrollWrap">
					<template v-if="storeList.length > 0">
						<view class="store-list p15 clearfix no-pt">
							<view class="shop-list-item flex flexmid" v-for="(item,index ) in storeList" :key="index" @tap="navToDetail(item)">
								<view class="shop-list-item-inner">
									<view class="shop-logo">
										<image :src="fileUrl(item.url, 280)">
									</view>
									<view class="shop-body">
										<h3 class="shop-name text-ellipsis">{{item.title ||''}}</h3>
										<view class="shop-address text-ellipsis">{{item.address ||''}}</view>
										
										<view class="daohang" @tap.stop="toMap(item)">
											<image  class="icon" :src="getImgDaohang()"  alt="">
										</view>
									</view>
								</view>
							</view>
						</view>
				</template>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import channelUrlJson from '@/common/channel_Url.js'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				loadMoreStatus: 0,
				enableScroll: true,
				q: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				lie:0,
				width:"",
				storeList:[],
				ImageHeight:130,
				code:"",
				channelList: []
			}
		},
		onLoad(option){
			this.code = 'sqfw';
		},
		mounted(){
			this.channelList = channelUrlJson[this.code].childJson;
			this.lie = channelUrlJson[this.code].childJson.length;
			const getSystemInfo = uni.getSystemInfoSync();
			this.width = (getSystemInfo.windowWidth / this.lie) * 0.5;
		},
		methods:{
			upCallback(page){
				if(page.num == 1){
					this.q.pageNo = 1;
					this.storeList = [];
				}
				let mapType = this.$config.mapType;
				this.$http.get(`/app/collection/list?mapType=${mapType}&page=${this.q.pageNo}&pageSize=${this.q.pageSize}`).then(res =>{
					this.q.total = res.total;
					var changeData = [];
					changeData = res.list;
					this.storeList = this.storeList.concat(changeData);
					this.loadMoreStatus = this.storeList.length >= this.q.total ? 2 : 0;
					this.q.pageNo++;
					this.mescroll.endByPage(res.list.length, Math.ceil(res.total / res.pageSize))
				})
			},
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
			getImgNav(icon){
			   return require("@/pages/service/img/service-"+icon+".png");
			},
			getBanner(){
				return require(`@/pages/service/img/service-banner.jpg`);
			},
			getImgDaohang(){
				return require("@/static/img/store-location.png");
			},
			getChannelImg(item){
				return require(`@/pages/service/img/${item}.png`);
			},
			JumpLink(item){
				console.log('----',item)
				let  _self = this;
				var verify_config = {
					login(){
						// 校验是否登录
						if(_self.$store.state.hasLogin){
							return true;
						}else{
							// 跳转登录页
							_self.jump('/PProperty/pages/login/login')
							return false;
						}
						
					},
					yezhu(){
						console.log('this.$store.state.user',_self.$store.state)
						let userType = _self.$store.state.user.ext.proprietor;
						console.log('userType',userType)
						if(userType){
							return true;
						}
						uni.showModal({
							title: '提示',
							content: '请填写业主信息',
							success: function (res) {
								if (res.confirm) {
									console.log('用户点击确定');
									util.jump('/PProperty/pages/my/my-info')
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						});
						return false;
						/* let userType = this.$store.state.user.ext.type;
						if(userType && userType.value == 'proprietor'){
							return true;
						}
						uni.showToast({
							title: '此功能只针对业主开放',
							icon: 'none'
						});
						return false; */
					}
				}
				if(item.verify){
					for(var v of item.verify){
						if(!verify_config[v]()){
							return false;
						}
					}
				}
				
				
				switch(item.fun){
					case 'jump':
						if(!item.url){
							this.tips();
							return false
						}
						this.jump(`${item.url}`);
						break;
					case 'reLaunch':
						this.reLaunch(item.url);
						break;
					case 'webPage':
						this.jumpWebPage(`outSideUrl&url=${item.url}&title=${item.title}`)
						break;
					case 'WEIXIN':
						// #ifdef MP-WEIXIN
							uni.navigateToMiniProgram({appId:param.appId})
							// #endif
							
							// #ifdef APP-PLUS
							plus.share.getServices(shareList=>{
							let shareWx = shareList.find(val=> val.id == 'weixin')
							if(shareWx){
							 shareWx.launchMiniProgram({id: 'gh_6775f4712efb'})
							}else{
							 uni.showToast({icon: 'none', title: "未安装微信,无法打开对应小程序"})
							}
							}, e=>{
							 uni.showToast({icon: 'none', title: "获取分享服务列表失败:"+JSON.stringify(e)})
							})
						// #endif
						break;
					default:
						// TODO 
				}
			},
			navToDetail(item){
				uni.navigateTo({
					url:`/PStore/pages/store/store-detail?id=${item.id}&pageName=${item.title}`
				})
			},
			toMap(item){
				//跳转到地图页
				this.jump(`/PGov/pages/index/map?pageName=${item.title}
				&destinationLat=${item.lat}&destinationLng=${item.lng}
				&address=${item.address || ''}&phone=${item.phone || ''}`)
			},
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/static/css/store.scss';
	.channel-banner{
		margin-top: 30upx;
		padding:0 30upx;
	}
	uni-image{
		width: 100%;
		height: 100%;
	}
	.store-nav{
		padding-top: 10upx;
		margin: 0 -15upx;
		.index-nav-box{
			margin-top: 0;
		}
		.index-nav-item{
			padding:0 15upx;
		}
		.index-nav-item-inner{
			padding-bottom: 0!important;
		}
		.index-nav-text{
			margin:10upx 0;
			font-weight: 600;
		}
		.img{
			display: block;
			margin: 0 auto;
			uni-image{
				width: 100%;
				height: 100%;
			}
		}
	}
	.shop-list-item-inner{
		position: relative;
		.shop-address{
			padding-right: 60upx;
		}
	}
	.daohang{
		position: absolute;
		bottom:4upx;
		right:20upx;
		.icon{
			width: 60upx;
			height: 60upx;
			vertical-align: -0.15em;
			fill: currentColor;
			overflow: hidden;
		}
	}
</style>
