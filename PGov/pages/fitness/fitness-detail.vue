<template>
	<view class="bg">
		<view class="detail-info">
			<view class="detail-wrap no-mb">
				<view class="detail-head">
					<view class="mb5 bold">{{info.name}}</view>
					<!-- <view class="fs12 color999">上报时间：{{dateFilter(info.reportDate,'dateminutes') || '-'}}</view> -->
				</view>
				<view class="detail-item flex">
					<text class="detail-label">场地名称</text>
					<text class="detail-text flex1">{{info.name || '-'}}</text>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">场地地址</text>
					<text class="detail-text flex1">{{info.address || '-'}}</text>
				</view>
		<!-- 		<view class="detail-item flex">
					<text class="detail-label">联系方式</text>
					<text class="detail-text flex1" @tap.stop="call(info.reportPersonPhone)">{{info.reportPersonPhone || '-'}}</text>
				</view> -->
				<view class="detail-item">
					<attachmentCheck v-if="fileList.length > 0" :atts="fileList" :previewImgList="previewImgList" title="场地照片"></attachmentCheck>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">场地介绍</text>
					<text class="detail-text flex1">
						{{info.descripe || '-'}}
					</text>
				</view>
				
			</view>
		</view>
		<!-- 提示 -->
		<popup ref="popup" :info="content"></popup>
		
		<text class="fixed-btn-rightBottom" @click="jump(`/PGov/pages/fitness/fitness-add?id=${id}`)">预约</text>
	</view>
</template>

<script>
	import popup from '../../components/popup.vue'
export default {
	components:{
		popup
	},
	data(){
		return{
			id:"",
			title:"",
			info:{},
			fileList:[],
			previewImgList:[],
			content:"",
		}
	},
	onLoad(option) {
		this.id = option.id;
		this.title = option.title || '场地详情'
		if(option.title){
			uni.setNavigationBarTitle({
				title: option.title + '详情'
			})
		}
	},
	onNavigationBarButtonTap(e) {
		if(this.content){
			this.$refs.popup.init();
		}else{
			uni.showToast({
				icon:"none",
				title:"暂无公告"
			})
		}
	},
	mounted(){
		this.init();
	},
	methods:{
		init(){
			this.getInfo();
			this.getNotice();
		},
		getInfo(){
			let _self = this;
			this.$http.get(`/mobile/appoint/area/${this.id}`).then(res => {
				this.info =  res.area;
				this.previewImgList.length = 0;
				this.fileList.length = 0;
				if(res.imgs && res.imgs.length > 0){
					for (var i = 0; i < res.imgs.length; i++) {
						let File = {
							url: this.fileUrl(res.imgs[i].url),
							fileName: res.imgs[i].filename,
							fileType: res.imgs[i].fileType ? res.imgs[i].fileType :this.matchType(res.imgs[i].filename)
						}
						if (this.matchType(res.imgs[i].filename) == 'image') {
							this.previewImgList.push(this.fileUrl(res.imgs[i].url))
						}
						this.fileList.push(File);
					}
				}
				
			}).catch(err => {
				uni.showToast({title: err,icon: 'none'})
			});
		},
		getNotice(){
			this.$http.get(`/mobile/appoint/area/${this.id}/notice`).then(res =>{
				this.content = res;
			})
		}
	}
}
</script>

<style lang="scss">
	@import '@/PStore/common/detail.scss';//公共样式
	.detail-info-wrap{
		overflow: hidden;
		padding-bottom: 20px;
		background-color: #FAFAFA;
	}
	.detail-wrap .detail-item .detail-label{
		min-width: 60px;
	}
	.detail-info{
		padding:15px;
		padding-bottom: 0;
		.detail-head{
			margin-bottom: 15px;
			padding-bottom: 15px;
			border-bottom:1px solid #F2F2F2;
			font-size:15px;
		}
	}
	.map-wrap{
		margin:10px 0;
		overflow: hidden;
		height: 230px;
	}
	/deep/ uni-map{
		width: 100%;
		height: 100%
	}
	
	.cover-view {
		position: absolute;
		width:100%;
		height: 100%;
		top: 0;
		left: 0;
		opacity: .01;
	}
	.logo-cover{
		position: absolute;
		width:100px;
		height: 26px;
		bottom:1px;
		right:2px;
		background-color: #fff;
	}
	.atts-wrap{
		display: -webkit-box;
		display: -moz-box;
		display: box;
		display: -webkit-flex;
		display: -moz-flex;
		display: -ms-flexbox;
		display: flex;
		flex-wrap: wrap;
		-ms-flex-wrap: wrap;
		-webkit-flex-wrap: wrap;
		-webkit-box-lines: multiple;
		padding-left:70px
	}
	/deep/.atts-wrap .atts-tt{
		width: 60px;
		margin-right: 10px;
		margin-left: -70px;
	}
	/deep/.atts-wrap .atts-item{
		width: 62px;
		margin-right: 10px;
	}
	/deep/.atts-wrap .atts-name{
		display: none;
	}
</style>
