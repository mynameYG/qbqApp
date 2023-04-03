<template>
	<view class="bg p15">
		<view class="detail-wrap">
			<view class="detail-title">
				活动详情
			</view>
			<view class="detail-item mb10" v-if="info.activity.titleImg">
				<image class="img" style="width: 100%;max-height:200px" :src="fileRUrl(info.activity.titleImg)" mode="widthFix"></image>
			</view>
			<view class="detail-item flex">
				<text class="detail-label">标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题</text>
				<text class="detail-text flex1">[{{info.activity.type.title}}]{{info.activity.title||'-'}}</text>
			</view>
			<view class="detail-item flex">
				<text class="detail-label">活动时间</text>
				<text class="detail-text flex1">
					{{dateFilter(info.activity.startDate,'date')}}至{{dateFilter(info.activity.endDate,'date')}}
				</text>
			</view>
			<view class="detail-item flex">
				<text class="detail-label">活动规则</text>
				<text class="detail-text flex1">
					每人限投{{info.activity.limitPer}}票
				</text>
			</view>
			<view class="detail-item flex">
				<text class="detail-label">活动简介</text>
				<text class="detail-text flex1 heigth80">
					{{info.activity.descripe}}
				</text>
			</view>
		</view>
		<view class="detail-title">
			投票选项
		</view>
		<!-- 多选 -->
		<template v-if="info.activity.type.value == 'checkbox'">
			<view class="model-wrap no-all-p">
				<view class="model-item vote-item">
					<checkbox-group @change="checkboxChange">
						<view class="contacts-smalllink mb10" v-for="(item,i) in info.list" :key="i" >
							<label class="org-checkbox flex flexmid">
								<checkbox color="#1B6EE6" style="transform: scale(0.7);" :value="item.id"/>
								<image v-if="item.img" class="img" :src="fileRUrl(item.img)" mode="widthFix"></image>
								<view class="contacts-smallmid flex1">
									<view class="contacts-smallname">{{item.optionText}}</view>
								</view>
							</label>
							<view class="voteCount">得票：{{item.voteCount||'0'}}</view>
						</view>
					</checkbox-group>
				</view>
			</view>
		</template>
		<!-- 单选 -->
		<template v-if="info.activity.type.value == 'radio'">
			<view class="model-wrap no-all-p">
				<view class="model-item vote-item">
					<radio-group @change="checkboxChange">
						<view class="contacts-smalllink mb10" v-for="(item,i) in info.list" :key="i" >
							<label class="org-checkbox flex flexmid">
								<radio color="#1B6EE6" :value="item.id" style="transform: scale(0.7);" />
								<image v-if="item.img" class="img" :src="fileRUrl(item.img)" mode="widthFix"></image>
								<view class="contacts-smallmid flex1">
									<view class="contacts-smallname">{{item.optionText}}</view>
								</view>
							</label>
							<view class="voteCount">得票：{{item.voteCount||'0'}}</view>
						</view>
					</radio-group>
				</view>
			</view>
		</template>
		<view class="submit-wrap fixed-btn">
			<button :disabled="submitting"  @tap="signUp" class="tj">投票</button>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				id:"",
				infoType:"",
				info:{
					activity:{
						type:{
							title:""
						}
					},
					list:[]
				},
				submitting:false,
				optionIds:[]//选中id
			}
		},
		onLoad(option) {
			this.id = option.id;
		},
		mounted(){
			this.init()
		},
		methods:{
			init(){
				this.$http.get(`/mobile/tenement/vote/${this.id}`).then(res => {
					console.log('res',res)
					this.info.activity =  res.vote;
					this.info.list = res.options;
					this.infoType = res.vote.type.value;
					let dateA = (new Date()).getTime();
					let endTime = this.dateFilter(res.activity.endDate,'date') + ' 23:00:00';
					let endDate = new Date(endTime.replace(/-/g,"/")).getTime();
					if(dateA - endDate > 0){
						this.enter = true
					}
				}).catch(err => {
					err && uni.showToast({title: err,icon: 'none'})
				});
			},
			checkboxChange: function (e) {
				console.log('e',e)
				const values = e.detail.value;
				this.optionIds = [];
				console.log('values',values)
				if(this.infoType == 'radio'){
					this.optionIds.push(values);
				}else{
					this.optionIds = values;
				}
				
			},
			//投票
			signUp(){
				//console.log('this.optionIds',this.optionIds,this.optionIds.length)
				if(this.optionIds.length < 1){
					uni.showToast({title: "请选择投票对象",icon: 'none'});
					return
				}else{
					console.log('this.optionIds’',this.optionIds)
					//return false;
					this.$http.post(`/mobile/tenement/vote/${this.id}`,this.optionIds).then(formData => {
						uni.showToast({title: "投票成功",icon: 'none'});
						setTimeout(() => {
							this.init();
						}, 1500)
					}).catch(err => {
						uni.showToast({
							title: err,
							icon: 'none'
						})
					});
				}
				
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
	.vote-item{
		margin-top: 15px;
		background: #fff;
		padding: 10px 10px 2px;
		border-radius: 3px;
		.model-label{
			width: 20px;
			height: 20px;
			border-radius: 50%;
			overflow: hidden;
			text-align: center;
			line-height: 20px;
			background: #1B6EE6;
			color:#fff;
		}
		.img{
			margin-left: 10px;
			margin-right: 10px;
			width: 60px!important;
			height: 60px!important;
			border-radius: 50%;
			overflow: hidden;
		}
		.contacts-smalllink{
			position: relative;
			padding-bottom: 10px;
			border-bottom: 1px solid #EEEEEE;
			&:last-child{
				padding-bottom: 0;
				border-bottom: 0;
			}
			.voteCount{
				position: absolute;
				right:10px;
				top:50%;
				transform: translateY(-50%);
			}
		}
	}
	.detail-wrap .detail-item .detail-label{
		min-width: 56px;
	}
	/deep/uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked{
		border-color:#1B6EE6;
		background-color:#1B6EE6 ;
		color:#fff!important;
	}
</style>
