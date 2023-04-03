<template>
	<view class="bg">
		<view class="detail-info">
			<view class="detail-wrap no-mb">
				<view class="detail-head">
					<view class="mb5 bold">{{info.title}}</view>
					<view class="color999" style="font-size:14px;">发布时间：{{dateFilter(info.releaseDate,'date') || '-'}}</view>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">联系人</text>
					<text class="detail-text flex1">{{info.linkman || '-'}}</text>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">联系电话</text>
					<text class="detail-text flex1" @tap="call(info.phone)">{{info.phone || '-'}}</text>
				</view>
				<view class="detail-item flex" v-if="info.education">
					<text class="detail-label">学历</text>
					<text class="detail-text flex1">{{info.education || '-'}}</text>
				</view>
				<view class="detail-item flex" v-if="info.workExperience">
					<text class="detail-label">工作经验</text>
					<text class="detail-text flex1">{{info.workExperience || '-'}}</text>
				</view>
				<view class="detail-item flex" v-if="info.recruitNumber">
					<text class="detail-label">招聘人数</text>
					<text class="detail-text flex1">{{info.recruitNumber || '-'}}</text>
				</view>
				<view class="detail-item flex" v-if="info.salary">
					<text class="detail-label">薪资</text>
					<text class="detail-text flex1">{{info.salary || '-'}}</text>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">企业名称</text>
					<text class="detail-text flex1">{{info.enterpriseName || '-'}}</text>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">企业地址</text>
					<text class="detail-text flex1">{{info.address || '-'}}</text>
				</view>
				<view class="detail-item flex" v-if="info.companyProfile">
					<text class="detail-label">企业简介</text>
					<text class="detail-text flex1">{{info.companyProfile || '-'}}</text>
				</view>
				<view class="detail-item">
					<view class="detail-label">职位描述</view>
					<view class="detail-text">
						{{info.jobDescription || '-'}}
					</view>
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
			info:{},
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
			this.$http.get(`/mobile/pub/ent/recruit/detail/${this.id}`).then(res => {
				console.log('re---',res)
				this.info =  res;
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
