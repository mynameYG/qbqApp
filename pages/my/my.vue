<template>
	<view class="bg">
		<view class="my-header-wrap no-road">
			<view class="my-header-box">
				<view class="my-photo">
					<image src="../../static/img/default-photo.png"></image>
				</view>
				<view  v-if="hasLogin" class="my-name text-ellipsis">{{user.nickname || "匿名"}}</view>
				<view  v-else class="my-name text-ellipsis">未登录</view>
			</view>
		</view>

		<view class="my-nav p15 whiteBg no-pb">
			<template v-if="hasLogin">
				<view class="my-item flex flexmid arrow" @tap="jump('/PProperty/pages/my/my-info')">
					<text class="iconfont icon-lianxiren-copy"></text>
					<text class="my-text flex1">个人信息</text>
				</view>
				<view class="my-item flex flexmid arrow" @tap="jump('/PProperty/pages/my/password')">
					<text class="iconfont icon-xiugaimima"></text>
					<text class="my-text flex1">修改密码</text>
				</view>
				<view class="my-item flex flexmid arrow" @tap="jump('/PProperty/pages/my/my-follow')">
					<text class="iconfont icon-shoucang"></text>
					<text class="my-text flex1">我的关注</text>
				</view>
			</template>
		<!-- 	<view class="my-item flex flexmid arrow" @tap="jump('/PProperty/pages/service/my-integral')">
				<text class="iconfont icon-jifen"></text>
				<text class="my-text flex1">我的积分</text>
			</view> -->
			<view class="my-item flex flexmid arrow" style="padding-right: 30px;" @click="update">
				<text class="iconfont icon-banbengengxin"></text>
				<text class="my-text flex1">版本更新</text>
				<text class="my-text" style="color:#666" v-if="version">版本  {{version}}</text>
			</view>
			<template v-if="hasLogin">
				<view class="my-item flex flexmid arrow" @tap="logOut()">
					<text class="iconfont icon-tuichu"></text>
					<text class="my-text flex1">退出登录</text>
				</view>
			</template>
			<template  v-else>
			<!-- 	<view class="my-item flex flexmid arrow" @tap="jump('/pages/login/login')">
					<text class="iconfont icon-tuichu"></text>
					<text class="my-text flex1">去登录</text>
				</view> -->
				<view class="my-item flex flexmid" style="margin-top:60px">
					<!-- <text class="my-text flex1 bgcolormain">去登录</text> -->
					<button class="bgcolormain flex1 colorfff fs14" style="height: 36px; line-height: 36px;" @tap="jump('/PProperty/pages/login/login')">去登录</button>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations,mapGetters} from 'vuex'
	import upgrade from '@/util/upgrade'
	export default {
		data() {
			return {
				user:this.$store.state.user,
				version:"",
				tabBarIndex:2,
				hasLogin:this.$store.state.hasLogin
			}
		},
		mounted() {
			this.init();
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid,(inf)=>{
				this.version = inf.version
			})
			// #endif
		},
		methods: {
			...mapMutations(['logout']),
			init(){
				this.user = this.$store.state.user;
				this.hasLogin = this.$store.state.hasLogin
			},
			logOut(){
				this.$http.post('/mobile/logout').then(r => {
					this.logout();
					uni.$emit('logout');
					this.init();
				}).catch(err => {
					uni.showToast({title: err,icon: 'none'})});
			},
			update(){
				let _this = this;
				// #ifdef APP-PLUS
				upgrade.check("myUpdate");
				// #endif
				// #ifdef MP-WEIXIN
				// 获取小程序更新机制兼容
				if (uni.canIUse('getUpdateManager')) {
					_this.$config.debug && console.log(1232)
					const accountInfo = uni.getAccountInfoSync();  
					_this.$config.debug && console.log('accountInfo',accountInfo)
				/* 	uni.showModal({
						title: '温馨提示',
						content: JSON.stringify(accountInfo),
					}) */
					_this.version = accountInfo.miniProgram.version; // 小程序 版本号
					const updateManager = uni.getUpdateManager()
					// 检查是否有新版本发布
					updateManager.onCheckForUpdate(function(res) {
						_this.$config.debug && console.log('res',res)
						if (res.hasUpdate) {
							//小程序有新版本，则静默下载新版本，做好更新准备
							updateManager.onUpdateReady(function() {
								uni.showModal({
									title: '更新提示',
									content: '新版本已经准备好，是否重启应用？',
									success: function(res) {
										if (res.confirm) {
											//新的版本已经下载好，调用 applyUpdate 应用新版本并重启
											updateManager.applyUpdate()
										} else if (res.cancel) {
											//如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
											uni.showModal({
												title: '温馨提示',
												content: '我们已经做了新的优化，请及时更新哦~',
												showCancel: false, //隐藏取消按钮，也可显示，取消会走res.cancel，然后从新开始提示
												success: function(res) {
													//第二次提示后，强制更新           
													if (res.confirm) {
														// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
														updateManager.applyUpdate()
													} else if (res.cancel) {
														//重新回到版本更新提示
														autoUpdate()
													}
												}
											})
										}
									}
								})
							})
							  // 新的版本下载失败
							updateManager.onUpdateFailed(function() {
								uni.showModal({
									title: '温馨提示',
									content: '新版本已经上线，请您删除当前小程序，重新搜索打开',
								})
							})
						}else{
							uni.showToast({
								title:"已是最新版本",
								icon:"none"
							})
						}
					})
				} else {
					// 提示用户在最新版本的客户端上体验
					uni.showModal({
						title: '温馨提示',
						content: '当前微信版本过低，可能无法使用该功能，请升级到最新版本后重试。'
					})
				}
				// #endif
				
				
				
			}
		}
	}
</script>

<style lang="scss">
	.bg{
		top:0px !important;
		background-color: #fff;
		padding-bottom: 50px;
	}
	/*我的*/
	.my-header-wrap{
	    width: 100%;
	    min-height: 178px;
	    background: url(../../static/img/my-bg.png) #fff no-repeat center;
	    background-size:100% 100%;
		/* #ifdef H5 */
		padding: 15px 15px 10px;
		/* #endif */
		/* #ifndef H5 */
		padding: 40px 15px 10px;
		/* #endif */
		.my-header-box{
		    width: 100%;
		    position:relative;  
			  .my-title{
			  	font-size:17px;
				font-weight: 600;
				color:#fff;
				text-align: center;
				.icon-bianji{
					position: absolute;
					top:0;
					right:15px;
					font-weight: 500;
					margin-top: 2px;
					font-size:18px;
				}
			  }
		}
		.my-photo{
			display: block;
			width: 60px;
			height: 60px;
			border: 3px solid #fff;
			border-radius: 50%;
			overflow: hidden;
			box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.1);
			float: left;
		    image{
		        display: block;
		        width: 100%;
		        height: 100%;
		        border-radius: 50%;
		    }
		}
		.my-name{
			float:left;
		    font-size: 16px;
		    color:#fff;
			font-weight: 600;
		    text-align: left;
		    padding: 0 10px;
		    margin: 20px auto 0;
			width: calc(100% - 70px);
			text-shadow:0px 0px 2px rgba(0, 0, 0, 0.3);
		}
		.my-header-total{
			margin-top: 15px;
			width: 100%;
			min-height: 178px;
			border-radius: 5px;
			box-shadow: 0px 0px 10px rgba(43, 160, 247, 0.298039215686275);
			background-color: #fff;
		}
	}
	
	.no-road{
		width: 100%;
		min-height: 178px;
		/* #ifdef H5 */
		padding: 20px 15px 0;
		/* #endif */
		/* #ifndef H5 */
		padding: 20px 15px 20px;
		/* #endif */
		.my-header-box{
			width: 100%;
			position:relative;  
		}
		.my-photo{
			display: block;
			float: none;
			width: 60px;
			height: 60px;
			margin: 30px auto 0;
			border:3px solid #fff;
			border-radius: 50%;
			overflow: hidden;
			box-shadow: 0 2px 4px 2px rgba(0,0,0,.1);
			image{
				display: block;
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		.my-name{
			width: 100%;
			font-size: 16px;
			color:#fff;
			text-align: center;
			padding: 0 25px;
			margin: 15px auto 0;
		}
	}
	.my-item{
	    width: 100%;
	    padding: 12px 0;
		border-bottom: 1px solid #f8f8f8;
		.iconfont{
			font-size: 20px;
			margin-right: 10px;
			width: 30px;
			height: 30px;
			line-height: 30px;
			text-align: center;
			border-radius: 50%;
			color:#fff;
		}
		.icon-tuichu{
			font-size:16px
		}
		&:last-child{
			border-bottom: 0;
		}
	}
	.my-item:nth-child(5n + 1) .iconfont{
		font-size: 16px;
		background-color: #2288FF;
	}
	.my-item:nth-child(5n + 2) .iconfont{
		background-color:#62C6FF;
	}
	.my-item:nth-child(5n + 3) .iconfont{
		background-color:#CC9CFD;
	}
	.my-item:nth-child(5n + 4) .iconfont{
		background-color:#62C6FF;
	}
	.my-item:nth-child(5n + 5) .iconfont{
		background-color:#28C689;
	}
	.my-text{
	    font-size: 14px;
	    color:#333;
	    line-height: 26px;
	}

</style>
