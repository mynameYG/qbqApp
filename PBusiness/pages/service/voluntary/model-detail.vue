<template>
	<view class="yh-bg">
		<view class="whiteBg-opacity p15 radius6">
			<view class="field-title fs16">{{news.title || news.name}}</view>
			<view class="field-light mt10 mb10" v-if="news.createDate">发布时间：{{dateFilter(news.createDate,'date')}}</view>
			<jyf-parser class="art-con" :class="channelCode == 'sbhr' ? 'marginPage' : ''" :html="content" :domain="fileUrl('/r')"></jyf-parser>
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
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				id:"",
				unread:"",
				news:{},
				file: [],
				videoFile:[],
				previewImgList:[],
				content:"",
				channelCode:""
			}
		},
		onLoad(option) {
			this.id = option.id;
			this.channelCode = option.channelCode;
			console.log('channelCode',this.channelCode)
			this.name = option.name || '详情'
			if(option.name){
				uni.setNavigationBarTitle({
					title: option.name + '详情'
				})
			}
			let pageUrl = this.$config.url(getCurrentPages()[0].__page__.fullPath)
			console.log('‘========',pageUrl);
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.$http.get(`/mobile/party/channel/infoDetail/${this.id}`).then(res => {
					this.news = res.info;
					this.content = res.info.content;
					this.videoFile = [];
					for (var i = 0; i < res.attachs.length; i++) {
						if(res.attachs[i].fileType == 'image' || this.matchType(res.attachs[i].filename) == 'image'){
							this.previewImgList.push(this.fileUrl(res.attachs[i].url))
						}
						if(this.matchType(res.attachs[i].filename) == 'video'){
							console.log(123)
							this.videoFile.push({
								id:res.attachs[i].id,
								url:this.fileUrl(res.attachs[i].url),
								fileName:res.attachs[i].filename,
								fileType:this.matchType(res.attachs[i].filename)
							})
							console.log('this.videoFile',this.videoFile)
						}else{
							this.file.push({
								id:res.attachs[i].id,
								url:this.fileUrl(res.attachs[i].url),
								fileName:res.attachs[i].filename,
								fileType:this.matchType(res.attachs[i].filename)
							})
						}
						
					}
				})
			},
			playVideo(e) {
					console.log("视频Id",e, this.file)
					let currentId = e;			// 获取当前视频id
					let trailer = this.file	// 获取视频列表
					trailer.forEach((item, index) => {
						console.log('item',item)
						if(item != null && item != ''){
							let temp = 'video' + item.id;
							console.log('temp',temp,currentId)
							if(item.id != currentId){
								// 暂停其他视频
								uni.createVideoContext(temp, this).pause()
							}
						}
					})
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
	.marginPage{
		/deep/ img {
			// max-width: 64%;
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
