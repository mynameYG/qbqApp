<template>
	<view class="bg">
		<template v-if="detailInfo">
			<view class="p15 list-wrap no-pb">
				<view class="detail-wrap" v-for="(item,index) in list" :key="item.id"  @tap="navToDetail(item.id)">
					<view class="detail-title text-ellipsis no-mb">{{item.title}}</view>
				</view>
			</view>
		</template>
		<template v-else>
			<view class="whiteBg-opacity p15 radius6">
				<view class="field-title fs16">{{detail.title || detail.name}}</view>
				<view class="field-light mt10 mb10" v-if="detail.createDate">发布时间：{{dateFilter(detail.createDate,'date')}}</view>
				<jyf-parser class="art-con" :html="detail.content" :domain="fileUrl('/r')"></jyf-parser>
				<template v-if="videoFile.length > 0">
					<view class="mt10">
						<view class="ad-video">
							<video :id="'video'+item.id" class="myVideo" 
							 v-for="(item,index) in videoFile" :key="item.id" @play="playVideo(item.id)"
							:autoplay="index == 0 ? true : false" 
							show-fullscreen-btn :src="item.url" 
							:controls="true" direction="0"></video>
						</view>
					</view>
				</template>
				<view class="mt10">
					<attachmentCheck v-if="file.length>0" :atts="file" :previewImgList="previewImgList"></attachmentCheck>
				</view>
			</view>
		</template>
		
		
		
		<!-- #ifdef MP-WEIXIN -->
		<text class="fixed-btn-rightBottom" @click="daohang">到这去</text>
		<!-- #endif -->
	</view>
</template>
<script>
	export default {
		data() {
			return {
				curId:"",
				list: [],
				itemInfo:{},
				detail:{},
				file: [],
				videoFile:[],
				previewImgList:[],
				detailInfo:true,
				currentId:"",
			}
		},
		onLoad(option){
			this.curId = option.curId;
			this.itemInfo = {
				title:option.pageName,
				destinationLat:option.destinationLat,
				destinationLng:option.destinationLng,
				address:option.address,
				phone:option.phone
			}
			if(option.currentId){
				this.currentId = option.currentId
			}
			if(option.pageName){
				uni.setNavigationBarTitle({
					title: option.pageName
				})
			}
		},
		onNavigationBarButtonTap() {
			//跳转到地图页
			this.jump(`/PGov/pages/index/map?pageName=${this.itemInfo.title}
			&destinationLat=${this.itemInfo.destinationLat}&destinationLng=${this.itemInfo.destinationLng}
			&address=${this.itemInfo.address}&phone=${this.itemInfo.phone}`)
		},
		mounted() {
			if(this.curId){
				this.getItemChildList(this.curId)
				return false
			}
			if(this.currentId){
				this.getItemDetail(this.currentId)
				return false
			}
		},
		methods: {
			// #ifdef MP-WEIXIN
			daohang(){
				uni.getLocation({
					success: res => {
						console.log('location success', res)
						uni.openLocation({
							latitude: res.latitude,
							longitude: res.longitude,
							scale: 18
						})
					}
				})
			},
			// #endif
			getItemChildList(itemId){
				this.$http.get(`/app/collection/article/${itemId}`).then(res =>{
					// console.log('=====res',res)
					this.detailInfo = true;
					this.list = [];
					var changeData = [];
					changeData = res;
					this.list = this.list.concat(changeData);
				})
			},
			navToDetail(itemId){
				this.jump(`/PGov/pages/index/mapChannel-itemInfo?currentId=${itemId}&pageName=${this.itemInfo.title}
			&destinationLat=${this.itemInfo.destinationLat}&destinationLng=${this.itemInfo.destinationLng}
			&address=${this.itemInfo.address}&phone=${this.itemInfo.phone}`)
			},
			getItemDetail(itemId){
				this.$http.get(`/app/collection/article/detail/${itemId}`).then(res =>{
					this.detailInfo = false;
					this.detail = res;
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/common/detail.scss';//公共样式
	.detail-wrap{
		overflow: inherit;
		.detail-btn{
			top: 12px;
			bottom: inherit;
			background: #fff;
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
	.field-title{
		font-weight: 600;
	}
	.field-light{
		text-align: right;
		color:#999;
		font-size:12px;
	}
	.ad-video{
		margin-bottom: 10px;
		height: calc(100vh / 2.6);
		width: 100%;
		.myVideo{
			width: 100%;
			height: 100%;
		}
	}
</style>
