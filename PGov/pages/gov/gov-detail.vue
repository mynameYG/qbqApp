<template>
	<view class="yh-bg">
		<view class="whiteBg-opacity p15 radius6">
			<view class="field-title fs16">{{news.title}}</view>
			<view class="field-light mt10 mb10" v-if="news.releaseDate">发布时间：{{dateFilter(news.releaseDate,'date')}}</view>
			<jyf-parser class="art-con" :html="content" :domain="fileUrl('/r')"></jyf-parser>
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
				previewImgList:[],
				content:""
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
					'xxgk':`/mobile/gos/content/${this.channelId}/${this.id}`,
					'xzxk':`/mobile/gos/admin/${this.channelId}/${this.id}`
				}
				this.$http.get(jsonUrl[this.channelName]).then(res => {
					this.news = res;
					this.content = res.content;
					for (var i = 0; i < res.attachs.length; i++) {
						if(res.attachs[i].fileType == 'image' || this.matchType(res.attachs[i].filename) == 'image'){
							this.previewImgList.push(this.fileUrl(res.attachs[i].url))
						}
						this.file.push({
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
</style>
