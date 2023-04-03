<template>
	<view class="form-body">
		<form @submit="formSubmit">
			<view class="model-wrap p15">
				<view class="model-box no-mb clearfix">
					<view class="model-item flex flexmid">
						<text class="model-label require">标题</text>
						<input class="model-editText no-ml flex1 tr" type="text"
						name='title' v-model="info.title"
						placeholder="请输入"
						/>
					</view>
					<view class="model-item flex flexmid">
						<text class="model-label require">部门</text>
						<picker class="model-editText tr flex1 text-ellipsis" @change="orgChange" :value="orgIndex" :range="orgList" range-key="name">
							<view class="uni-input">{{orgList[orgIndex].name}}</view>
						</picker>
						<text class="model-decorate"><text class="iconfont icon-you"></text></text>
					</view>
					<view class="model-item flex flexmid">
						<text class="model-label require">类型</text>
						<picker class="model-editText tr flex1 text-ellipsis" @change="problemTypeChange" :value="typeIndex" :range="problemType" range-key="title">
							<view class="uni-input">{{problemType[typeIndex].title}}</view>
						</picker>
						<text class="model-decorate"><text class="iconfont icon-you"></text></text>
					</view>
					<view class="model-item">
						<view class="model-label require">内容</view>
						<view class="model-editText no-ml heigthAuto">
							<textarea maxlength="-1" name="content" v-model="info.content" placeholder="请输入咨询内容" placeholder-class="gray-place" class="flex1 model-textarea"></textarea>
						</view>
					</view>
					<view class="model-item flex flexmid">
						<text class="model-label require">联系人</text>
						<input class="model-editText no-ml flex1 tr" type="text"
						name='signUser' v-model="info.signUser"
						placeholder="请输入"
						/>
					</view>
					<view class="model-item flex flexmid">
						<text class="model-label require">联系电话</text>
						<input class="model-editText no-ml flex1 tr" type="number"
						name='signPhone' v-model="info.signPhone"
						placeholder="请输入"
						/>
					</view>
					<!-- <view class="model-item flex flexmid">
						<text class="model-label">联系地址</text>
						<input class="model-editText no-ml flex1 tr" type="text"
						name='enterpriseAddress' v-model="info.enterpriseAddress"
						placeholder="请输入"
						/>
					</view> -->
					
				</view>
			</view>
			<view class="submit-wrap fixed-btn">
				<button :disabled="submitting" formType="submit" class="tj">提交</button>
			</view>
		</form>
	</view>
</template>

<script>
	var graceChecker = require("@/common/graceChecker.js");
	
	export default {
		data() {
			return {
				orgIndex:0,
				orgList:[{code:"", name:"请选择"}],
				typeIndex: 0,
				problemTypeCode:"",
				problemType:[{code:"", title:"请选择"}],//类型
				info:{
					signUser:this.$store.state.user.nickname,
					signPhone:this.$store.state.user.mobile
				},
				submitting:false,
				imei:"",//用户唯一识别码
			}
		},
		onLoad(option) {
			if(option.pageName){
				this.pageName = option.pageName;
				uni.setNavigationBarTitle({
					title: '新增' + option.pageName
				})
			}
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
			this.init();
		},
		methods: {
			init(){
				this.getOrg();
				this.getTypes();
			},
			getOrg(){
				this.$http.get(`/mobile/popularWill/orgs`).then(res => {
					console.log('res',res)
					this.orgList = res;
				})
			},
			orgChange(e){
				console.log('e',e)
				let val = e.detail.value;
				this.orgIndex = val;
				let orgId = this.orgList[this.orgIndex].id;
				console.log('this.orgId',orgId)
			},
			getTypes(){
				this.$http.get(`/mobile/popularWill/types`).then(res => {
					console.log('res',res)
					this.problemType = res;
					uni.setStorageSync('willType', res)
				})
			},
			problemTypeChange(e){
				console.log('e',e)
				let val = e.detail.value;
				this.typeIndex = val;
				this.problemTypeCode = this.problemType[this.typeIndex].id;
				console.log('this.problemTypeCode',this.problemTypeCode)
			},
			/* 提交 */
			formSubmit: function(e) {
				let _self = this;
				e.detail.value = this.info;
				e.detail.value.orgId =  this.orgList[this.orgIndex].id;
				e.detail.value.type = this.problemType[this.typeIndex].code;//类型Code
				e.detail.value.content = this.info.content;
				e.detail.value.source = this.$config.source;//数据来源
				e.detail.value.imei = this.imei;
				//定义表单规则
				var rule = [
					{
						name: "title",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请输入标题"
					},
					{
						name: "orgId",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请选择部门"
					},
					{
						name: "type",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请选择类型"
					},
					{
						name: "content",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请输入内容"
					},
					{
						name: "signUser",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请输入联系人"
					},
					{
						name: "signPhone",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请输入联系电话"
					},
					// {
					// 	name: "enterpriseAddress",
					// 	checkType: "string",
					// 	checkRule: "1,",
					// 	errorMsg: "请输入联系地址"
					// }
				]; 
				if(this.info.signPhone){
					rule.push({
						name: "signPhone",
						checkType: "phoneno",
						checkRule:"",
						errorMsg: "请输入正确的号码"
					})
				}
				let params = e.detail.value;
				var checkRes = graceChecker.check(e.detail.value, rule);
				if (checkRes) {
					console.log('formData',params);
					// return false
					this.submitting = true;
					this.$http.post('/mobile/popularWill/sign', params).then(formData => {
						uni.showToast({title: "提交成功",icon: 'none'});
						let pages = getCurrentPages();
						let index = 0;
						for (let page of pages) {
							index++;
						  if (page.route === 'PGov/pages/popularWill/popularWill-add') {
							break;
						  }
						} 
						uni.navigateBack({delta: pages.length - index});
						this.submitting = false;
					}).catch(()=> {
						this.submitting = false;
					});
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
	.form-body{
		padding-bottom: 60px;
	}
	.fixed-btn{
		bottom:0;
		/* #ifdef APP-PLUS */
		bottom: 0;
		z-index:99999;
		/* #endif */
	}
	.model-title{
		padding-left: 15px;
		margin:0 -15px;
		height: 54px;
		line-height: 54px;
		background-color: #FBFBFB;
		font-size:14px;
	}
	.radio{
		font-size:14px;
		/deep/ uni-checkbox .uni-checkbox-input{
			border-radius: 50%;
			outline: none;
		}
		/deep/ uni-checkbox:not([disabled]) .uni-checkbox-input:hover{
			color:#1ea687;
			border-color: #1ea687;
		}
	}
	.btn-delete{
		color: #1ea687;
		float: right;
	}
	.btn-add{
		text-align: center;
		font-size: 14px;
		color: #1ea687;
		display: block;
		padding: 10px 0;
		border-radius: 3px;
		margin-bottom: 15px;
		.icon-tianjia{
			margin-right: 10px;
		}
	}
	
	
	.map-wrap{
		margin:10px 0;
		overflow: hidden;
		height: 230px;
		position: relative;
	}
	/deep/ uni-map{
		width: 100%;
		height: 100%
	}
	
	@keyframes bounce {
		0%{
			transform: translateY(0px);
		}
		50%{
			transform: translateY(-10px);
		}
		100%{
			transform: translateY(0px);
		}
	}
	
	.cover-view {
		position: absolute;
		top:50%;
		left:50%;
		z-index: 999;
		width: 30px;
		height: 40px;
		margin-top:-30px;
		margin-left: -15px;
	}
	.model-item .smallInput{
		width: 56px;
		display: inline-block;
		vertical-align: -6px;
		text-align: center;
		border-bottom: 1px solid #333;
		height: 23px;
	}
	
	.atts-item {
		padding:0;
		height: 60px;
		border: 1px solid #F2F2F2!important;
		background: #FBFCFE;
		margin-bottom: 10px;
		position: relative;
		.atts-image {
			width: 60px;
			height: 60px;
			padding: 10px;
		}
	
		.no-image {
			position: absolute;
			top: 10px;
			left: 10px;
			max-width: 40px;
			max-height: 40px;
			border: none;
			box-shadow: none;
		}
	
		.is-image {
			width: 40px;
			height: 40px;
			border: none;
			box-shadow: none;
		}
	}
	.atts-shanchu {
		display: inline-block;
		width: 50px;
		height: 30px;
		margin-top: 15px;
		text-align: center;
		
		.icon-shanchu {
			font-size: 16px;
			color: #ccc;
		}
	}
	
	.choose-btn{
		border-radius: 5px;
		overflow: hidden;
		font-size:14px;
		uni-text{
			display: inline-block;
			min-width:44px;
			text-align: center;
			background-color: #ccc;
			color:#fff;
			&:first-child{
				border-right: 1px solid #fff;
			}
		}
		.current{
			background-color: #277af5;
		}
	}
</style>
