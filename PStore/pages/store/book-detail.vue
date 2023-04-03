<template>
	<view class="yh-bg">
		<view class="whiteBg-opacity p15 radius6">
			<view class="field-title fs16">{{news.title}}</view>
			<view class="field-light mt10 mb10" v-if="news.createTime">发布时间：{{dateFilter(news.createTime,'date')}}</view>
			<jyf-parser class="art-con" :html="news.content" :domain="fileUrl('/r')"></jyf-parser>
		</view>
		<view v-if="type == 'activity'" class="fixed-btn-rightBottom">
			报名
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				id:"",
				type:"",
				unread:"",
				news:{},
				file: [],
				previewImgList:[],
				content:""
			}
		},
		onLoad(option) {
			this.id = option.id;
			this.type = option.type;
			if(option.pageName){
				uni.setNavigationBarTitle({
					title: option.pageName
				})
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.$http.get(`/app/collection/article/detail/${this.id}`).then(res => {
					this.news = res;
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
		font-size: 28upx;
		margin-top: 30upx;
		line-height: 56upx;
		/deep/ img {
			max-width: 100%;
			height:auto!important;
			max-height: auto;
			margin-top:30upx;
		}
	}
	.field-title{
		font-weight: 600;
	}
	.field-light{
		text-align: right;
		color:#999;
		font-size:24upx;
	}
	.fixed-btn-rightBottom{
		bottom:60upx;
	}
</style>
