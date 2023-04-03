<template>
	<view class="pl15 pr15">
		<view class="model-input-box no-all-p">
			<!-- <view class="model-input-item flex flexmid">
				<span class="model-label">头像：</span>
				<view class="model-img tr flex1">
					<image src="../../static/img/default-photo.png" mode=""></image>
				</view>
			</view> -->
			<template v-if="newlyAdded">
				<view class="model-input-item flex flexmid" @click="$refs.host.choose()">
					<text class="model-label require">所属楼栋</text>
					<view name="buildingId" class="model-editText tr flex1 text-ellipsis">
						<text class="gray-place fs14" v-if="host.length < 1">请选择</text>
						<person-picker ref="host" :persons.sync="host" type="host" :multi="false" pname="选择所属楼栋"></person-picker>
					 </view>
					<text class="model-decorate"><text class="iconfont icon-you"></text></text>
				</view>
			</template>
			<template v-else>
				<view class="model-input-item flex flexmid">
					<text class="model-label require">所属楼栋</text>
					<view name="buildingId" class="model-editText tr flex1 text-ellipsis">
						<text class="gray-place fs14" v-if="host.length < 1">{{buildingName ||'请选择'}}</text>
						<person-picker ref="host" :persons.sync="host" type="host" :multi="false" pname="选择所属区域"></person-picker>
					 </view>
					<text class="model-decorate"><text class="iconfont icon-you"></text></text>
				</view>
			</template>
			<!-- <view class="model-input-item flex flexmid">
				<text class="model-label require">所属楼栋</text>
				<view name="buildingId" class="model-editText tr flex1 text-ellipsis">
					<text class="gray-place" v-if="host.length < 1">{{buildingName ||'请选择'}}</text>
					<person-picker ref="host" :persons.sync="host" type="host" :multi="false" pname="选择所属区域"></person-picker>
				 </view>
				<text class="model-decorate"><text class="iconfont icon-you"></text></text>
			</view> -->
			<view class="model-input-item flex flexmid">
				<text class="model-label require">姓名：</text>
				<input type="text" v-model="info.nickname" placeholder="请输入" class="model-input tr flex1 ">
			</view>
			<view class="model-input-item flex flexmid">
				<text class="model-label require">手机号：</text>
				<input type="text" v-model="info.mobile" placeholder="请输入" class="model-input tr flex1 ">
			</view>
			<view class="model-input-item flex flexmid">
				<text class="model-label require">门牌号：</text>
				<input type="text" v-model="info.doorNo" placeholder="请输入" class="model-input tr flex1 ">
			</view>
			<view class="model-input-item flex flexmid">
				<text class="model-label require">所属单元</text>
				<picker name="buildingUnit" class="field-title tr flex1 text-ellipsis" @change="buildingUnitChange" :value="buildingUnitIndex"
				 :range="buildingUnitList" range-key="name">
					<view class="uni-input">{{buildingUnitList[buildingUnitIndex].name}}</view>
				</picker>
				<text class="model-decorate"><text class="iconfont icon-you"></text></text>
			</view>
		</view>
		<view class="submit-wrap">
			<button type="primary" @click="submitData">保存修改</button>
		</view>
	</view>
</template>

<script>
	import PersonPicker from "../contacts/address-picker.vue"
	export default {
		components:{
			PersonPicker
		},
		data() {
			return {
				info: {},
				submitting:false,
				host:[],
				newlyAdded:false,//是否新增业主信息
				buildingName:"",//所属楼栋
				buildingUnitIndex:0,
				buildingUnitList: [{
					code:0,
					name:"请选择所在单元"
				}],//单元列表
			}
		},
		watch:{
			host(val){
				// this.buildingUnitIndex = 0;
				console.log('val---',val)
				this.buildingName =  val.name;
				if(val[0].buildingUnits){
					this.buildingUnitList = [];
					this.buildingUnitList.unshift({
						code:0,
						name:"请选择"
					})
					for (var i = 0; i < val[0].buildingUnits.length; i++) {
						this.buildingUnitList.push({
							code: i + 1,
							name:val[0].buildingUnits[i]+'单元',
						})
						if (this.buildingUnitList[i].code == (this.info.ext.buildingUnit - 0)) {
							this.buildingUnitIndex = i;
						}else{
							this.buildingUnitIndex = 0
						}
					}
				}
			}
		},
		mounted() {
			this.info = this.$store.state.user;
			this.info = this.$store.state.user;
			this.newlyAdded = this.info.ext.proprietor ? false : true;
			if(!this.newlyAdded){
				this.info.doorNo = this.$store.state.user.ext.proprietor.doorNo;
			}
			
			
			this.init();
		},
		methods: {
			init() {
				this.getBuilding();
				console.log('this.info',this.info)
			},
			buildingUnitChange(e) {
				//console.log('picker发送选择改变，携带值为：' + e.target.value)
				this.buildingUnitIndex = e.target.value;
			},
			getBuilding(){
				let _self = this;
				this.buildingUnitIndex = 0;
				this.$http.get(`/mobile/building`).then(res =>{
					console.log('rs-----',res)
					let Unit = res.buildingUnits;//单元列表
					this.buildingName = res.name;
					this.host.push({
						id:res.id,
						code:res.code,
						name:res.name
					});
					//console.log('this.persons',this.host)
					this.buildingUnitList = [];
					this.buildingUnitList.unshift({
						code:0,
						name:"请选择"
					})
					for (var i = 0; i < Unit.length; i++) {
						this.buildingUnitList.push({
							code: i + 1,
							name:Unit[i]+'单元',
						})
					}
					for (var i = 0; i < this.buildingUnitList.length; i++) {
						if(this.buildingUnitList[i].code == this.info.ext.proprietor.buildingUnit){
							this.buildingUnitIndex = i
						}
					}
				})
			},
			submitData() {
				this.info.buildingUnit = this.buildingUnitList[this.buildingUnitIndex].code;
				
				if (this.host.length < 1) {
					uni.showToast({
						icon: 'none',
						title: '请选择所属楼栋'
					});
					return;
				}
				if (!this.info.nickname) {
					uni.showToast({
						icon: 'none',
						title: '请输入姓名'
					});
					return;
				}
				if (!this.info.mobile) {
					uni.showToast({
						icon: 'none',
						title: '请输入手机号'
					});
					return;
				}
				if (!this.info.doorNo) {
					uni.showToast({
						icon: 'none',
						title: '请输入门牌号'
					});
					return;
				}
				if (!this.info.buildingUnit) {
					uni.showToast({
						icon: 'none',
						title: '请选择所在单元'
					});
					return;
				}
				
				let $phoneRegular = /^1[34578]\d{9}$/;
				let isPhone = $phoneRegular.test(this.info.mobile);
				
				if(!isPhone){
					uni.showToast({
						icon: 'none',
						title: '请输入正确的手机号'
					});
					return;
				}
				
				let params = {
					name: this.info.nickname,
					buildingId: this.host[0].id,
					buildingUnit: this.info.buildingUnit,
					doorNo: this.info.doorNo,
					mobile: this.info.mobile
				};
				console.log('params',params)
				//return
				this.$http.put('/mobile/update/info', params).then(r => {
					uni.showToast({
						icon: 'none',
						title: '修改成功'
					})
					let pages = getCurrentPages();
					let index = 0;
					for (let page of pages) {
					  if (page.route === 'PBusiness/pages/my/my-info') {
						break;
					  }
					  index++;
					} 
					uni.navigateBack({delta: pages.length - index});

				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					})
				});
			}

		}
	}
</script>

<style lang="scss">
	.model-input-box {
		padding: 0 10px;
		margin-bottom: 10px;
		background-color: #fff;

		.model-input-item {
			padding: 15px 0;
			border-bottom: 1px solid #F7F7F7;

			.model-label {
				margin-right: 10px;
				font-size: 14px;
				color: #333;
				line-height: 24px;
			}

			.model-input {
				font-size: 14px;
			}

			.model-img {
				height: 45px;

				image {
					width: 45px;
					height: 45px;
					border-radius: 50%;
				}
			}
		}

		.model-input-item.arrow {
			padding-right: 25px;
		}
	}

	.submit-wrap {
		margin-top: 40px;
		padding: 0 20px;

		button {
			height: 40px;
			line-height: 40px;
			font-size: 14px;
			border: none;
			background-color: #1B6EE6
		}
	}
</style>
