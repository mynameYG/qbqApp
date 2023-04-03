<template>
	<view class="popup-wrap" v-if="popup">
		<view class="popup-box">
			<view class="popup-close" @click="cancle">
				<text class="iconfont icon-guanbi"></text>
			</view>
			<view class="popup-con">
				<jyf-parser class="art-con" :html="content" :domain="fileUrl('/r')"></jyf-parser>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'result',
		props:{
			info:"",
		},
		data() {
			return {
				popup: false,
				content:""
			}
		},
		watch:{
			info(val){
				//console.log(val)
				this.content = val;
			}
		},
		methods: {
			init(){
				this.popup = true;
			},
			cancle() {
				this.popup = false;
			}
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/common/form.scss';//公共样式
	@import '@/PStore/common/popup.scss';
	.popup-box{
		transform: translate(-50%, -50%);
	}
	.popup-con{
	    padding: 20px 10px 20px;
	}
	.art-con{
		font-size: 14px;
		line-height: 24px;
		// #ifdef APP-PLUS
		max-height: calc(100vh - 100px);
		// #endif
		// #ifndef APP-PLUS
		max-height: calc(100vh - 180px);
		// #endif
		overflow-y:auto;
	}
	
</style>
