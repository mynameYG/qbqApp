<template>
	<view class="bg">
		<view class="detail-info">
			<view class="detail-wrap no-mb">
				<view class="detail-head">
					<view class="mb5 bold">{{info.title}}</view>
					<view class="color999">提交时间：{{dateFilter(info.createDate,'dateminutes') || '-'}}</view>
				</view>
				<!-- <view class="detail-item flex">
					<text class="detail-label">咨询类型</text>
					<text class="detail-text flex1">{{info.title || '-'}}</text>
				</view> -->
				<!-- <view class="detail-item flex">
					<text class="detail-label">企业名称</text>
					<text class="detail-text flex1">{{info.enterpriseName || '-'}}</text>
				</view> -->
				<!-- <view class="detail-item flex">
					<text class="detail-label">联系人</text>
					<text class="detail-text flex1">{{info.enterpriseLinkman || '-'}}</text>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">联系电话</text>
					<text class="detail-text flex1">{{info.enterprisePhone || '-'}}</text>
				</view> -->
				<!-- <view class="detail-item flex">
					<text class="detail-label">企业位置</text>
					<text class="detail-text flex1">{{info.enterpriseAddress || '-'}}</text>
				</view> -->
				<view class="detail-item flex">
					<text class="detail-label">提交内容</text>
					<text class="detail-text flex1">
						{{info.content || '-'}}
					</text>
				</view>
				
				<view class="detail-item flex" v-if="channelCode == 'hyb' && !info.replyDate">
					<text class="detail-label">回复状态</text>
					<text class="detail-text flex1 warning">待回复</text>
				</view>
				<view v-if="channelCode =='gwgx'" class="detail-item">
					<attachmentCheck v-if="reportFileList.length > 0" :atts="reportFileList" :previewImgList="previewReportFileList" title="附件"></attachmentCheck>
				</view>
			</view>
		</view>
		
		<!-- 处理结果 -->
		<view class="detail-info" v-if="info.replyDate">
			<view class="detail-wrap no-mb">
				<view class="detail-item flex">
					<text class="detail-label">回复时间</text>
					<text class="detail-text flex1">{{dateFilter(info.replyDate,'dateminutes') || '-'}}</text>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">回复人</text>
					<text class="detail-text flex1">{{info.replyUser || ''}}{{info.handleUserName || ''}}</text>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">回复描述</text>
					<text class="detail-text flex1">
						<text class="textarea-auto">
							{{info.replyContent || '-'}}
						</text>
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data(){
		return{
			id:"",
			channelCode:"",
			info:{
				type:{
					title:""
				}
			},
			reportFileList:[],//上报问题附件
			previewReportFileList:[],
			problemHandles:[]//处理过程
		}
	},
	onLoad(option) {
		this.id = option.id;
		this.channelCode = option.channelCode;
		if(option.pageName){
			uni.setNavigationBarTitle({
				title: option.pageName
			})
		}
	},
	mounted(){
		this.getInfo();
	},
	methods:{
		getInfo(){
			let _self = this;
			let getJson = {
				'hyb':`/mobile/echo/detail/${this.id}`,
				'gwgx':`/mobile/perception/detail/${this.id}`
			}
			this.$http.get(getJson[this.channelCode]).then(res => {
				console.log('re',res)
				this.info =  res;
				this.previewReportFileList.length = 0;
				this.reportFileList.length = 0;
				let attFiles = res.attachs;
				if(attFiles && attFiles.length > 0){
					for (var i = 0; i < attFiles.length; i++) {
						let itemFile = {
							url: this.fileRUrl(attFiles[i].filepath),
							fileName: attFiles[i].filename,
							fileType: attFiles[i].filetype ? attFiles[i].filetype :this.matchType(attFiles[i].filename)
						}
						console.log('itemFile',itemFile)
						if (this.matchType(attFiles[i].filename) == 'image') {
							this.previewReportFileList.push(this.fileRUrl(attFiles[i].filepath))
						}
						this.reportFileList.push(itemFile);
					}
				}
				
				
				
			}).catch(err => {
				uni.showToast({title: err,icon: 'none'})
			});
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
