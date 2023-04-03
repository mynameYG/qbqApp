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
				channelId:"",
				content:"",
				news:{},
				file: [],
				previewImgList:[],
			}
		},
		onLoad(opt) {
			this.id = opt.id;
			this.channelId = opt.channelId;
			if(opt.name){
				uni.setNavigationBarTitle({
					title: opt.name + '详情'
				})
			}
		},
		mounted(){
			this.showCoent();
		},
		methods:{
			showCoent(){
				this.$http.get(`/mobile/tenement/content/${this.channelId}/${this.id}`).then(res => {
					//console.log('re',res)
					this.news = res;
					this.content = res.content;
					// 文件
					if(res.attachs){
						for (var i = 0; i < res.attachs.length; i++) {
							if (this.matchType(res.attachs[i].filename) == 'image') {
								this.previewImgList.push(this.fileUrl(res.attachs[i].url))
							}
							this.file.push({
								url: this.fileUrl(res.attachs[i].url),
								fileName: res.attachs[i].filename,
								fileType: this.matchType(res.attachs[i].filename)
							})
						}
					}
					
				}).catch(err => {
					uni.showToast({title: err,icon: 'none'})});
			}
			
		}
	}
</script>

<style lang="scss">
	.field-title{
		font-weight: 600;
	}
	.field-light{
		text-align: right;
		color:#999;
		font-size:12px;
	}
/* 	.about-bottom{
	    margin: 30px auto;
	    padding:0 15px;
	    font-size: 14px;
	    color:#333;
	    line-height: 24px;
	} */
	.art-con {
		font-size: 14px;
		line-height: 24px;
		/deep/ img {
			max-width: 100%;
			height:auto!important;
			max-height: auto;
			margin-top:15px;
		}
	}
</style>
