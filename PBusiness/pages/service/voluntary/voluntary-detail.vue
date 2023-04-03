<template>
	<view class="bg">
		<view class="model-wrap p15">
			<view style="width: 100%;" v-if="info.posterUrl">
				<image class="img" style="width: 100%;" :src="fileUrl(info.posterUrl)" mode="widthFix"></image>
			</view>
			<view class="model-box no-mb">
				<view class="model-item flex">
					<text class="model-label">活动名称</text>
					<view class="model-editText tr flex1 heigthAuto">
						<text class="title-model tl">
							{{info.name}}
						</text>
					</view>
				</view>
				<view class="model-item flex flexmid">
					<text class="model-label">活动地点</text>
					<view class="model-editText tr flex1">
						{{info.address}}
					</view>
				</view>
				<view class="model-item flex flexmid">
					<text class="model-label">报名时间</text>
					<view class="model-editText tr flex1">
						{{dateFilter(info.beginDate,'date')}}至{{dateFilter(info.endDate,'date')}}
					</view>
				</view>
				<view class="model-item position-relative">
					<view class="model-label mb5">活动说明</view>
					<view>
						<!-- {{info.content}} -->
						<jyf-parser class="art-con" :html="info.content" :domain="fileUrl('/r')"></jyf-parser>
					</view>
				</view>
			</view>
		</view>
		<text class="fixed-btn-rightBottom" :class="signUped == false ? 'disable' : ''" @tap="signUp">报名</text>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				id:"",
				infoId:"",
				info:{},
				signUped:true
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
				this.$http.get(`/mobile/party/vservice/serviceDetail/${this.id}`).then(res => {
					this.info =  res.volunteerService;
					let dateA = (new Date()).getTime();
					let endTime = this.dateFilter(res.volunteerService.endDate,'date') + ' 23:00:00';
					let endDate = new Date(endTime.replace(/-/g,"/")).getTime();
					if(dateA - endDate > 0){
						this.signUped = false
					}else{
						this.signUped = true
					}
				}).catch(err => {
					uni.showToast({title: err,icon: 'none'})
				});
			},
			//报名
			signUp(){
				if(this.signUped){
					this.jump(`/PBusiness/pages/service/voluntary/voluntary-singUp?id=${this.id}`)
				}else{
					uni.showToast({title: '报名已截至',icon: 'none'})
				}
			},
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/common/form.scss';//公共样式
	.model-editText{
		.img{
			width:90px;
			height: 64px;
		}
	}
	.art-con {
		font-size: 14px;
		margin-top: 15px;
		line-height: 24px;
		/deep/ img {
			max-width: 100%;
			height:auto!important;
			max-height: auto;
			margin-top:15px;
		}
	}
	.signUped{
		position: absolute;
		top: 1px;
		right: 0;
		background: url(../../../../static/img/signUped.png) no-repeat center;
		width: 60px;
		height: 60px;
		background-size: 100%;
	}
</style>
