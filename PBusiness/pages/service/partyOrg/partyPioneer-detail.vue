<template>
	<view class="bg">
		<view class="p15 radius6">
			<view style="width: 100%;height:auto;" v-if="info.photoUrl">
				<image class="img" style="width: 100%;height:auto;" :src="fileUrl(info.photoUrl)" mode="widthFix"></image>
			</view>
			<jyf-parser class="art-con" :html="info.introduce" :domain="fileUrl('/r')"></jyf-parser>
		</view>
	</view>
	
</template>

<script>
	export default {
		data(){
			return{
				id:"",
				info:{},
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
				this.$http.get(`/mobile/party/org/memberDetail/${this.id}`).then(res => {
					this.info =  res;
				}).catch(err => {
					uni.showToast({title: err,icon: 'none'})
				});
			},
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
</style>
