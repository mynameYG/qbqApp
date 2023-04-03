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
					<view class="model-item">
						<view class="model-label require">内容</view>
						<view class="model-editText no-ml heigthAuto">
							<textarea maxlength="-1" name="content" v-model="info.content" placeholder="请输入内容" placeholder-class="gray-place" class="flex1 model-textarea"></textarea>
						</view>
					</view>
					<!-- <view class="model-item flex flexmid">
						<text class="model-label require">联系人</text>
						<input class="model-editText no-ml flex1 tr" type="text"
						name='createUser' v-model="info.createUser"
						placeholder="请输入"
						/>
					</view>
					<view class="model-item flex flexmid">
						<text class="model-label require">联系电话</text>
						<input class="model-editText no-ml flex1 tr" type="number"
						name='createPhone' v-model="info.createPhone"
						placeholder="请输入"
						/>
					</view>
					<view class="model-item flex flexmid">
						<text class="model-label">联系地址</text>
						<input class="model-editText no-ml flex1 tr" type="text"
						name='enterpriseAddress' v-model="info.enterpriseAddress"
						placeholder="请输入"
						/>
					</view> -->
					<template v-if="channelCode =='gwgx'">
						<view class="model-item whiteBg no-bb">
							<view class="flex flexmid">
								<text class="model-label">附件</text>
								<view class="flex1 tr" @click="chooseImage()">
									<view class="file-border">
										<text class="iconfont icon-tianjia"></text>
									</view>
								</view>
							</view>
							<!-- <tki-file-manager ref="fileListDome" @result="resultPath($event,fileList,'')"></tki-file-manager> -->
							<!-- <attachmentUpload :file="fileList" @getFile="getFile"></attachmentUpload> -->
						</view>
						<view class="model-item atts-item" v-for="(image,index) in fileList" :key="image.id">
							<view class="flex flexbet">
								<view class="atts-image">
									<image class="is-image" :src="fileRUrl(image.filePath)" :data-src="fileRUrl(image.filePath)" @tap="previewImage"></image>
								</view>
								<text class="atts-shanchu" @click="del(index)">
									<text class="iconfont icon-shanchu"></text>
								</text>
							</view>
						</view>
					</template>
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
				id:"",
				channelCode:"",
				info:{},
				fileList: [],//合同附件
				submitting:false,
				imei:"",//用户唯一识别码
			}
		},
		onLoad(option){
			this.id = option.channelId;
			this.channelCode = option.channelCode;
			if(option.pageName){
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
		},
		methods: {
			chooseImage() {
				let _self = this;
				uni.chooseImage({
					sourceType: ['camera', 'album'],
					sizeType: ['compressed', 'original'],
					count: 9,
					success: (res) => {
						// console.log('res',res)
						let arr = [];
						arr = res.tempFilePaths;
						arr.forEach((r) =>{
							this.$http.uploadFile({
								filePath: r
							}).then(data => {
								if(this.matchType(data.orginName) !== 'image'){
									uni.showToast({
										title: '请上传图片文件',
										icon: 'none'
									})
									return false;
								}
								_self.fileList.push({
									fileName: data.orginName,
									filePath: data.path,
									url: data.downloadUrl,
									orginName: data.orginName
								});
							})
						})
						
					},
					fail: (err) => {
						// #ifdef APP-PLUS
						if (err['code'] && err.code !== 0 && this.sourceTypeIndex === 2) {
							this.checkPermission(err.code);
						}
						// #endif
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = false;
								authStatus = res.authSetting['scope.album'] && res.authSetting['scope.camera'];
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: '需要从您的相机或相册获取图片，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				})
			},
			del(index){
				if(index == 0){
					this.fileList = []
				}else{
					this.fileList = this.fileList.splice(index, 1);
				}
			},
			previewImage(){
				let imgList =[];
				this.fileList.forEach(item =>{
					imgList.push(this.fileRUrl(item.filePath));
				})
				uni.previewImage({
					urls: imgList,
					current: imgList[0]
				});
			},
			/* 提交 */
			formSubmit: function(e) {
				let _self = this;
				e.detail.value = this.info;
				e.detail.value.channelId = this.id;//类型Code
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
					// {
					// 	name: "channelId",
					// 	checkType: "string",
					// 	checkRule: "1,",
					// 	errorMsg: "请选择咨询类型"
					// },
					{
						name: "content",
						checkType: "string",
						checkRule: "1,",
						errorMsg: "请输入内容"
					},
					// {
					// 	name: "createUser",
					// 	checkType: "string",
					// 	checkRule: "1,",
					// 	errorMsg: "请输入联系人"
					// },
					// {
					// 	name: "createPhone",
					// 	checkType: "string",
					// 	checkRule: "1,",
					// 	errorMsg: "请输入联系电话"
					// },
					// {
					// 	name: "enterpriseAddress",
					// 	checkType: "string",
					// 	checkRule: "1,",
					// 	errorMsg: "请输入联系地址"
					// }
				]; 
				if(this.channelCode == 'gwgx'){
					let postFile = [];
					for (var i = 0; i < this.fileList.length; i++) {
						postFile.push({
							fileName: this.fileList[i].fileName,
							filePath: this.fileList[i].filePath,
						})
					};
					e.detail.value.files = [];
					e.detail.value.files = postFile;
				}
				let params = e.detail.value;
				var checkRes = graceChecker.check(e.detail.value, rule);
				if (checkRes) {
					this.submitting = true;
					let addJson = {
						'hyb':'/mobile/echo/signUp',
						'gwgx':'/mobile/perception/signUp'
					}
					console.log('formData',params,addJson[this.channelCode]);
					// return false
					this.$http.post(addJson[this.channelCode], params).then(formData => {
						uni.showToast({title: "提交成功",icon: 'none'});
						let pages = getCurrentPages();
						console.log('pages',pages)
						let index = 0;
						for (let page of pages) {
						  if (page.route === 'PGov/pages/says/says-add') {
							break;
						  }
						  index++;
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
