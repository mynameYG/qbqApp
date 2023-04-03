<template>
	<view class="popup-wrap" v-if="popup">
		<view class="popup-box">
			<view class="popup-close" @click="cancle">
				<text class="iconfont icon-guanbi"></text>
			</view>
			<view class="popup-con detail-wrap no-mt">
				<view class="detail-item flex tc">
					<text class="detail-label flex1 no-mr p15 color333">满意度评价</text>
				</view>
				<view class="detail-item flex mb10">
					<text class="detail-label" style="width:46px">满意度</text>
					<view name="sex" class="detail-text flex1 text-ellipsis">
						<radio-group @change="radioChange">
							<label class="radio vedio-radio">
								<radio value="satisfied" checked="checked" color="#1B6EE6" style="transform: scale(0.7);" />
								满意
							</label>
							<label class="radio vedio-radio">
								<radio value="commonly" color="#1B6EE6" style="transform: scale(0.7);" />
								一般
							</label>
							<label class="radio vedio-radio">
								<radio value="dissatisfied" color="#1B6EE6" style="transform: scale(0.7);" />
								不满意
							</label>
						</radio-group>
					</view>
				</view>
				<view class="detail-item flex">
					<text class="detail-label" style="width:46px">内容</text>
					<textarea maxlength="-1" name="descripe" v-model="evaluateContent" placeholder="请输入内容" placeholder-class="gray-place" class="flex1 model-textarea"></textarea>
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
				evaluateResult:"satisfied",
				evaluateContent:""
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
				params = {
					id:this.info.infoId,
					evaluateResult:this.evaluateResult,
					evaluateContent:this.evaluateContent
				}
				console.log('params',params) 
				this.$http.put(`${this.info.putUrl}?id=${this.info.infoId}&evaluateResult=${this.evaluateResult}&evaluateContent=${this.evaluateContent}`).then(res =>{
					uni.showToast({title: "评价成功",icon: 'none'});
					this.popup = false;
					this.$emit('refresh')
				})
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
	.model-textarea{
		overflow-y: auto;
		width: 100%;
		max-height: 71px;
		font-size: 14px;
		line-height: 24px;
		border:1px solid #EEEEEE;
		border-radius: 5px;
		padding-left: 5px;
	}
</style>
