<template>
	<view class="bg">
		<view class="detail-info">
			<view class="detail-wrap no-mb">
				<view class="detail-head">
					<view class="mb5 bold">{{info.name}}</view>
					<!-- <view class="fs12 color999">上报时间：{{dateFilter(info.reportDate,'dateminutes') || '-'}}</view> -->
				</view>
				<view class="detail-item flex">
					<text class="detail-label">预约场地</text>
					<text class="detail-text flex1">{{info.address || '-'}}</text>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">预约时间</text>
					<text class="detail-text flex1">{{dateFilter(appoint.startDate,'dateminutes') || ''}}至{{dateFilter(appoint.endDate,'minutes') || ''}}</text>
				</view>
				<view class="detail-item flex" v-if="appoint.auditFailReason">
					<text class="detail-label">预约状态</text>
					<text class="detail-text flex1 warning">{{appoint.auditFailReason|| ''}}</text>
				</view>
				<view class="detail-item flex" v-else>
					<text class="detail-label">预约状态</text>
					<text v-if="appoint.status.value != 'success'" class="detail-text flex1 warning">{{appoint.status.title|| ''}}</text>
					<text v-else class="detail-text flex1 success">{{appoint.status.title|| ''}}</text>
					
				</view>
		<!-- 		<view class="detail-item flex">
					<text class="detail-label">联系方式</text>
					<text class="detail-text flex1" @tap.stop="call(info.reportPersonPhone)">{{info.reportPersonPhone || '-'}}</text>
				</view> -->
				
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data(){
		return{
			id:"",
			info:{},
			appoint:{
				status:{
					title:""
				}
			},
		}
	},
	onLoad(option) {
		this.id = option.id;
		if(option.title){
			uni.setNavigationBarTitle({
				title: option.title + '详情'
			})
		}
	},
	mounted(){
		this.init();
	},
	methods:{
		init(){
			this.getInfo();
		},
		getInfo(){
			let _self = this;
			this.$http.get(`/mobile/appoint/appoint/${this.id}`).then(res => {
				this.info =  res.area;
				this.appoint = res.appoint;
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
