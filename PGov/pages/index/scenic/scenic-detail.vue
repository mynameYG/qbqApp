<template>
	<view class="yh-bg">
		<view class="whiteBg-opacity p15 radius6">
			<view class="art-con">
				<img style="width:100%!important;margin-bottom:10px" :src="fileUrl(news.titlePictureUrl)" mode=""></img>
				<jyf-parser class="art-con" :html="content" :domain="fileUrl('/r')"></jyf-parser>
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
				content:"",
				title:""
			}
		},
		onLoad(option) {
			this.id = option.id;
			this.title = option.title || '淇澳+风景区简介'
			if(option.title){
				uni.setNavigationBarTitle({
					title: option.title + '简介'
				})
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.$http.get(`/mobile/indexSetting/app/detail/${this.id}`).then(res => {
					console.log('res',res)
					this.news = res;
					this.content = res.file;
					/* for (var i = 0; i < res.attachs.length; i++) {
						if(res.attachs[i].fileType == 'image' || this.matchType(res.attachs[i].filename) == 'image'){
							this.previewImgList.push(this.fileUrl(res.attachs[i].url))
						}
						this.file.push({
							url:this.fileUrl(res.attachs[i].url),
							fileName:res.attachs[i].filename,
							fileType:this.matchType(res.attachs[i].filename)
						})
					} */
				})
			},
		}
	}
</script>

<style lang="scss">
	.art-con {
		font-size: 14px;
		line-height: 24px;
		/deep/ img {
			max-width: 100%;
			// #ifndef MP-WEIXIN
			height:auto!important;
			// #endif
			max-height: auto;
		}
		p{
			// #ifndef MP-WEIXIN
			text-indent: 2em;
			// #endif
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
