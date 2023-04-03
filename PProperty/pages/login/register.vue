<template>
	<view>
		<view class="login-top">
			<image src="../../../static/img/logo.png"></image>
			<view class="login-top-text">
				<!-- <view class="login-top-name">{{$store.state.projectName}}</view> -->
				<view class="login-top-name">{{projectName}}</view>
			</view>
		</view>
		<!-- <view class="login-bg-up"></view> -->
		<view class="login-bg-down"></view>
		<view class="login">
			<view class="login-inner">
				<view class="login-mid">
					<form @submit="formSubmit">
						<view class="model-wrap" style="margin-top:45px">
							<view class="model-box no-mb clearfix" style="background-color: transparent;">
								<template v-if="userType == 'proprietor'">
									<view class="model-item flex flexmid" @click="$refs.host.choose()">
										<text class="model-label require">所属楼栋</text>
										<view name="buildingId" class="model-editText tr flex1 text-ellipsis">
											<text class="gray-place" v-if="host.length < 1">请选择</text>
											<person-picker ref="host" :persons.sync="host" type="host" :multi="false" pname="选择所属楼栋"></person-picker>
										 </view>
										<text class="model-decorate"><text class="iconfont icon-you"></text></text>
									</view>
									<view class="model-item flex flexmid">
										<text class="model-label require">所属单元</text>
										<picker  name="buildingUnit" class="model-editText tr flex1 text-ellipsis placeholder" @change="buildingUnitChange" :value="buildingUnitIndex"
										 :range="buildingUnitList" range-key="name">
											<view class="uni-input">{{buildingUnitList[buildingUnitIndex].name}}</view>
										</picker>
										<text class="model-decorate"><text class="iconfont icon-you"></text></text>
									</view>
									<view class="model-item flex">
										<text class="model-label require">门牌号</text>
										<input class="model-decorate flex1 tr ml15" type="text" name="doorNo" title="请输入门牌号" placeholder="请输入门牌号" v-model="info.doorNo">
									</view>
								</template>
								<view class="model-item flex">
									<text class="model-label require">注册姓名</text>
									<input class="model-decorate flex1 tr ml15" type="text" name="name" placeholder="请输入注册姓名" v-model="info.name">
								</view>
								<template v-if="userType == 'register'">
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
								</template>
								<view class="model-item flex">
									<text class="model-label require">手机号</text>
									<input class="model-decorate flex1 tr ml15" type="text" name="mobile" placeholder="请输入手机号(登录号)" v-model="info.mobile">
								</view>
								<view class="model-item flex" style="margin-bottom:30px">
									<text class="model-label require">密码</text>
									<input class="model-decorate flex1 tr ml15" type="password" name="password" placeholder="请输入密码" v-model="info.password">
								</view>
								<button :disabled="submitting" formType="submit" class="tj">提交</button>
								<view class="tr mt10">
									<text class="btn-register mr15" @click="jump('/PProperty/pages/login/login')">去登录</text>	
									<!-- <text v-if="userType == 'proprietor'" class="btn-register" @click="jump('/pages/login/register?type=register')">访客注册</text> -->
									<text v-if="userType == 'register'" class="btn-register" @click="jump('/PProperty/pages/login/register?type=proprietor')">业主注册</text>
								</view>
							</view>
						</view>
					</form>
				</view>
			</view>
		
		</view>
	</view>

</template>
<script>
	var graceChecker = require("@/common/graceChecker.js");
	import PersonPicker from "../contacts/address-picker.vue"
	import {
		mapState,
		mapMutations
	} from 'vuex'
	var first = null;
	export default {
		components:{
			PersonPicker
		},
		data() {
			return {
				userType:"",
				projectName:this.$config.projectName,
				info:{},
				sex:true,
				submitting:false,
				host:[],
				communityId:"",
				buildingUnitIndex:0,
				buildingUnitList: [{
					code:0,
					name:"请选择"
				}],//单元列表
			}
		},
		onLoad(option){
			this.userType = option.type;
			console.log("this.userType ",this.userType )
		},
		mounted() {
		},
		watch:{
			host(val){
				this.buildingUnitIndex = 0;
				console.log('val',val)
				if(val[0].buildingUnits){
					this.buildingUnitList = [];
					this.buildingUnitList.unshift({
						code:0,
						name:"请选择"
					})
					for (var i = 0; i < val[0].buildingUnits.length; i++) {
						console.log('i',val[0].buildingUnits[i])
						this.buildingUnitList.push({
							code: i + 1,
							name:val[0].buildingUnits[i]+'单元',
						})
					}
				}
			}
		},
		methods: {
			...mapMutations(['login', 'setResources']),
			buildingUnitChange(e) {
				//console.log('picker发送选择改变，携带值为：' + e.target.value)
				this.buildingUnitIndex = e.target.value;
			},
			// 性别
			vacationChange(e){
				let value = e.detail.value;
				console.log('value',value)
				this.sex = JSON.parse(value);
			},
			/* 提交 */
			formSubmit: function(e) {
				let _self = this;
				e.detail.value = this.info;
				e.detail.value.type  = this.userType;
				if(this.host.length > 0){
					e.detail.value.buildingId = this.host[0].id; 
				}
				if(this.userType == 'proprietor'){
					//console.log('this.buildingUnitList[this.buildingUnitIndex]',this.buildingUnitList[this.buildingUnitIndex])
					e.detail.value.buildingUnit = this.buildingUnitList[this.buildingUnitIndex].name.replace(/单元/, ""); 
					//console.log('e.detail.value.buildingUnit',e.detail.value.buildingUnit)
				}else{
					e.detail.value.sex = this.sex ? 0 : 1; 
				}
				//定义表单规则
				var yzRule = [
					{
						name: "buildingId",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请选择所属楼栋"
					},
					{
						name: "buildingUnit",
						checkType: "notnull",
						errorMsg: "请选择所属单元"
					},
					{
						name: "doorNo",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请输入门牌号"
					},
					{
						name: "name",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请输入注册姓名"
					},
					{
						name: "mobile",
						checkType: "string",
						checkRule:"1,",
						errorMsg: "请输入手机号"
					},
					{
						name: "password",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请输入密码"
					},
				]; 
				var fkRule = [
					{
						name: "name",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请输入注册姓名"
					},
					{
						name: "mobile",
						checkType: "string",
						checkRule:"1,",
						errorMsg: "请输入手机号"
					},
					{
						name: "password",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请输入密码"
					},
				]; 
				if(e.detail.value.mobile){
					let itemPhone = {
						name: "mobile",
						checkType: "phoneno",
						checkRule:"",
						errorMsg: "请输入正确的手机号"
					}
					if(this.userType == 'proprietor'){
						yzRule.push(itemPhone)
					}else{
						fkRule.push(itemPhone)
					}
				}
				if(e.detail.value.password){
					let itemPassword = {
						name: "password",
						checkType: "reg",
						checkRule:"^[a-zA-Z0-9_-]{6}$",
						errorMsg: "密码最少6位"
					}
					if(this.userType == 'proprietor'){
						yzRule.push(itemPassword)
					}else{
						fkRule.push(itemPassword)
					}
				}
				let params = e.detail.value;
				var checkRes;
				if(this.userType == 'proprietor'){
					checkRes  = graceChecker.check(e.detail.value, yzRule);
				}else{
					checkRes  = graceChecker.check(e.detail.value, fkRule);
				}
				if (checkRes) {
					console.log('formData',params);
					// return false
					this.submitting = true;
					this.$http.post('/mobile/pub/regist', params).then(formData => {
						uni.showToast({title: "注册成功",icon: 'none'});
						setTimeout(()=>{
							this.jump('/PProperty/pages/login/login')
						},1000)
						/* let pages = getCurrentPages();
						if (pages.length > 1) {
							this.pageBack('refreshTabData',);
						}else{
							this.pageBack();
						}
						this.submitting = false; */
					}).catch((err)=> {
						uni.showToast({
							icon: 'none',
							title: err.msg
						});
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
	.login-bg-down{
		position: absolute;
		bottom:0;
		left:0;
		width:100%;
		height: 28vh;
		background: url('/PProperty/static/img/login-down.png');
		background-size: 100% 100%;
	}
	.login-top {
		padding: 13% 0 14%;
		text-align: center;
	
		image {
			width: 100px;
			height: 100px;
			margin-right: 5px;
			vertical-align: middle;
			display: block;
			margin: 0 auto;
		}
	
		.login-top-text {
			margin-top: -10px;
			display: inline-block;
			vertical-align: middle;
			text-align: left;
	
			.login-top-name {
				font-size: 18px;
				color: #333;
				font-weight: 700;
			}
	
			.login-top-english {
				font-size: 14px;
				color: #999;
			}
		}
	}
	.login {
		position: absolute;
		top: 50%;
		width:100%;
		min-height: 180px;
		transform: translateY(-40%);
		// padding:0 10%;
		box-sizing: border-box;
	}
	.login-inner{
		width:100%;
		height: 100%;
		padding-bottom: 50px;
		border-radius: 15px;
	}

	.login-mid {
		font-size: 15px;
		.tj {
			width: 100%;
			height: 40px;
			background-color: #1B6EE6;
			border-radius:18px;
			font-size: 15px;
			color: #fff;
			line-height: 40px;
			padding: 0 !important;
			border: none;
		}
	}

	.login-box {
		margin-bottom: 25px;
		border-bottom: 1px solid #e6e6e6;
		padding:8px 10px;
		padding-left: 0;

		.iconfont {
			margin-right: 6px;
			width: 18px;
			height: 18px;
			color: #DDD;
		}

		input {
			height: 20px !important;
			padding: 0 5px !important;
			margin: 0;
			font-size: 15px;
			color: #333;
			line-height: 20px;
			border: none !important;
		}
	}

	.login-tip {
		margin-bottom: 20px;

		.login-remeber {
			font-size: 14px;
			color: #949494;
			line-height: 20px;

			input {
				margin-right: 6px;
			}

		}
	}

	/* #ifdef H5 */
	uni-checkbox .uni-checkbox-input {
		border-radius: 50% !important;
		color: #ffffff !important;
	}

	uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		color: #fff;
		background: #18AE65;
	}

	.uni-checkbox-input.uni-checkbox-input-checked {
		border: none !important;
	}

	/* #endif */
	/* 微信中样式 */
	/* #ifdef APP-PLUS ||MP-WEIXIN */
	checkbox .wx-checkbox-input {
		border-radius: 50% !important;
		color: #ffffff !important;
	}

	checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		color: #fff;
		background: #18AE65;
	}

	.wx-checkbox-input.wx-checkbox-input-checked {
		border: none !important;
	}

	/* #endif */
	.login-code{
		border-bottom:0;
		.code-input{
			border-bottom: 1px solid #e6e6e6;
		}
		.icon-yanzhengma{
			font-size: 20px;
		}
		.code-btn{
			padding:0;
			margin-left: 5px;
			width:100px;
			height: 40px;
			line-height: 40px;
			font-size:14px;
			background-color: #FFF;
			border:1px solid #e6e6e6;
			.code-img{
				width:100%;
				height: 100%;
			}
		}
		.code-btn-disable{
			background-color:#e6e6e6 ;
		}
	}
	.model-item{
		padding:10px 0;
	}
	.model-item .model-decorate{
		min-width: 18px;
		height: 100%;
	}
	.btn-register{
		margin-top: 10px;
		text-align: right;
		font-size: 14px;
	}
	 .placeholder .uni-input{
		color:#999;
	 }
	 @media screen and (max-height:600px) {
		 .login-top {
			 padding-top:35px;
		 }
		/deep/.login-top uni-image{
			width: 80px;
			height: 80px;
		}
	 }
</style>
