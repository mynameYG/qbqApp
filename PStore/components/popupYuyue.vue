<template>
	<view class="popup-wrap" v-if="popup">
		<view class="popup-box">
			<view class="popup-close" @click="cancle">
				<text class="iconfont icon-guanbi"></text>
			</view>
			<view class="popup-con detail-wrap no-mt">
				<view class="detail-item flex tc">
					<text class="detail-label flex1 no-mr p15 color333">立即预约</text>
				</view>
				<view class="detail-item flex">
					<text class="detail-label require" style="width:46px">姓名:</text>
					<input type="text" v-model="name" placeholder="请输入" placeholder-class="gray-place" class="model-textarea flex1">
				</view>	
				<view class="detail-item flex">
					<text class="detail-label require" style="width:46px">电话:</text>
					<input type="number" v-model="phone" placeholder="请输入" placeholder-class="gray-place" class="flex1 model-textarea">
				</view>	
				<view class="detail-item flex">
					<text class="detail-label" style="width:46px">住址:</text>
					<input type="number" v-model="address" placeholder="请输入" placeholder-class="gray-place" class="flex1 model-textarea">
				</view>	
				<view class="popup-btn flex flexmid">
					<view class="popup-btn-item flex1">
						<button class="popup-cancle" @click="cancle">取消</button>
					</view>
					<view class="popup-btn-item flex1">
						<button class="popup-confirm" @click="confirm">确定</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'popup',
		props:{
			info:""
		},
		data() {
			return {
				popup: false,
				name:"",
				phone:"",
				address:""
			}
		},
		methods: {
			init(){
				this.popup = true;
			},
			cancle() {
				this.popup = false;
			},
			radioChange(e){
				let value = e.detail.value;
				console.log('value',value)
				this.evaluateResult = value;
			},
			confirm() {
				var params = {};
				// params = {
				// 	id:this.info.infoId,
				// 	evaluateResult:this.evaluateResult,
				// 	evaluateContent:this.evaluateContent
				// }
				console.log('params',params) 
				if(!this.name){
					uni.showToast({title: "请输入姓名",icon: 'none'});
					return false
				}
				if(!this.phone){
					uni.showToast({title: "请输入电话",icon: 'none'});
					return false
				}
				setTimeout(()=>{
					uni.showToast({title: "预约成功",icon: 'none'});
					this.popup = false;
					this.$emit('yuyueSuccess');
				},500)
			}
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/common/detail.scss';//公共样式
	@import '@/PStore/common/popup.scss';
	/deep/.w-picker .w-picker-cnt{
		-webkit-transform: translateY(200%);
		transform: translateY(200%);
	}
	.detail-item{
		margin-bottom: 30upx;
	}
	.model-textarea{
		overflow-y: auto;
		width: 100%;
		height: 60upx;
		font-size: 28upx;
		line-height: 28upx;
		border:1px solid #EEEEEE;
		border-radius: 10upx;
		padding-left: 10upx;
	}
</style>
