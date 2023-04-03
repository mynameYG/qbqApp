<template>
	<view class="bg p15">
		<view class="detail-wrap">
			<view class="detail-title flex">
				<text class="detail-text flex1">{{info.title||'-'}}</text>
			</view>
			<view class="detail-item flex">
				<text class="detail-text flex1">
					<jyf-parser class="art-con" :html="info.content" :domain="fileUrl('/r')"></jyf-parser>
				</text>
			</view>
		</view>
		<view class="field-box pl10 pr10" v-for="(item,index) in info.questions" :key="index">
			<view class="field-item no-bb flex flexmid">
				<text class="field-title">{{index+1}}.{{item.title}}</text>
			</view>
			<template v-if="item.type.value == 'text'">
				<view class="field-item no-bb flex">
					<textarea maxlength="-1" name="content" v-model="item.content" placeholder="请输入" placeholder-class="gray-place" class="flex1 model-textarea"></textarea>
				</view>
			</template>
			<template v-if="item.type.value == 'radio'">
				<view class="field-item no-bb">
					<radio-group @change="checkboxChange">
						<view class="contacts-smalllink mb10" v-for="(option,i) in item.options" :key="i" >
							<label class="org-checkbox flex flexmid">
								<radio color="#1B6EE6" :value="option.id + '-' + item.id" style="transform: scale(0.7);" />
								<view class="contacts-smallmid flex1">
									<view class="contacts-smallname">{{option.title}}</view>
								</view>
							</label>
						</view>
					</radio-group>
				</view>
			</template>
			<template v-if="item.type.value == 'checkbox'">
				<view class="field-item no-bb">
					<checkbox-group @change="checkboxChange">
						<view class="contacts-smalllink mb10" v-for="(option,i) in item.options" :key="i" >
							<label class="org-checkbox flex flexmid">
								<checkbox color="#1B6EE6" style="transform: scale(0.7);" :value="option.id + '-' + item.id"/>
								<view class="contacts-smallmid flex1">
									<view class="contacts-smallname">{{option.title}}</view>
								</view>
							</label>
						</view>
					</checkbox-group>
				</view>
			</template>
		</view>
		<view class="submit-wrap fixed-btn">
			<button :disabled="submitting" :class="status !='inProgress' ?'disabled' :''"  @tap="signUp" class="tj">提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				id:"",
				status:"",
				info:{},
				submitting:false,
				imei:"",//用户唯一识别码
			}
		},
		onLoad(option) {
			this.id = option.id;
			this.status = option.status;
			// if(this.status == 'inProgress'){
			// 	this.submitting = false;
			// }else{
			// 	this.submitting = true;
			// }
			if(option.pageName){
				uni.setNavigationBarTitle({
					title:option.pageName
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
			this.init()
		},
		methods:{
			init(){
				this.$http.get(`/mobile/survey/${this.id}`).then(res => {
					this.info =  res;
				}).catch(err => {
					err && uni.showToast({title: err,icon: 'none'})
				});
			},
			checkboxChange: function (e) {
				// console.log('e---',e)
				const values = e.detail.value;
				let typeofV = typeof values;
				
				let options = [];
				let questionId = "";
				
				if(typeofV == 'string'){
					let list = values.split('-');
					options.push(list[0]);
					questionId = list[1];
				}else{
					values.forEach(item =>{
						let list = item.split('-');
						options.push(list[0]);
						questionId = list[1];
					})
				}
				// this.listItem.forEach(item =>{
				// 	if(item.questionId == questionId){
				// 		item.options = options;
				// 	}
						
				// })
				this.info.questions.forEach(item =>{
					let pushOptions = [];
					if(item.id == questionId){
						item.pushOptions = options;
					}
				})
				
				console.log('this.listItem',this.info.questions)
			},
			//投票
			signUp(){
				if(this.status == 'end'){
					uni.showToast({title: "问卷调查已结束",icon: 'none'});
					return false
				}
				if(this.status == 'notStarted'){
					uni.showToast({title: "问卷调查未开始",icon: 'none'});
					return false
				}
				let pushItem = this.info.questions.map(function(item){
				  return {
				          questionId: item.id,
				          content: item.content,
				          options: item.pushOptions
				      }
				})
				let params = {
					details:pushItem
				};
				// console.log('info.questions',params)
				// return false;
				this.submitting = true;
				this.$http.post(`/mobile/survey/${this.id}?user=${this.imei}`,params).then(formData => {
					uni.showToast({title: "提交成功",icon: 'none'});
					setTimeout(() => {
						let pages = getCurrentPages();
						let index = 0;
						for (let page of pages) {
						  if (page.route === 'PGov/pages/survey/survey-detail') {
							break;
						  }
						  index++;
						} 
						uni.navigateBack({delta: pages.length - index});
					}, 2000)
					this.submitting = false;
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
	@import '@/PStore/common/detail.scss';//公共样式
	@import '@/PStore/common/form.scss';//公共样式
	.bg{
		padding-bottom: 70px!important;
	}
	.model-item .model-label{
		color:#666;
	}
	.model-editText{
		.img{
			width:90px;
			height: 64px;
		}
	}
	.detail-wrap .detail-title{
		font-size:32upx;
		text-align: center;
		font-weight: 600;
	}
	.detail-wrap .detail-item .detail-label{
		min-width: 112upx;
	}
	/deep/uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked{
		border-color:#1B6EE6;
		background-color:#1B6EE6 ;
		color:#fff!important;
	}
	.field-box{
		padding-bottom: 30upx;
		font-size: 28upx;
		uni-textarea.model-textarea{
			height: auto;
			padding: 8upx;
			border:1px solid #EEEEEE;
			border-radius: 10upx;
			font-size: 28upx;
		}
		.field-item + .field-item{
			padding:0;
		}
	} 
</style>
