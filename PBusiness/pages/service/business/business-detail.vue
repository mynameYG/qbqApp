<template>
	<view class="yh-bg">
		<view class="whiteBg-opacity p15 radius6">
			<view class="field-title fs16">{{news.title || news.name}}</view>
			<view class="field-light mt10 mb10" v-if="news.releaseDate">发布时间：{{dateFilter(news.releaseDate,'date')}}</view>
			<jyf-parser class="art-con" :html="content" :domain="fileUrl('/r')"></jyf-parser>
			<template v-if="channelName == 'busHuanjing'">
				<view class="mt10">
					<view class="ad-video">
						<video :id="'video'+item.id" class="myVideo" 
						 v-for="(item,index) in file" :key="item.id" @play="playVideo(item.id)"
						:autoplay="index == 0 ? true : false" 
						show-fullscreen-btn :src="item.url" 
						:controls="true" direction="0"></video>
					</view>
				</view>
			</template>
			<template v-else>
				<view class="mt10">
					<attachmentCheck v-if="file.length>0" :atts="file" :previewImgList="previewImgList"></attachmentCheck>
				</view>
			</template>
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
				previewImgList:[],
				content:"",
				channelName:""
			}
		},
		onLoad(option) {
			this.id = option.id;
			this.channelId = option.channelId;
			this.channelName = option.channelName;
			this.name = option.name || '详情'
			if(option.name){
				uni.setNavigationBarTitle({
					title: option.name + '详情'
				})
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				let jsonUrl = {
					'busTiaoli':`/mobile/business/rule/${this.channelId}/${this.id}`,
					'busHuanjing':`/mobile/business/environment/detail/${this.id}`,
					'zhida' :`/mobile/business/zhida/${this.channelId}/${this.id}`
				}
				this.$http.get(jsonUrl[this.channelName]).then(res => {
					this.news = res;
					this.content = res.content;
					for (var i = 0; i < res.attachs.length; i++) {
						if(res.attachs[i].fileType == 'image' || this.matchType(res.attachs[i].filename) == 'image'){
							this.previewImgList.push(this.fileUrl(res.attachs[i].url))
						}
						this.file.push({
							id:res.attachs[i].id,
							url:this.fileUrl(res.attachs[i].url),
							fileName:res.attachs[i].filename,
							fileType:this.matchType(res.attachs[i].filename)
						})
					}
					
					if (this.unread === 'true') {
						let pages = getCurrentPages();
						if(pages.length > 1){
							// 获取上一级页面，即pageA的page对象
							let callback = pages[pages.length - 2].$vm['loadData'];
							callback && callback('refresh');
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
