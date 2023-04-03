<template>
	<view>
		<view class="p15 radius6 position-relative">
			<view class="field-title fs16">{{info.name}}</view>
			<view class="signUped" v-if="info.sign"></view>
			<view class="field-light mt10 mb10" v-if="info.releaseDate">发布时间：{{dateFilter(info.releaseDate,'date')}}</view>
			<jyf-parser class="art-con" :html="info.content" :domain="fileUrl('/r')"></jyf-parser>
		</view>
		<text v-if="!info.sign" class="fixed-btn-rightBottom" @tap="signUp">认领</text>
		<!-- 报名 -->
		<popup ref="popup" :info="infoId"></popup>
	</view>
	
</template>

<script>
	import popup from "./popup-singUp.vue"
	export default {
		components:{
			popup
		},
		data(){
			return{
				id:"",
				infoId:"",
				info:{
					sign:true
				}
			}
		},
		onLoad(option) {
			this.id = option.id;
			if(option.name){
				uni.setNavigationBarTitle({
					title: option.name
				})
			}
		},
		mounted(){
			this.init()
		},
		methods:{
			init(){
				this.$http.get(`/mobile/party/wish/wishDetail/${this.id}`).then(res => {
					this.info =  res.mMicroWish;
					this.info.sign = res.sign;
				}).catch(err => {
					uni.showToast({title: err,icon: 'none'})
				});
			},
			//报名
			signUp(){
				this.infoId = this.info.id;
				this.$refs.popup.init();
			}
		}
	}
</script>

<style lang="scss">
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
	.field-title{
		font-weight: 600;
	}
	.field-light{
		text-align: right;
		color:#999;
		font-size:12px;
	}
	.signUped{
		position: absolute;
		top: 1px;
		right: 10px;
		background: url(../../../../static/img/signUped_wish.png) no-repeat center;
		width: 60px;
		height: 60px;
		background-size: 100%;
	}
</style>
