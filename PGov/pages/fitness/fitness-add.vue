<template>
	<view class="yh-bg">
		<form @submit="formSubmit">
			<view class="model-wrap p15">
				<view class="model-box no-mb clearfix no-all-p">
					<view class="model-item flex flexmid">
						<text class="model-label require">预约日期</text>
						<ikdo-datetime-picker name="orderDate" fields="day" class="model-editText tr flex1 text-ellipsis" :value="currentDate" v-model="currentDate" @ok="ok"/>
						<text class="model-decorate"><text class="iconfont icon-you"></text></text>
					</view>
					<view class="model-item flex">
						<text class="model-label require">预约时间段</text>
						<radio-group @change="checkboxChange" class="flex1">
							<view class="contacts-smalllink mb10" v-for="(item,i) in sureList" :key="i" >
								<label class="org-checkbox flex flexmid">
									<view class="contacts-smallmid flex1">
										<view class="contacts-smallname fs14 tr">{{dateFilter(item.startTime, "minutes")}} —— {{dateFilter(item.endTime, "minutes")}}</view>
									</view>
									<radio color="#1B6EE6" :value="i+''" style="transform: scale(0.7);" />
								</label>
							</view>
						</radio-group>
					</view>
					<!-- <view class="model-item flex flexmid">
						<text class="model-label">联系人</text>
						<input class="model-editText no-ml flex1 tr" type="text"
						name='title' v-model="info.userName"
						placeholder="请输入"
						/>
					</view> -->
					<view class="model-item flex flexmid">
						<text class="model-label require">联系电话</text>
						<input class="model-editText no-ml flex1 tr" type="number"
						name='title' v-model="info.phone"
						placeholder="请输入"
						/>
					</view>
					<view class="submit-wrap fixed-btn">
						<button :disabled="submitting" formType="submit" class="tj">提交预约</button>
					</view>
				</view>
			</view>
		</form>
	</view>
</template>

<script>
	import ikdoDatetimePicker from '@/PGov/components/ikdo-datetime-picker/ikdo-datetime-picker'
	var graceChecker = require("@/common/graceChecker.js");

	export default {
		components:{
			'ikdo-datetime-picker' : ikdoDatetimePicker
		},
		data() {
			return {
				id:"",
				submitting:false,
				startTime: "", //开始时间
				endTime: "", //结束时间
				currentTime:"",//当前时间
				currentDate:"",//当天日期
				sureList:[],
				info:{
					phone:this.$store.state.user.mobile
				},
				imei:"",//用户唯一识别码
			}
		},
		onLoad(opt) {
			this.id = opt.id;
		},
		onNavigationBarButtonTap(e) {
			uni.navigateTo({
				url:`fitness-occupancy?manage=false&id=${this.id}`
			})
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
				this.imei = data.code;
				uni.setStorageSync('vinfo', data.code);
				console.log('this.imei----'+this.imei)
			})
			// #endif
			let tody = this.todayDate();
			this.currentTime = tody;
			this.init(this.currentTime);
		},
		methods: {
			// 获取当天的日期
			todayDate(){
				let dateA = (new Date()).getTime();
				let todayDate = this.dateFilter(dateA,'date');
				return todayDate;
			},
			// 计算选择时间是否正确
			ok(data){
				if(this.currentDate){
					let res = new Date(this.currentTime.replace(/-/g,"/")).getTime() - new Date(this.currentDate.replace(/-/g,"/")).getTime();
					if (res > 0) {
						this.currentDate = "";
						uni.showToast({
							title: "开始时间必须在当前时间之后",
							icon: 'none'
						});
						return;
					}
					this.init(this.currentDate);
				}
				if(this.startTime){
					let res = new Date(this.currentTime.replace(/-/g,"/")).getTime() - new Date(this.startTime.replace(/-/g,"/")).getTime();
					if (res > 0) {
						this.startTime = "";
						uni.showToast({
							title: "开始时间必须在当前时间之后",
							icon: 'none'
						});
						return;
					}
				}
				if (this.startTime && this.endTime) {
					let res = new Date(this.endTime.replace(/-/g,"/")).getTime() - new Date(this.startTime.replace(/-/g,"/")).getTime();
					if (res <= 0) {
						this.endTime = "";
						uni.showToast({
							title: "结束时间必须在开始时间之后",
							icon: 'none'
						});
						return;
					}
				}
			},
			checkboxChange: function (e) {
				console.log('e',e)
				const values = e.detail.value;
				this.startTime = this.sureList[values].startTime;
				this.endTime =  this.sureList[values].endTime;
			},
			init(dateInfo) {
				this.$http.get(`/mobile/appoint/area/${this.id}/times`, {date: dateInfo}).then(res => {
					console.log('res',res)
					this.sureList = [];
					res.forEach((item) => {
						let dataF = this.dateFilter(item.date,'date')
						/* 可预约时间 */
						if(dataF == dateInfo){
							item.infos.forEach((m,index) => {
								this.sureList.push({
									date:dataF,
									startTime:m.start,
									endTime:m.end
								});
							})
						}
					})
				});
			},
			/* 提交 */
			formSubmit: function(e) {
				e.detail.value.orderDate = this.currentDate; 
				e.detail.value.start = this.startTime; //开始时间
				e.detail.value.end = this.endTime;//结束时间
				e.detail.value.phone = this.info.phone;
				//定义表单规则
				var rule = [
					{
						name: "orderDate",
						checkType: "string",
						checkRule: "2,",
						errorMsg: "请选择预约日期"
					},
					{
						name: "end",
						checkType: "string",
						checkRule: "2,",
						errorMsg: "请选择预约时间段"
					},
					{
						name: "phone",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请输入电话"
					},
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
				let params = {
					start:this.currentDate +' ' + this.dateFilter(this.startTime,'second'),
					end:this.currentDate +' ' + this.dateFilter(this.endTime,'second'),
					phone:this.info.phone,
					imei:this.imei
				};
				var checkRes = graceChecker.check(e.detail.value, rule);
				if (checkRes) {
					console.log('params',params);
					// return false
					this.submitting = true;
					this.$http.put(`/mobile/appoint/area/${this.id}?start=${params.start}&end=${params.end}&phone=${params.phone}&imei=${params.imei}`).then(formData => {
						uni.showToast({title: "预约成功",icon: 'none'});
						let pages = getCurrentPages();
						let index = 0;
						for (let page of pages) {
						  if (page.route === 'PGov/pages/fitness/fitness-detail') {
							break;
						  }
						  index++;
						} 
						uni.navigateBack({delta: pages.length - index});
						this.submitting = false;
					}).catch(err =>{
						console.log('-----------')
						console.log('err',err)
						/* uni.showToast({title: err.msg,icon: 'none'}) */
						this.submitting = false;
					})
					
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/common/form.scss';//公共样式
	/deep/ .uni-input, .uni-input-placeholder,.placeholder{
		color:#333
	}
	.yh-bg{
		padding-bottom: 80px;
	}
</style>
