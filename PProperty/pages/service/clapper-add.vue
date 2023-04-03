<template>
	<view class="form-body">
		<form @submit="formSubmit">
			<view class="model-wrap p15">
				<view class="model-box no-mb clearfix">
					<view class="model-item flex flexmid">
						<text class="model-label require">问题类型</text>
						<picker class="model-editText tr flex1 text-ellipsis" @change="problemTypeChange" :value="typeIndex" :range="problemType" range-key="title">
							<view class="uni-input">{{problemType[typeIndex].title}}</view>
						</picker>
						<text class="model-decorate"><text class="iconfont icon-you"></text></text>
					</view>
					<view class="model-item flex flexmid">
						<text class="model-label require">位置</text>
						<input type="text" placeholder-class="gray-place" class="model-editText tr flex1 text-ellipsis">
						<text class="model-decorate" @click="getLocation"><text class="iconfont icon-dingwei" style="font-size:25px"></text></text>
					</view>
					<view class="map-wrap">
						<map class="maps" id="maps" ref="maps" :latitude="latitude" :longitude="longitude" :markers="covers"  scale="19" 
						@regionchange="getCenterLocation" >
						</map>
					</view>
					<view class="model-item">
						<view class="model-label">问题描述</view>
						<view class="model-editText no-ml heigthAuto">
							<textarea maxlength="-1" name="descripe" v-model="info.descripe" placeholder="请输入问题描述" placeholder-class="gray-place" class="flex1 model-textarea"></textarea>
						</view>
					</view>
				<!-- 	<view class="model-item flex flexmid">
						<text class="model-label">联系人</text>
						<input class="model-editText no-ml flex1 tr" type="text"
						name='title' v-model="info.userName"
						placeholder="请输入"
						/>
					</view> -->
					<view class="model-item flex flexmid">
						<text class="model-label require">联系电话</text>
						<input class="model-editText no-ml flex1 tr" type="number"
						name='phone' v-model="info.phone"
						placeholder="请输入"
						/>
					</view>
					<view class="model-item whiteBg no-bb">
						<view class="flex flexmid">
							<text class="model-label require">照片</text>
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
				</view>
			</view>
			<view class="submit-wrap fixed-btn">
				<button :disabled="submitting" formType="submit" class="tj">提交</button>
			</view>
		</form>
	</view>
</template>

<script>
	// #ifdef MP-WEIXIN
	var tMap;
	// #endif 
	var graceChecker = require("@/common/graceChecker.js");
	export default {
		data() {
			return {
				area:"",
				typeIndex: 0,
				problemTypeCode:"",
				problemType:[{code:"", title:"请选择"}],//类型
				info:{
					descripe:"",
					phone:this.$store.state.user.mobile
				},
				address:"",
				fileList: [],//合同附件
				submitting:false,
				longitude:"",
				latitude:"",
				covers:[],
				animation:false,
				imei:"",//用户唯一识别码
			}
		},
		onShow(){
			// #ifdef MP-WEIXIN
			tMap =new this.TMap({key:'Y74BZ-B33CU-LDOVJ-2FAJI-4BMDE-2DB4D'});
			// #endif
		},
		onLoad(option) {
			console.log('onLoad')
			this.area = option.area;
			this.problemTypeCode = option.type;
			// #ifdef MP-WEIXIN
			this.getWxCode().then(data =>{
				console.log('data-----',data)
				this.imei = data.code
			})
			// #endif
			//this.getLocation();
			
		},
		mounted(){
			this.init();
		},
		methods: {
			init(){
				this.map = uni.createMapContext("maps", this);
				this.getLocation();
				this.getTypes();
			},
			getTypes(){
				this.$http.get(`/mobile/event/types`).then(res => {
					//console.log('res',res)
					this.problemType = res;
					res.forEach((item, index) => {
						if (item.code == this.problemTypeCode) {
							this.typeIndex = index;
						}
					});
				})
			},
			// 获取定位
			getLocation() {
				let _self = this;
				uni.getLocation({
				    type: 'gcj02',
					geocode:true,
				    success: function (res) {
						//console.log('res--------',res.address.length)
				        console.log('经度：' + res.longitude);
				        console.log('纬度：' + res.latitude);
						_self.longitude =  res.longitude;
						_self.latitude =  res.latitude;
						// _self.longitude =  113.543351;
						// _self.latitude =  34.793475;
						_self.covers = [];
						_self.covers.push({
							width: 25,
							height: 30,
							longitude:_self.longitude,
							latitude: _self.latitude,
							iconPath: '../../../static/img/location.png',
						});
						_self.map.moveToLocation({
							longitude:_self.longitude,
							latitude:_self.latitude
						})
						console.log('0')
						//_self.address = res.address.province + res.address.city +  res.address.district + res.address.street + (res.address.poiName || "");
						//console.log('_self.longitude',_self.longitude, _self.info.address)
					},
					fail() {
						uni.showToast({
							title: '找不到您的位置，请开启定位',
							icon: 'none'
						})
					}
				});
			},
			/**
			* 解决打包后 Cover-image访问不到图片的问题
			 * @param {Object} fileName
			*/
			getFileLocalPath(fileName) {
				// #ifndef	 H5
				return "file:/" + plus.io.convertLocalFileSystemURL("_www"+fileName);
				// #endif 
			},
			problemTypeChange(e){
				let val = e.detail.value;
				this.typeIndex = val;
				this.problemTypeCode = this.problemType[this.typeIndex].code;
			},
			getCenterLocation(e){
				//console.log('e',e)
				let _self = this;
				// 处理拖拽结束时的逻辑  
				this.map.getCenterLocation({
					success: ret => {
						//console.log('getCenterLocation',ret)
						this.covers = [];
						// 添加我的位置
						this.covers.push({
							width: 25,
							height: 30,
							longitude: ret.longitude,
							latitude: ret.latitude,
							iconPath: '../../../static/img/location.png',
						});
						// #ifdef APP-PLUS
						var point = new plus.maps.Point(ret.longitude, ret.latitude);
						plus.maps.Map.reverseGeocode(
							point,
							{},
							function(event) {
								console.log('event',event)
							   _self.address = event.address;
							   if(!_self.address){
								   uni.showToast({
								   	title: '找不到您的位置，请开启定位',
								   	icon: 'none'
								   })
							   }
						})
						// #endif 
					}
				})
			},
			numFilter(value) {
				// 截取当前数据到小数点后三位
				let tempVal = parseFloat(value).toFixed(7)
				let realVal = tempVal.substring(0, tempVal.length - 1)
				return realVal
			},
			chooseImage() {
				let _self = this;
				console.log('1')
				uni.chooseImage({
					sourceType: ['camera', 'album'],
					sizeType: ['compressed', 'original'],
					count: 9,
					success: (res) => {
						console.log('2')
						console.log('res',res)
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
				// #ifdef APP-PLUS 
				var info = plus.push.getClientInfo();
				var vinfo = info.clientid;
				uni.setStorageSync('vinfo', vinfo);
				console.log('vinfo',vinfo)
				this.imei = vinfo;
				/* plus.nativeUI.toast("info.clientid" + plus.push.getClientInfo().clientid); */
				// #endif
				// 获取中心点
				this.map.getCenterLocation({
					success: ret => {
						let postLong = this.numFilter(ret.longitude);
						let postLat =  this.numFilter(ret.latitude);
						e.detail.value.area = this.area;
						e.detail.value.lng = postLong;
						e.detail.value.lat = postLat;
						e.detail.value.type = this.problemType[this.typeIndex].code;//类型Code
						// e.detail.value.address = this.address;
						e.detail.value.descripe = this.info.descripe;
						e.detail.value.phone = this.info.phone;
						e.detail.value.imei = this.imei;
						e.detail.value.mapType = this.$config.mapType;//地图类别
						e.detail.value.source = this.$config.source;//数据来源
						//定义表单规则
						var rule = [
							{
								name: "type",
								checkType: "string",
								checkRule: "1,",
								errorMsg: "请选择问题类型"
							},
							{
								name: "lng",
								checkType: "string",
								checkRule: "1,",
								errorMsg: "请选择地址"
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
						let postFile = [];
						for (var i = 0; i < this.fileList.length; i++) {
							postFile.push({
								filename: this.fileList[i].fileName,
								path: this.fileList[i].filePath,
							})
						};
						e.detail.value.attachs = [];
						e.detail.value.attachs = postFile;
						let params = e.detail.value;
						var checkRes = graceChecker.check(e.detail.value, rule);
						if (checkRes) {
							// console.log('this.fileList',this.fileList);
							if(params.attachs.length < 1){
								uni.showToast({
									icon: 'none',
									title: '请上传照片'
								});
								return;
							}
							// delete params.address//删除address
							console.log('formData',params);
							// return false
							this.submitting = true;
							this.$http.post('/mobile/event/', params).then(formData => {
								console.log('*****')
								uni.showToast({title: "提交成功",icon: 'none'});
								let pages = getCurrentPages();
								let index = 0;
								for (let page of pages) {
								  if (page.route === 'PProperty/pages/service/clapper-area') {
									break;
								  }
								  index++;
								} 
								uni.navigateBack({delta: pages.length - index});
								this.submitting = false;
							}).catch(()=> {
								console.log('*****catch')
								this.submitting = false;
							});
						} else {
							uni.showToast({
								title: graceChecker.error,
								icon: "none"
							});
						}
					}
				})
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
	/* #ifdef MP-WEIXIN */
		.maps{
			width: 100%;
			height: 100%
		}
	/* #endif */
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
	.animation{
		//animation: bounce 0.3s !important;
		animation: bounce infinite 2s ease;
		-webkit-animation: bounce infinite 2s ease;
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
