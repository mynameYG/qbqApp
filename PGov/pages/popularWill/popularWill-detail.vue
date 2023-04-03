<template>
	<view class="bg">
		<view class="detail-info">
			<view class="detail-wrap no-mb">
				<view class="detail-head">
					<view class="mb5 bold">{{info.title}}</view>
					<view class="color999">提交时间：{{dateFilter(info.signDate,'dateminutes') || '-'}}</view>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">类型</text>
					<text class="detail-text flex1">{{willTypeName || '-'}}</text>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">联系人</text>
					<text class="detail-text flex1">{{info.signUser || '-'}}</text>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">联系电话</text>
					<text class="detail-text flex1">{{info.signPhone || '-'}}</text>
				</view>
				<!-- <view class="detail-item flex">
					<text class="detail-label">企业位置</text>
					<text class="detail-text flex1">{{info.enterpriseAddress || '-'}}</text>
				</view> -->
				<view class="detail-item flex">
					<text class="detail-label">内容</text>
					<text class="detail-text flex1">
						{{info.content || '-'}}
					</text>
				</view>
				<view class="detail-item flex" v-if="!info.replyDate">
					<text class="detail-label">回复状态</text>
					<text class="detail-text flex1 warning">待回复</text>
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
					<text class="detail-label">回复内容</text>
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
			info:{
				type:{
					title:""
				}
			},
			willTypeName:"",
			problemHandles:[]//处理过程
		}
	},
	onLoad(option) {
		this.id = option.id; uni.ge
	},
	mounted(){
		let willType = uni.getStorageSync('willType');
		if(willType){
			this.willType = willType;
		}
		this.getInfo();
	},
	methods:{
		getInfo(){
			let _self = this;
			this.$http.get(`/mobile/popularWill/detail/${this.id}`).then(res => {
				this.info =  res;
				this.willType.forEach(item =>{
					if(item.code == res.type){
						this.willTypeName = item.title
					}
				})
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
