<template>
	<view class="detail-info-wrap">
		<view class="detail-info">
			<view class="detail-wrap no-mb">
				<view class="detail-head">
					<!-- <view class="mb5 bold">{{info.title}}</view> -->
					<view class="color999">上报时间：{{dateFilter(info.reportDate,'dateminutes') || '-'}}</view>
				</view>
				<!-- <view class="detail-item flex">
					<text class="detail-label">上报人</text>
					<text class="detail-text flex1">{{info.reportPerson || '-'}}</text>
				</view> -->
				<view class="detail-item flex">
					<text class="detail-label">问题类型</text>
					<text class="detail-text flex1">{{info.title || '-'}}</text>
				</view>
				<view class="detail-item flex" v-if="info.timeLimit">
					<text class="detail-label">处理时限</text>
					<text class="detail-text flex1">{{info.timeLimit || '-'}}</text>
				</view>
				<!-- <view class="detail-item flex">
					<text class="detail-label">联系方式</text>
					<text class="detail-text flex1" @tap.stop="call(info.phone)">{{info.phone || '-'}}</text>
				</view> -->
				<!-- 地图 -->
				<!-- <mapView ref="mapWrap"></mapView> -->
				<view class="map-wrap">
					<map id="maps" :latitude="latitude" :longitude="longitude" :markers="covers"  scale="16">
						<!-- <cover-view class="cover-view">
						</cover-view> -->
					</map>
				</view>
				<view class="detail-item flex" v-if="info.descripe">
					<text class="detail-label">问题描述</text>
					<text class="detail-text flex1">
						{{info.descripe || '-'}}
					</text>
				</view>
				<view class="detail-item">
					<attachmentCheck v-if="reportFileList.length > 0" :atts="reportFileList" :previewImgList="previewReportFileList" title="照片"></attachmentCheck>
				</view>
				
				
			</view>
		</view>
		
		<!-- 处理结果 -->
		<view class="detail-info" v-if="info.handleDate">
			<view class="detail-wrap no-mb">
				<view class="detail-item flex">
					<text class="detail-label">处理时间</text>
					<text class="detail-text flex1">{{dateFilter(info.handleDate,'dateminutes') || '-'}}</text>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">处理描述</text>
					<text class="detail-text flex1">
						<text class="textarea-auto">
							{{info.handleResult || '-'}}
						</text>
					</text>
				</view>
				<view class="detail-item">
					<attachmentCheck v-if="fileList.length > 0" :atts="fileList" :previewImgList="previewImgList" title="处理照片"></attachmentCheck>
				</view>
			</view>
		</view>
		
		
		<!-- 评价结果 -->
		<view class="detail-info" v-if="info.evaluateResult">
			<view class="detail-wrap no-mb">
				<view class="detail-item flex">
					<text class="detail-label">评价时间</text>
					<text class="detail-text flex1">{{dateFilter(info.evaluateDate,'dateminutes') || '-'}}</text>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">评价结果</text>
					<!-- <text class="detail-text flex1">{{dateFilter(info.evaluateDate,'dateminutes') || '-'}}</text> -->
					<view class="detail-text flex1">
						<radio-group >
							<label class="radio vedio-radio">
								<radio value="satisfied" disabled="disabled" :checked="info.evaluateResult == 'satisfied'" color="#1B6EE6" style="transform: scale(0.7);" />
								满意
							</label>
							<label class="radio vedio-radio">
								<radio value="commonly" disabled="disabled" :checked="info.evaluateResult == 'commonly'" color="#1B6EE6" style="transform: scale(0.7);" />
								一般
							</label>
							<label class="radio vedio-radio">
								<radio value="dissatisfied" disabled="disabled" :checked="info.evaluateResult == 'dissatisfied'" color="#1B6EE6" style="transform: scale(0.7);" />
								不满意
							</label>
						</radio-group>
					</view>
				</view>
				<view class="detail-item flex" v-if="info.evaluateContent">
					<text class="detail-label">评价内容</text>
					<text class="detail-text flex1">
						<text class="textarea-auto">
							{{info.evaluateContent || '-'}}
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
			mapType:this.$config.mapType,
			info:{},
			reportFileList:[],//上报问题附件
			previewReportFileList:[],
			fileList:[],
			previewImgList:[],
			longitude: "",
			latitude: "",
			covers: [],
			problemHandles:[]//处理过程
		}
	},
	onLoad(option) {
		this.id = option.id;
	},
	mounted(){
		this.getInfo();
	},
	methods:{
		getInfo(){
			let _self = this;
			this.$http.get(`/mobile/event/detail/${this.id}?mapType=${this.mapType}`).then(res => {
				console.log('re',res)
				this.info =  res.event;
				_self.longitude = res.event.lng;
				_self.latitude = res.event.lat;
				
				_self.covers = [];
				_self.covers.push({
					width:25,
					height:30,
					longitude: res.event.lng,
					latitude: res.event.lat,
					iconPath: '../../../static/img/location.png',
				});
				this.previewImgList.length = 0;
				this.fileList.length = 0;
				if(res.handleAttachs && res.handleAttachs.length > 0){
					for (var i = 0; i < res.handleAttachs.length; i++) {
						let File = {
							url: this.fileUrl(res.handleAttachs[i].url),
							fileName: res.handleAttachs[i].filename,
							fileType: res.handleAttachs[i].fileType ? res.handleAttachs[i].fileType :this.matchType(res.handleAttachs[i].filename)
						}
						console.log('itemFile',File)
						if (this.matchType(res.handleAttachs[i].filename) == 'image') {
							this.previewImgList.push(this.fileUrl(res.handleAttachs[i].url))
						}
						this.fileList.push(File);
						console.log('this.fileList',this.fileList)
					}
				}
				// this.approvalList = res.recordList;
				
				this.previewReportFileList.length = 0;
				this.reportFileList.length = 0;
				if(res.reportAttachs && res.reportAttachs.length > 0){
					for (var i = 0; i < res.reportAttachs.length; i++) {
						let itemFile = {
							url: this.fileUrl(res.reportAttachs[i].url),
							fileName: res.reportAttachs[i].filename,
							fileType: res.reportAttachs[i].fileType ? res.reportAttachs[i].fileType :this.matchType(res.reportAttachs[i].filename)
						}
						if(res.reportAttachs[i].role.value === 'report'){
							if (this.matchType(res.reportAttachs[i].filename) == 'image') {
								this.previewReportFileList.push(this.fileUrl(res.reportAttachs[i].url))
							}
							this.reportFileList.push(itemFile);
						}else{
							if (this.matchType(res.reportAttachs[i].filename) == 'image') {
								this.previewImgList.push(this.fileUrl(res.reportAttachs[i].url))
							}
							this.fileList.push(itemFile)
						}
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
		min-height: calc(100vh - 44px);
		// #ifdef APP-PLUS
		min-height: 100vh;
		// #endif
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
		/deep/ map{
			width: 100%;
			height: 100%
		}
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
