<script>
	// import '@/static/font/iconfont.css';
	import Vue from 'vue';
	import upgrade from '@/util/upgrade';
	import { mapMutations } from 'vuex'
	
	export default {
		globalData: {
			user: {}
		},
		onLaunch: function() {
			console.log('App Launch');
			this.loadUserFromStorage();
			// #ifdef H5
			upgrade.check();
			// #endif
			if(process.env.NODE_ENV !== 'development'){
				upgrade.check();
			}
			// 处理推送消息
			//this.handlePush();
			
			// #ifdef APP-PLUS
			// 锁定屏幕方向
			//plus.screen.lockOrientation('landscape-primary') //竖屏正方向
			plus.screen.lockOrientation('portrait-primary') //竖屏正方向
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			...mapMutations(['loadUserFromStorage'])
		}
	}
</script>

<style lang="scss">
	
	/* #ifndef APP-PLUS-NVUE */
	@import './static/font/iconfont.css';
	/*每个页面公共css */
	@import '@/PStore/common/common.scss';
	/* #endif */
	.placeholder {
		color: #999;
		font-size: 14px;
	}
	
	/* #ifndef APP-PLUS-NVUE */
	/deep/ .uni-searchbar__text-placeholder{
		font-size:14px;
	}
	/* #endif */
	.bg{
		// min-height: 100vh;
		background-color: #FAFAFA;
		position: fixed;
		// #ifdef APP-PLUS
		top: 0px;
		// #endif
		// #ifndef APP-PLUS
		top: 44px;
		// #endif
		//#ifdef MP-WEIXIN
		top: 0px;
		// #endif
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1;
		/* #ifndef APP-PLUS-NVUE */
		overflow-y: auto;
		/* #endif */
	}
	/* #ifndef APP-PLUS-NVUE */
	/* 去掉所有button的外边框 */
	button::after {
		border: none;
	}
	/* #endif */
	
</style>
