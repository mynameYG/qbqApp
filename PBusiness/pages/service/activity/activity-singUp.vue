<template>
	<view>
		<form @submit="formSubmit">
			<view class="model-box">
				<view class="model-item flex">
					<text class="model-label require" style="width:70px">姓名</text>
					<input name="userName" placeholder="请输入" type="text" v-model="info.userName"
					placeholder-class="gray-place" class="model-editText flex1 tr text-ellipsis pr10">
				</view>
				<view class="model-item flex">
					<text class="model-label" style="width:70px">性别</text>
					<view name="sex" class="model-editText tr flex1 text-ellipsis">
						<radio-group @change="vacationChange">
							<label class="radio vedio-radio">
								<radio value="true" :checked="sex" color="#1B6EE6" style="transform: scale(0.7);" />
								男
							</label>
							<radio value="false" :checked="!sex" color="#1B6EE6" style="transform: scale(0.7);" />
								女
							</label>
						</radio-group>
					</view>
				</view>
				<view class="model-item flex">
					<text class="model-label" style="width:70px">年龄</text>
					<input name="age" placeholder="请输入" type="number" 
					placeholder-class="gray-place" class="model-editText flex1 tr text-ellipsis pr10">
				</view>
				<view class="model-item flex">
					<text class="model-label require" style="width:70px">电话</text>
					<input name="phone" placeholder="请输入" type="number"  v-model="info.phone"
					placeholder-class="gray-place" class="model-editText flex1 tr text-ellipsis pr10">
				</view>
				<!-- <view class="model-item flex">
					<text class="model-label" style="width:70px">住址</text>
					<input name="address" placeholder="请输入" type="text" 
					placeholder-class="gray-place" class="model-editText flex1 tr text-ellipsis pr10">
				</view>
				<view class="model-item flex">
					<text class="model-label" style="width:70px">工作单位</text>
					<input name="workUnit" placeholder="请输入" type="text" 
					placeholder-class="gray-place" class="model-editText flex1 tr text-ellipsis pr10">
				</view>
				<view class="model-item flex">
					<text class="model-label" style="width:70px">其他</text>
					<input name="remark" placeholder="请输入" type="text" 
					placeholder-class="gray-place" class="model-editText flex1 tr text-ellipsis pr10">
				</view> -->
			</view>
			<view class="submit-wrap fixed-btn flex">
				<button @tap="cancle" class="tj flex1">取消</button>
				<button class="tj flex1" form-type="submit">提交</button>
			</view>
		</form>
	</view>
</template>
<script>
	var graceChecker = require("@/common/graceChecker.js");
	export default {
		data() {
			return {
				id:"",
				sex:true,
				info:{
					userId:this.$store.state.user.id,
					userName:this.$store.state.user.nickname,
					phone:this.$store.state.user.mobile
				},
				imei:""//用户唯一识别码
			}
		},
		onLoad(option){
			this.id = option.id
		},
		mounted(){
			// #ifdef MP-WEIXIN
			this.getWxCode().then(data =>{
				console.log('data-----',data)
				this.imei = data.code
				uni.setStorageSync('vinfo', data.code);
			})
			// #endif
			// #ifdef APP-PLUS
			var info = plus.push.getClientInfo();
			var vinfo = info.clientid;
			uni.setStorageSync('vinfo', vinfo);
			this.imei = vinfo;
			/* plus.nativeUI.toast("info.clientid" + plus.push.getClientInfo().clientid); */
			// #endif
		},
		methods: {
			cancle() {
				let pages = getCurrentPages();
				let index = 0;
				for (let page of pages) {
					index++;
				  if (page.route === 'PBusiness/pages/service/activity/activity-detail') {
					break;
				  }
				} 
				uni.navigateBack({delta: pages.length - index});
			},
			input(res) {
				if(res.detail.value < 1 || res.detail.value > 100){
					uni.showToast({
						title: '请输入处理进度1~100',
						icon: 'none'
					})
					this.setFocus = true;
				}
				
			},
			// 性别
			vacationChange(e){
				let value = e.detail.value;
				console.log('value',value)
				this.sex = JSON.parse(value);
			},
			/* 提交 */
			formSubmit: function(e) {
				e.detail.value = this.info;
				e.detail.value.benefitActivitiesId = this.id; 
				e.detail.value.sex = this.sex ? 0 : 1; 
				e.detail.value.source = this.$config.source;//数据来源
				e.detail.value.imei = this.imei;
				//定义表单规则
				var rule = [
					{
						name:"userName", 
						checkType : "string", 
						checkRule:"1,",  
						errorMsg:"请输入姓名",
					},
					{
						name:"phone", 
						checkType : "string", 
						checkRule:"1,",  
						errorMsg:"请输入电话",
					}
				]; 
				if(e.detail.value.phone){
					rule.push({
						name: "phone",
						checkType: "phoneno",
						checkRule:"",
						errorMsg: "请输入正确的号码"
					})
				}
				
				
				
				//进行表单检查
				var formData={};
				var checkRes = graceChecker.check(e.detail.value, rule);
				if (checkRes) {
					console.log('e.detail.value',e.detail.value)
					// return false
					this.$http.post(`/mobile/party/benefit/signUp`,e.detail.value).then(res =>{
						uni.showToast({title: "报名成功",icon: 'none'});
						setTimeout(() => {
							let pages = getCurrentPages();
							let index = 0;
							for (let page of pages) {
								index++;
							  if (page.route === 'PBusiness/pages/service/activity/activity-detail') {
								break;
							  }
							} 
							uni.navigateBack({delta: pages.length - index});
						}, 1000)
					}).catch(err => {
						err && uni.showToast({
							title: err,
							icon: 'none'
						})
					});
					
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			},
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/common/form.scss';//公共样式
	.submit-wrap {
		.tj{
			background-color: #FF8100;
		}
		.tj + .tj{
			margin-left: 15px;
			background-color: #1B6EE6;
		}
	}
</style>
