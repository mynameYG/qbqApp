<template>
	<view class="form-body">
		<form @submit="formSubmit">
			<view class="model-wrap p15">
				<view class="model-box no-mb clearfix">
					<view class="model-item flex flexmid">
						<text class="model-label require">标题</text>
						<input class="model-editText no-ml flex1 tr" type="text" 
						name='title' v-model="info.title"
						placeholder="请输入标题"
						/>
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
						<view class="model-editText no-ml heigthAuto" style="height: 150px!important;">
							<textarea maxlength="-1" name="content" style="height: 150px;max-height: 150px;" v-model="info.content" placeholder="请输入问题描述" placeholder-class="gray-place" class="flex1 model-textarea"></textarea>
						</view>
					</view>
					<view class="submit-wrap fixed-btn">
						<button :disabled="submitting" formType="submit" class="tj">提交</button>
					</view>
				</view>
			</view>
		</form>
	</view>
</template>

<script>
	var graceChecker = require("@/common/graceChecker.js");
	export default {
		data() {
			return {
				typeIndex: 0,
				problemTypeCode:"",
				problemType:[
					{code:"",title:"请选择"},
					],//类型
				info:{},
				submitting:false
			}
		},
		mounted(){
			this.init();
		},
		methods: {
			init(){
				this.getTypes();
			},
			getTypes(){
				this.$http.get(`/mobile/tenement/feedback/types`).then(res => {
					this.problemType = res;
					this.problemType.unshift({
						code:"",
						title:"请选择"
					})
				})
			},
			problemTypeChange(e){
				// this.problemTypeCode = e.code;
				let val = e.detail.value;
				this.typeIndex = val;
				this.problemTypeCode = this.problemType[this.typeIndex].code;
			},
			/* 提交 */
			formSubmit: function(e) {
				let _self = this;
				e.detail.value.title = this.info.title;
				e.detail.value.type = this.problemTypeCode;//类型Code
				e.detail.value.content = this.info.content;
				e.detail.value.source = this.$config.source;//数据来源
				//定义表单规则
				var rule = [
					{
						name: "title",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请输入标题"
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
					}
				]; 
				// if(e.detail.value.timeLimit){
				// 	const times = e.detail.value.timeLimit
				// 	let numReg = /^\d{1,}$/;
				// 	// console.log(numReg.test(times))
				// 	if(!numReg.test(times)){
				// 		uni.showToast({title: "问题处理时限应为整数",icon: 'none'});
				// 		return false
				// 	}
				// }
				
				let params = e.detail.value;
				var checkRes = graceChecker.check(e.detail.value, rule);
				if (checkRes) {
					// console.log('this.fileList',this.fileList);
					console.log('formData',params);
					//return false
					this.submitting = true;
					this.$http.post('/mobile/tenement/feedback', params).then(formData => {
						uni.showToast({title: "新增成功",icon: 'none'});
						let pages = getCurrentPages();
						let index = 0;
						for (let page of pages) {
							index++;
						  if (page.route === 'PProperty/pages/service/feedback-index') {
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
		padding-bottom: 70px;
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
	}
	/deep/ uni-map{
		width: 100%;
		height: 100%
	}
	
	.cover-view {
		position: absolute;
		width:100%;
		height: 100%;
		top: 0;
		left: 0;
		opacity: .01;
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
